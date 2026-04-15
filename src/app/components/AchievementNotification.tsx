import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { achievements } from "../data/courses";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, X } from "lucide-react";
import confetti from "canvas-confetti";

export function AchievementNotification() {
  const { newAchievements, clearNewAchievements } = useGame();
  const [currentAchievement, setCurrentAchievement] = useState<string | null>(null);

  useEffect(() => {
    if (newAchievements.length > 0 && !currentAchievement) {
      const achievementId = newAchievements[0];
      setCurrentAchievement(achievementId);
      
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.3 }
      });

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [newAchievements, currentAchievement]);

  const handleClose = () => {
    setCurrentAchievement(null);
    // Remove the first achievement from the queue
    setTimeout(() => {
      clearNewAchievements();
    }, 300);
  };

  const achievement = achievements.find(a => a.id === currentAchievement);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl shadow-2xl p-6 border-4 border-amber-300">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <Trophy className="w-8 h-8 text-amber-500" />
              </div>
              <div className="flex-1 text-white">
                <div className="text-sm font-semibold uppercase tracking-wide opacity-90 mb-1">
                  Achievement Unlocked! 🎉
                </div>
                <div className="text-xl font-bold mb-1">{achievement.title}</div>
                <div className="text-sm text-amber-100">{achievement.description}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
