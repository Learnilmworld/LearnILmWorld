import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CoursePlayer = () => {
  const { id } = useParams(); // URL se ID nikalne ke liye
  const [course, setCourse] = useState<any>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // ID ke basis par course details fetch karna
    axios.get(`${API_BASE_URL}/api/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error("Error fetching course:", err));
  }, [id]);

  if (!course) return <div className="p-10 text-center">Loading Content...</div>;

  return (
    <div className="min-h-screen bg-[#FFF9F0] p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <Link to="/student/courses" className="text-gray-500 hover:text-pink-600 mb-4 inline-block">
          ← Back to Courses
        </Link>

        {/* --- MAIN VIEWER AREA --- */}
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative">
          
          {/* Option A: Agar Video hai */}
          {course.contentType === 'video' ? (
            <iframe 
              src={course.contentUrl.replace("watch?v=", "embed/")} // Simple YouTube embed fix
              title={course.title}
              className="w-full h-full"
              allowFullScreen
            ></iframe>
            // Note: Professional production ke liye 'react-player' library use karein
          ) : (
            
            // Option B: Agar PDF/Doc hai
            <iframe 
              src={course.contentUrl} 
              className="w-full h-full bg-white"
            ></iframe>
          )}
        </div>

        {/* Title & Description */}
        <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
          <p className="text-gray-600 leading-relaxed">
            {course.description}
          </p>
        </div>

      </div>
    </div>
  );
};

export default CoursePlayer;