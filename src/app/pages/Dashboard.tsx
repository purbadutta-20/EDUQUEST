import { Link } from "react-router";
import { useGame } from "../context/GameContext";
import { courses, achievements } from "../data/courses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { Trophy, Award, BookOpen, TrendingUp, Star, Flame } from "lucide-react";

export function Dashboard() {
  const { userProgress, hasAchievement, userName } = useGame();

  const totalLessons = courses.reduce((sum, course) => sum + course.lessons.length, 0);
  const completionRate = Math.round((userProgress.completedLessons.length / totalLessons) * 100);
  const earnedAchievementsCount = achievements.filter(a => hasAchievement(a.id)).length;

  const recentCourses = courses.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
        <p className="text-gray-600">Continue your learning journey and unlock new achievements</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{userProgress.points}</div>
              <Trophy className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">Lessons Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{userProgress.completedLessons.length}</div>
              <BookOpen className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{userProgress.streak} days</div>
              <Flame className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{earnedAchievementsCount}/{achievements.length}</div>
              <Award className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Your Progress
          </CardTitle>
          <CardDescription>Overall completion across all courses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Course Completion</span>
              <span className="font-semibold text-purple-600">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{userProgress.completedLessons.length}</div>
              <div className="text-sm text-gray-600 mt-1">Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalLessons - userProgress.completedLessons.length}</div>
              <div className="text-sm text-gray-600 mt-1">Remaining</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{userProgress.perfectScores}</div>
              <div className="text-sm text-gray-600 mt-1">Perfect Scores</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Courses</h2>
          <Link to="/courses">
            <Button variant="ghost">View All →</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentCourses.map(course => {
            const completedInCourse = course.lessons.filter(l => 
              userProgress.completedLessons.includes(l.id)
            ).length;
            const courseProgress = Math.round((completedInCourse / course.lessons.length) * 100);

            return (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{course.title}</CardTitle>
                      <CardDescription className="text-sm">{course.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      {course.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{course.lessons.length} lessons</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{courseProgress}%</span>
                    </div>
                    <Progress value={courseProgress} className="h-2" />
                  </div>
                  <Link to="/courses">
                    <Button className="w-full">
                      {courseProgress === 0 ? "Start Course" : "Continue"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Recent Achievements
          </CardTitle>
          <CardDescription>Your latest accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.slice(0, 3).map(achievement => {
              const earned = hasAchievement(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    earned
                      ? "bg-amber-50 border-amber-300"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="text-3xl mb-2">{earned ? "🏆" : "🔒"}</div>
                  <div className="font-semibold mb-1">{achievement.title}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </div>
              );
            })}
          </div>
          <Link to="/achievements">
            <Button variant="outline" className="w-full mt-4">View All Achievements</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}