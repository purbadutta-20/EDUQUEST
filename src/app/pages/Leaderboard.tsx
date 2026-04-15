import { useGame } from "../context/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  lessons: number;
  streak: number;
  avatar: string;
}

export function Leaderboard() {
  const { userProgress, userName } = useGame();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard from backend
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-7bfbe619/leaderboard`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );

        if (!response.ok) {
          console.error('Failed to fetch leaderboard');
          setLoading(false);
          return;
        }

        const data = await response.json();
        
        // Generate avatars for users
        const avatars = ["🦊", "🐼", "🦁", "🐨", "🐯", "🐸", "🦅", "🐱", "🐶", "🐰", "🦉", "🐙"];
        
        const entries: LeaderboardEntry[] = data.leaderboard.map((user: any, index: number) => ({
          rank: index + 1,
          name: user.userName,
          points: user.points,
          lessons: user.completedLessons,
          streak: user.streak,
          avatar: user.userName === userName ? "⭐" : avatars[index % avatars.length]
        }));

        setLeaderboard(entries);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [userName]);

  const userRank = leaderboard.find(e => e.name === userName)?.rank || 0;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Leaderboard 🏆</h1>
        <p className="text-gray-600">See how you rank against other learners</p>
      </div>

      {/* User Stats Card */}
      <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
        <CardHeader>
          <CardTitle>Your Ranking</CardTitle>
          <CardDescription className="text-purple-100">
            Keep learning to climb the leaderboard!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">#{userRank}</div>
              <div className="text-sm opacity-90 mt-1">Rank</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{userProgress.points}</div>
              <div className="text-sm opacity-90 mt-1">Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{userProgress.completedLessons.length}</div>
              <div className="text-sm opacity-90 mt-1">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{userProgress.streak}</div>
              <div className="text-sm opacity-90 mt-1">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Top Learners</CardTitle>
          <CardDescription>Updated in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((entry) => {
              const isCurrentUser = entry.name === userName;
              
              return (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    isCurrentUser
                      ? "bg-purple-50 border-2 border-purple-300 shadow-md"
                      : entry.rank <= 3
                      ? "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  {/* Rank */}
                  <div className="w-12 flex-shrink-0 text-center">
                    {entry.rank === 1 ? (
                      <Trophy className="w-8 h-8 text-amber-500 mx-auto" />
                    ) : entry.rank === 2 ? (
                      <Medal className="w-8 h-8 text-gray-400 mx-auto" />
                    ) : entry.rank === 3 ? (
                      <Award className="w-8 h-8 text-amber-700 mx-auto" />
                    ) : (
                      <div className="text-xl font-bold text-gray-500">#{entry.rank}</div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 flex-shrink-0">
                    <div className={`w-full h-full rounded-full flex items-center justify-center text-2xl ${
                      isCurrentUser ? "bg-purple-200" : "bg-white border-2 border-gray-200"
                    }`}>
                      {entry.avatar}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold truncate ${isCurrentUser ? "text-purple-900" : ""}`}>
                      {entry.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded-full">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {entry.lessons} lessons completed
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        <span className="font-semibold text-amber-900">{entry.points}</span>
                      </div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <span className="text-base">🔥</span>
                        <span className="font-semibold text-orange-900">{entry.streak}</span>
                      </div>
                      <div className="text-xs text-gray-500">streak</div>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden flex flex-col items-end">
                    <div className="flex items-center gap-1 mb-1">
                      <Trophy className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold text-amber-900">{entry.points}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">🔥</span>
                      <span className="text-sm font-semibold text-orange-900">{entry.streak}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-4xl mb-3">💡</div>
            <div className="font-semibold mb-2">Pro Tip</div>
            <div className="text-sm text-gray-600">
              Complete more lessons and maintain your streak to climb the leaderboard!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}