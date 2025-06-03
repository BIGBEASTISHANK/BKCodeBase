"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState({
    email: "",
    username: "",
    level: 0,
    badges: [""],
    knowledgeLevel: [""],
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/verify", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // No valid cookie/token, redirect to home
          router.push("/");
          return;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // On error, redirect to home
        router.push("/");
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Logout successful, redirect to home
        router.push("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, redirect to home
      router.push("/");
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          className="text-white text-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  // If no user data, don't render anything (redirect is happening)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <motion.header
        className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Bandit Code
                </span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user.username}!</span>
              <motion.button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Welcome Section */}
          <div className="text-center">
            <motion.h2
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Welcome to Your Dashboard
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Ready to start your coding challenges and level up your skills?
            </motion.p>
          </div>

          {/* User Info Card */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-gray-700 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              Your Profile
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Username:</span>
                <span className="text-white font-medium">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white font-medium">{user.email}</span>
              </div>
              {user.knowledgeLevel && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Level: {user.level}</span>
                  <span className="text-green-400 font-medium">
                    {user.knowledgeLevel}
                  </span>
                </div>
              )}
              {user.badges && user.badges.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Badges:</span>
                  <span className="text-purple-400 font-medium">
                    {user.badges.length}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Action Cards */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.div
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-gray-700 cursor-pointer"
              whileHover={{ scale: 1.05, borderColor: "rgb(34 197 94)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4 className="text-lg font-semibold text-white mb-2">
                Start Challenges
              </h4>
              <p className="text-gray-400">
                Begin your coding journey with interactive challenges
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-gray-700 cursor-pointer"
              whileHover={{ scale: 1.05, borderColor: "rgb(59 130 246)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4 className="text-lg font-semibold text-white mb-2">
                View Progress
              </h4>
              <p className="text-gray-400">
                Track your learning progress and achievements
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-gray-700 cursor-pointer"
              whileHover={{ scale: 1.05, borderColor: "rgb(168 85 247)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4 className="text-lg font-semibent text-white mb-2">
                Leaderboard
              </h4>
              <p className="text-gray-400">
                See how you rank against other coders
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
