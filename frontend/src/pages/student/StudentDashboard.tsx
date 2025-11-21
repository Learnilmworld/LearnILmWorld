// src/pages/StudentDashboard.tsx
import React, { useState } from 'react'
// useEffect, ChangeEvent, FormEvent
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,  User, Calendar,  LogOut, Menu,
} from 'lucide-react'
// BookOpen, Star, Clock, Video, Globe,X, MessageSquare, TrendingUp, Users, MessageCircle removed from lucide icons
import { useAuth } from '../../contexts/AuthContext'
// import axios from 'axios'
// Component files
import StudentHome from "./StudentHome";
import StudentLanding from "./StudentLanding";
import StudentSessions from "./StudentSessions";
import StudentProfile from "./StudentProfile";

/* ---------------------------
   Notes:
   - Converted to TypeScript (tsx)
   - UI/layout follows EducatorDashboard pattern (sidebar, top bar, content area)
   - Kept all original logic intact (API calls, handlers, modals, validations)
   - Preserved original color palette (primary teal: #9787F3)
   - Minor TS typing added for clarity, without altering behavior
   --------------------------- */

/* ---------- Types ---------- */
type AnyObj = Record<string, any>

// const FRONTEND_URL= import.meta.env.VITE_FRONTEND_URL;
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

/* ---------------- StudentDashboard (root) ---------------- */
const StudentDashboard: React.FC = () => {
  const { logout } = useAuth() as AnyObj;
  // removed "user" from {} above
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/student/home", icon: Home },
    { name: "Dashboard", href: "/student", icon: Home },
    { name: "My Sessions", href: "/student/sessions", icon: Calendar },
    { name: "My Profile", href: "/student/profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/student")
      return location.pathname === "/student" || location.pathname === "/student/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#dc8d33]">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔹 Sticky, scrollable header with shine and animation */}
      <header className="sticky top-0 z-40 bg-[#2D274B]/95 backdrop-blur-sm border-b border-white/30 text-[#dc8d33] shadow-lg">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#CBE56A] hover:text-[#dc8d33] transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Animated Logo with Link */}
            <Link to="/" className="flex items-center gap-1 group">
              <div className="text-xl md:text-xl font-[Good Vibes] font-extrabold tracking-wide relative inline-flex items-center transition-transform duration-300 group-hover:scale-105">
                {/* LearniLM */}
                <span className="text-[#dc8d33] drop-shadow-lg group-hover:text-[#CBE56A] transition-colors">LearniLM</span>

                {/* Rotating Globe */}
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  className="inline-block mx-1 text-xl"
                >
                  🌎
                </motion.span>

                {/* World */}
                <span className="text-[#dc8d33] drop-shadow-lg group-hover:text-[#CBE56A] transition-colors">World</span>
              </div>
            </Link>
          </div>

          {/* Right: Role */}
          <div className="text-sm">
            Role:{" "}
            <span className="font-semibold text-[#CBE56A]">Student</span>
          </div>
        </div>
      </header>


      {/* Sidebar */}
      <div
        className={`fixed top-16 inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#2D274B] via-[#3B3361] to-[#2D274B] shadow-lg border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 mt-2 space-y-2">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-[#CBE56A] text-[#2D274B] shadow-md"
                    : "text-[#CBE56A] hover:bg-[#dc8d33]/20 hover:text-[#dc8d33] hover:translate-x-1"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" /> {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 bg-[#3B3361] text-[#CBE56A] hover:bg-[#CBE56A] hover:text-[#2D274B] rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            <LogOut className="h-5 w-5 mr-3" /> Sign Out
          </button>
        </div>
      </div>


      {/* Main Content */}
      <div className="pt-16 lg:pl-64"> {/* padding top = header height */}
        <div className="p-6">
          <Routes>
            <Route index element={<StudentHome />} />
            <Route path="home" element={<StudentLanding />} />
            <Route path="sessions" element={<StudentSessions />} />
            <Route path="profile" element={<StudentProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
