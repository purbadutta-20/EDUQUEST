import { useGame } from "../context/GameContext";
import { achievements } from "../data/courses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Star, Award, Trophy, BookOpen, Target, Flame, GraduationCap } from "lucide-react";

const iconMap: Record<string, any> = {
  Star,
  Trophy,
  BookOpen,
  Award,
  Target,
  Flame,
  GraduationCap,
};

export function Achievements() {
  const { userProgress, hasAchievement } = useGame();

  const earnedCount = achievements.filter(a => hasAchievement(a.id)).length;
  const totalCount = achievements.length;
  const completionRate = Math.round((earnedCount / totalCount) * 100);

  const getProgress = (achievement: typeof achievements[0]) => {
    switch (achievement.type) {
      case "points":
        return Math.min((userProgress.points / achievement.requirement) * 100, 100);
      case "lessons":
        return Math.min((userProgress.completedLessons.length / achievement.requirement) * 100, 100);
      case "streak":
        return Math.min((userProgress.streak / achievement.requirement) * 100, 100);
      case "perfect":
        return Math.min((userProgress.perfectScores / achievement.requirement) * 100, 100);
      default:
        return 0;
    }
  };

  const getCurrentValue = (achievement: typeof achievements[0]) => {
    switch (achievement.type) {
      case "points":
        return userProgress.points;
      case "lessons":
        return userProgress.completedLessons.length;
      case "streak":
        return userProgress.streak;
      case "perfect":
        return userProgress.perfectScores;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Achievements 🏆</h1>
        <p className="text-gray-600">Unlock achievements by completing lessons and challenges</p>
      </div>

      {/* Overall Progress */}
      <Card className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Your Achievement Progress</CardTitle>
          <CardDescription className="text-amber-100">
            {earnedCount} of {totalCount} achievements unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">{completionRate}%</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(earnedCount / (totalCount / 5))
                        ? "fill-white"
                        : "opacity-50"
                    }`}
                  />
                ))}
              </div>
            </div>
            <Progress value={completionRate} className="h-3 bg-amber-600" />
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const earned = hasAchievement(achievement.id);
          const progress = getProgress(achievement);
          const currentValue = getCurrentValue(achievement);
          const Icon = iconMap[achievement.icon] || Star;

          return (
            <Card
              key={achievement.id}
              className={`transition-all ${
                earned
                  ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-lg"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      earned
                        ? "bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg"
                        : "bg-gray-300"
                    }`}
                  >
                    {earned ? (
                      <Icon className="w-8 h-8 text-white" />
                    ) : (
                      <div className="text-2xl">🔒</div>
                    )}
                  </div>
                  {earned && (
                    <div className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-semibold">
                      UNLOCKED
                    </div>
                  )}
                </div>
                <CardTitle className={earned ? "text-amber-900" : "text-gray-700"}>
                  {achievement.title}
                </CardTitle>
                <CardDescription className={earned ? "text-amber-700" : ""}>
                  {achievement.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!earned && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">
                        {currentValue} / {achievement.requirement}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
                {earned && (
                  <div className="flex items-center justify-center py-2">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Trophy className="w-5 h-5" />
                      <span className="font-semibold">Achievement Unlocked!</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Motivational Card */}
      {earnedCount < totalCount && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-5xl mb-3">🎯</div>
              <div className="font-semibold text-lg mb-2">Keep Going!</div>
              <div className="text-gray-600">
                You're {totalCount - earnedCount} achievement{totalCount - earnedCount !== 1 ? "s" : ""} away from completing your collection!
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {earnedCount === totalCount && (
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl font-bold mb-2">Master Achiever!</div>
              <div className="text-purple-100 text-lg">
                Congratulations! You've unlocked all achievements!
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
