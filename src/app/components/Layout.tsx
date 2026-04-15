import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Home, BookOpen, Trophy, Award, Menu, LogOut } from "lucide-react";
import { useGame } from "../context/GameContext";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { useState } from "react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProgress } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/courses", label: "Courses", icon: BookOpen },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { path: "/achievements", label: "Achievements", icon: Award },
  ];

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      try {
        // Sign out from Supabase
        await supabase.auth.signOut();
        
        // Clear local storage
        localStorage.removeItem('eduquest_access_token');
        
        // Redirect to login
        navigate('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                EduQuest
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={isActive ? "" : "text-gray-600 hover:text-gray-900"}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* User Stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-full">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-amber-900">{userProgress.points}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full">
                <span className="text-xl">🔥</span>
                <span className="font-semibold text-orange-900">{userProgress.streak}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-full">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-amber-900">{userProgress.points}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full">
                  <span className="text-xl">🔥</span>
                  <span className="font-semibold text-orange-900">{userProgress.streak}</span>
                </div>
              </div>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start ${isActive ? "" : "text-gray-600"}`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}