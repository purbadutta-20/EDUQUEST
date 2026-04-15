import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { courses } from "../data/courses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { BookOpen, Trophy, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import confetti from "canvas-confetti";

export function Lesson() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson, getLessonScore } = useGame();

  const course = courses.find(c => c.id === courseId);
  const lesson = course?.lessons.find(l => l.id === lessonId);

  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const previousScore = getLessonScore(lessonId || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentQuestion, showQuiz]);

  if (!course || !lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Lesson not found</p>
        <Button onClick={() => navigate("/courses")} className="mt-4">
          Back to Courses
        </Button>
      </div>
    );
  }

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < lesson.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate score
      let totalScore = 0;
      newAnswers.forEach((answer, index) => {
        if (answer === lesson.quiz[index].correctAnswer) {
          totalScore += lesson.quiz[index].points;
        }
      });
      setScore(totalScore);
      setShowResults(true);

      // Check if perfect score
      const maxScore = lesson.quiz.reduce((sum, q) => sum + q.points, 0);
      const isPerfect = totalScore === maxScore;

      // Complete lesson
      completeLesson(lesson.id, totalScore, isPerfect);

      // Confetti for good scores
      if (totalScore >= maxScore * 0.8) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRetry = () => {
    setShowQuiz(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    const maxScore = lesson.quiz.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / maxScore) * 100);
    const isPerfect = score === maxScore;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/courses")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl mb-2">
              {isPerfect ? "Perfect Score! 🎉" : percentage >= 80 ? "Great Job! 🌟" : percentage >= 60 ? "Good Effort! 👍" : "Keep Practicing! 💪"}
            </CardTitle>
            <CardDescription className="text-lg">
              You scored {score} out of {maxScore} points
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-6xl font-bold text-purple-600 mb-2">{percentage}%</div>
              <Progress value={percentage} className="h-3" />
            </div>

            {previousScore !== null && score > previousScore && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 font-semibold">New High Score!</div>
                <div className="text-green-600 text-sm">
                  Previous: {previousScore} points → New: {score} points
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="text-lg font-semibold">Review:</div>
              {lesson.quiz.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect
                        ? "bg-green-50 border-green-300"
                        : "bg-red-50 border-red-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium mb-2">{question.question}</div>
                        <div className="text-sm space-y-1">
                          <div className={isCorrect ? "text-green-700" : "text-red-700"}>
                            Your answer: {question.options[userAnswer]}
                          </div>
                          {!isCorrect && (
                            <div className="text-green-700">
                              Correct answer: {question.options[question.correctAnswer]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleRetry} variant="outline" className="flex-1">
                Try Again
              </Button>
              <Button onClick={() => navigate("/courses")} className="flex-1">
                Back to Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showQuiz) {
    const question = lesson.quiz[currentQuestion];
    const progress = ((currentQuestion + 1) / lesson.quiz.length) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setShowQuiz(false)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lesson
          </Button>
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {lesson.quiz.length}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Quiz Progress</span>
            <span className="font-semibold text-purple-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{question.question}</CardTitle>
            <CardDescription>{question.points} points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? "border-purple-500 bg-purple-500"
                      : "border-gray-300"
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            ))}

            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="w-full mt-4"
            >
              {currentQuestion < lesson.quiz.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/courses")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Courses
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm text-purple-600 font-semibold mb-2">{course.title}</div>
              <CardTitle className="text-3xl mb-2">{lesson.title}</CardTitle>
              <CardDescription className="text-base">{lesson.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-lg">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-amber-900">{lesson.points} pts</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Lesson Content
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
            {lesson.content}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ready to Test Your Knowledge?</CardTitle>
          <CardDescription>
            Complete the quiz to earn {lesson.points} points and unlock the next lesson
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <div className="font-semibold">Quiz</div>
                <div className="text-sm text-gray-600">{lesson.quiz.length} questions</div>
              </div>
              <Button onClick={handleStartQuiz}>
                Start Quiz
              </Button>
            </div>
            {previousScore !== null && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-800">
                  Your best score: {previousScore} / {lesson.points} points
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
