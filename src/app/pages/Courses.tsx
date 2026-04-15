import { Link } from "react-router";
import { useGame } from "../context/GameContext";
import { courses } from "../data/courses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Code, BarChart, Palette, CheckCircle, Lock } from "lucide-react";
import { useState } from "react";

const iconMap: Record<string, any> = {
  Code,
  BarChart,
  Palette,
};

export function Courses() {
  const { userProgress, isLessonCompleted } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = selectedCategory === "All" 
    ? courses 
    : courses.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Explore Courses</h1>
        <p className="text-gray-600">Choose a course and start your learning adventure</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map(course => {
          const Icon = iconMap[course.icon] || Code;
          const completedLessons = course.lessons.filter(l => 
            isLessonCompleted(l.id)
          ).length;
          const progress = Math.round((completedLessons / course.lessons.length) * 100);

          return (
            <Card key={course.id} className="hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                    course.difficulty === "Beginner" ? "from-green-400 to-green-600" :
                    course.difficulty === "Intermediate" ? "from-blue-400 to-blue-600" :
                    "from-purple-400 to-purple-600"
                  }`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="mb-2">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Badge variant={
                        course.difficulty === "Beginner" ? "default" : 
                        course.difficulty === "Intermediate" ? "secondary" : 
                        "outline"
                      }>
                        {course.difficulty}
                      </Badge>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        {course.totalPoints} pts
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      {completedLessons}/{course.lessons.length} lessons completed
                    </span>
                    <span className="font-semibold text-purple-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-700 mb-3">Lessons:</div>
                  {course.lessons.map((lesson, index) => {
                    const completed = isLessonCompleted(lesson.id);
                    const previousCompleted = index === 0 || isLessonCompleted(course.lessons[index - 1].id);
                    const isLocked = !previousCompleted;

                    return (
                      <div
                        key={lesson.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          completed
                            ? "bg-green-50 border-green-200"
                            : isLocked
                            ? "bg-gray-50 border-gray-200 opacity-60"
                            : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-sm"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          completed
                            ? "bg-green-500"
                            : isLocked
                            ? "bg-gray-300"
                            : "bg-purple-500"
                        }`}>
                          {completed ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : isLocked ? (
                            <Lock className="w-4 h-4 text-gray-600" />
                          ) : (
                            <span className="text-white font-semibold text-sm">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{lesson.title}</div>
                          <div className="text-xs text-gray-600">{lesson.points} points</div>
                        </div>
                        {!isLocked && (
                          <Link to={`/lesson/${course.id}/${lesson.id}`}>
                            <Button size="sm" variant={completed ? "outline" : "default"}>
                              {completed ? "Review" : "Start"}
                            </Button>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
