import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { supabase } from "../lib/supabase";
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Button } from "../components/ui/button";
import { Award, Lock, Mail, User } from "lucide-react";
import { PasswordHelper } from "../components/PasswordHelper";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordHelper, setShowPasswordHelper] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }

    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter');
      return false;
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number');
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call backend signup endpoint
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7bfbe619/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
            name: name.trim()
          })
        }
      );

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Fallback: Create user directly with Supabase
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              name: name.trim()
            }
          }
        });

        if (signupError) {
          setError(signupError.message);
          console.error('Signup error:', signupError);
          setLoading(false);
          return;
        }

        if (signupData.user) {
          // Sign in after signup
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          });

          if (signInError) {
            // If email not confirmed, wait and retry
            if (signInError.message.includes('Email not confirmed')) {
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              const { data: retryLogin, error: retryError } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
              });

              if (!retryError && retryLogin.session) {
                localStorage.setItem('eduquest_access_token', retryLogin.session.access_token);
                
                const initialProgress = {
                  completedLessons: [],
                  points: 0,
                  streak: 0,
                  lastVisit: new Date().toISOString(),
                  perfectScores: 0,
                  lessonScores: {},
                  earnedAchievements: [],
                  userName: name.trim()
                };
                localStorage.setItem('userProgress', JSON.stringify(initialProgress));
                
                navigate('/');
                return;
              }
            }
            
            setError('Account created! Please try signing in.');
            setTimeout(() => navigate('/login'), 2000);
            setLoading(false);
            return;
          }

          if (signInData.session) {
            localStorage.setItem('eduquest_access_token', signInData.session.access_token);
            
            const initialProgress = {
              completedLessons: [],
              points: 0,
              streak: 0,
              lastVisit: new Date().toISOString(),
              perfectScores: 0,
              lessonScores: {},
              earnedAchievements: [],
              userName: name.trim()
            };
            localStorage.setItem('userProgress', JSON.stringify(initialProgress));
            
            navigate('/');
          }
        }
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        console.error('Signup error:', data.error);
        setLoading(false);
        return;
      }

      // After successful signup, sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        // If email not confirmed, wait and retry
        if (signInError.message.includes('Email not confirmed')) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: retryLogin, error: retryError } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          });

          if (!retryError && retryLogin.session) {
            localStorage.setItem('eduquest_access_token', retryLogin.session.access_token);
            
            const initialProgress = {
              completedLessons: [],
              points: 0,
              streak: 0,
              lastVisit: new Date().toISOString(),
              perfectScores: 0,
              lessonScores: {},
              earnedAchievements: [],
              userName: name.trim()
            };
            localStorage.setItem('userProgress', JSON.stringify(initialProgress));
            
            navigate('/');
            return;
          }
        }
        
        setError('Account created! Please try signing in.');
        setTimeout(() => navigate('/login'), 2000);
        setLoading(false);
        return;
      }

      if (signInData.session) {
        localStorage.setItem('eduquest_access_token', signInData.session.access_token);
        
        const initialProgress = {
          completedLessons: [],
          points: 0,
          streak: 0,
          lastVisit: new Date().toISOString(),
          perfectScores: 0,
          lessonScores: {},
          earnedAchievements: [],
          userName: name.trim()
        };
        localStorage.setItem('userProgress', JSON.stringify(initialProgress));
        
        navigate('/');
      }
    } catch (err: any) {
      console.error('Unexpected signup error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Join EduQuest
          </h1>
          <p className="text-gray-600">Create your account and start learning</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Purba Dutta"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowPasswordHelper(true)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {showPasswordHelper && (
              <PasswordHelper password={password} showRequirements={true} />
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔒 Your data is secured with enterprise-grade encryption</p>
        </div>
      </div>
    </div>
  );
}
