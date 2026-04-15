import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { achievements } from "../data/courses";
import { supabase, getCurrentUser } from "../lib/supabase";
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface UserProgress {
  completedLessons: string[];
  points: number;
  streak: number;
  lastVisit: string;
  perfectScores: number;
  lessonScores: Record<string, number>;
  earnedAchievements: string[];
  userName: string;
}

interface GameContextType {
  userProgress: UserProgress;
  completeLesson: (lessonId: string, score: number, isPerfect: boolean) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getLessonScore: (lessonId: string) => number | null;
  hasAchievement: (achievementId: string) => boolean;
  newAchievements: string[];
  clearNewAchievements: () => void;
  userName: string;
  loading: boolean;
  isAuthenticated: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedLessons: [],
    points: 0,
    streak: 0,
    lastVisit: new Date().toISOString(),
    perfectScores: 0,
    lessonScores: {},
    earnedAchievements: [],
    userName: "User"
  });

  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch user progress from backend
  const fetchProgress = async () => {
    try {
      const accessToken = localStorage.getItem('eduquest_access_token');
      if (!accessToken) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7bfbe619/progress`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch progress, using local data');
        
        // Fallback to local storage for offline mode
        const saved = localStorage.getItem("userProgress");
        if (saved) {
          const parsed = JSON.parse(saved);
          setUserProgress(parsed);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('eduquest_access_token');
        }
        setLoading(false);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Backend not available, using local storage');
        const saved = localStorage.getItem("userProgress");
        if (saved) {
          const parsed = JSON.parse(saved);
          setUserProgress(parsed);
          setIsAuthenticated(true);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.progress) {
        setUserProgress(data.progress);
        setIsAuthenticated(true);
        // Also save to local storage as backup
        localStorage.setItem("userProgress", JSON.stringify(data.progress));
      }
    } catch (error) {
      console.error('Error fetching progress, using local fallback:', error);
      // Use local storage as fallback
      const saved = localStorage.getItem("userProgress");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserProgress(parsed);
        setIsAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Save progress to backend
  const saveProgress = async (progress: UserProgress) => {
    try {
      const accessToken = localStorage.getItem('eduquest_access_token');
      if (!accessToken) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7bfbe619/progress`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ progress })
        }
      );

      if (!response.ok) {
        console.error('Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Load progress on mount
  useEffect(() => {
    fetchProgress();
  }, []);

  // Save progress whenever it changes (debounced)
  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Always save to localStorage immediately
      localStorage.setItem("userProgress", JSON.stringify(userProgress));
      
      // Debounce backend sync
      const timeoutId = setTimeout(() => {
        saveProgress(userProgress);
      }, 1000); // Debounce saves by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [userProgress, loading, isAuthenticated]);

  // Update streak
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const lastVisit = new Date(userProgress.lastVisit);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        setUserProgress(prev => ({ ...prev, streak: prev.streak + 1, lastVisit: today.toISOString() }));
      } else if (daysDiff > 1) {
        setUserProgress(prev => ({ ...prev, streak: 1, lastVisit: today.toISOString() }));
      }
    }
  }, [loading, isAuthenticated]);

  const checkAchievements = (updatedProgress: UserProgress) => {
    const newlyEarned: string[] = [];

    achievements.forEach(achievement => {
      if (!updatedProgress.earnedAchievements.includes(achievement.id)) {
        let earned = false;

        switch (achievement.type) {
          case "points":
            earned = updatedProgress.points >= achievement.requirement;
            break;
          case "lessons":
            earned = updatedProgress.completedLessons.length >= achievement.requirement;
            break;
          case "streak":
            earned = updatedProgress.streak >= achievement.requirement;
            break;
          case "perfect":
            earned = updatedProgress.perfectScores >= achievement.requirement;
            break;
        }

        if (earned) {
          newlyEarned.push(achievement.id);
        }
      }
    });

    if (newlyEarned.length > 0) {
      setNewAchievements(prev => [...prev, ...newlyEarned]);
      return [...updatedProgress.earnedAchievements, ...newlyEarned];
    }

    return updatedProgress.earnedAchievements;
  };

  const completeLesson = (lessonId: string, score: number, isPerfect: boolean) => {
    setUserProgress(prev => {
      const updatedProgress = {
        ...prev,
        completedLessons: prev.completedLessons.includes(lessonId) 
          ? prev.completedLessons 
          : [...prev.completedLessons, lessonId],
        points: prev.points + score,
        perfectScores: isPerfect ? prev.perfectScores + 1 : prev.perfectScores,
        lessonScores: {
          ...prev.lessonScores,
          [lessonId]: Math.max(prev.lessonScores[lessonId] || 0, score)
        }
      };

      const earnedAchievements = checkAchievements(updatedProgress);
      return { ...updatedProgress, earnedAchievements };
    });
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress.completedLessons.includes(lessonId);
  };

  const getLessonScore = (lessonId: string) => {
    return userProgress.lessonScores[lessonId] || null;
  };

  const hasAchievement = (achievementId: string) => {
    return userProgress.earnedAchievements.includes(achievementId);
  };

  const clearNewAchievements = () => {
    setNewAchievements([]);
  };

  return (
    <GameContext.Provider 
      value={{ 
        userProgress, 
        completeLesson, 
        isLessonCompleted, 
        getLessonScore,
        hasAchievement,
        newAchievements,
        clearNewAchievements,
        userName: userProgress.userName,
        loading,
        isAuthenticated
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}