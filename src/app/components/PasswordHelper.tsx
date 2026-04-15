import { Card, CardContent } from "./ui/card";
import { CheckCircle2, Circle } from "lucide-react";

interface PasswordHelperProps {
  password: string;
  showRequirements?: boolean;
}

export function PasswordHelper({ password, showRequirements = true }: PasswordHelperProps) {
  const requirements = [
    { label: "At least 8 characters", test: password.length >= 8 },
    { label: "One uppercase letter (A-Z)", test: /[A-Z]/.test(password) },
    { label: "One lowercase letter (a-z)", test: /[a-z]/.test(password) },
    { label: "One number (0-9)", test: /[0-9]/.test(password) },
  ];

  const allMet = requirements.every(req => req.test);

  if (!showRequirements) {
    return null;
  }

  return (
    <Card className="border-2 border-blue-100 bg-blue-50/50">
      <CardContent className="pt-4 pb-4">
        <h4 className="font-medium text-sm text-gray-700 mb-3">Password Requirements:</h4>
        <div className="space-y-2">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {req.test ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              <span className={req.test ? "text-green-700" : "text-gray-600"}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
        {password.length > 0 && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-gray-600">
              {allMet ? (
                <span className="text-green-700 font-medium">✓ Password meets all requirements</span>
              ) : (
                <span>Complete all requirements above</span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
