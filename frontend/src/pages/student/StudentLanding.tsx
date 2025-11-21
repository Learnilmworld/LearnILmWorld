// src/pages/student/StudentLanding.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ServiceCard from "./components/ServiceCard";
import FeatureCard from "./components/FeatureCard";
import { BookOpen, Users, MessageCircle, Star, TrendingUp } from "lucide-react";

/* ---------- Types ---------- */
type AnyObj = Record<string, any>


/* ---------------- StudentLanding Home ---------------- */
const StudentLanding: React.FC = () => {
  const { user } = useAuth() as AnyObj

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-6 py-10">
      {/* Welcome Section (Shiny Gradient like Dashboard) */}
      <div className="rounded-2xl p-8 bg-gradient-to-r from-[#f97316] to-[#9787F3] shadow-2xl text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold drop-shadow-md">
            Keep Growing, {user?.name || "Learner"}! 🚀
          </h1>
        </div>
        <p className="text-white/90 font-medium">
          Every step you take brings you closer to mastering your goals with LearniLM🌎World..
        </p>
      </div>

      {/* Explore Services */}
      <div>
        <h2 className="text-2xl font-bold text-[#2D274B] mb-6 text-center">Explore Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard
            icon={<BookOpen className="w-6 h-6 text-white" />}
            bg="bg-gradient-to-br from-emerald-500 to-emerald-600"
            title="English Training"
            desc="Improve communication and language skills"
            color="text-emerald-100"
          />
          <ServiceCard
            icon={<Users className="w-6 h-6 text-white" />}
            bg="bg-gradient-to-br from-blue-500 to-blue-600"
            title="Professional Trainers"
            desc="Get expert guidance for your career path"
            color="text-blue-100"
          />
          <ServiceCard
            icon={<MessageCircle className="w-6 h-6 text-white" />}
            bg="bg-gradient-to-br from-purple-500 to-purple-600"
            title="Improve Communication"
            desc="Practice and perfect your interview skills"
            color="text-purple-100"
          />
          <ServiceCard
            icon={<Star className="w-6 h-6 text-white" />}
            bg="bg-gradient-to-br from-orange-500 to-orange-600"
            title="Language Development"
            desc="Build confidence and interpersonal skills"
            color="text-orange-100"
          />
        </div>
      </div>

      {/* Bottom Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FeatureCard
          icon={<Users className="w-6 h-6 text-emerald-500" />}
          title="Find Your Perfect Trainer"
          desc="Browse through our network of expert trainers and counselors to find the perfect match for your learning goals."
          btnText={<Link to="/main" className="block">Browse All Trainers</Link>}
          btnColor="bg-emerald-500 hover:bg-emerald-600"
        />
        <FeatureCard
          icon={<MessageCircle className="w-6 h-6 text-blue-500" />}
          title="Your Learning Journey"
          desc="Keep track of your sessions, view feedback from trainers, and monitor your progress."
          btnText={<Link to="/student/sessions" className="block">View My Sessions</Link>}
          btnColor="bg-blue-500 hover:bg-blue-600"
        />
      </div>
    </div>
  )
}

export default StudentLanding;
