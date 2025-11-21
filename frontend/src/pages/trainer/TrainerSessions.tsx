import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Calendar, Video, Clock } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const TrainerSessions = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/sessions/my-sessions`);
      setSessions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId: string, status: string) => {
    try {
      await axios.put(`${API_BASE_URL}/api/sessions/${sessionId}/status`, { status });
      fetchSessions();
    } catch (err) {
      console.error("Failed to update session status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-dots">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-gray-900">My Sessions</h2>
        <Link
          to="/trainer/students"
          className="px-5 py-2 rounded-xl bg-[#3B3361] text-[#CBE56A] font-medium hover:bg-[#CBE56A] hover:text-[#2D274B] shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
        >
          <Calendar className="h-5 w-5 mr-2" /> Create New Session
        </Link>
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session: any) => (
              <div
                key={session._id || session.id}
                className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#CBE56A] rounded-lg flex items-center justify-center shrink-0">
                      <Video className="h-5 w-5 text-[#3B3361]" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-xs text-gray-600">
                        {session.students?.length || 0} student(s)
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {session.scheduledDate
                          ? new Date(session.scheduledDate).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Status + Buttons */}
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        session.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : session.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : session.status === "active"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {String(session.status).toUpperCase()}
                    </div>

                    <div className="flex gap-2">
  {session.status === "scheduled" && (
    <button
      onClick={async () => {
        try {
          // 1️⃣ Update session to "active"
          await updateSessionStatus(session._id || session.id, "active");

          // 2️⃣ Open Jitsi in a new tab after update
          const meetingUrl = `${session.jitsiLink}?config.closePageUrl=${encodeURIComponent(`${FRONTEND_URL}/trainer/sessions`)}`;
          window.open(meetingUrl, "_blank");
        } catch (err) {
          console.error("Failed to start session:", err);
        }
      }}
      className="px-4 py-2 bg-[#3B3361] text-[#CBE56A] rounded-lg font-medium hover:bg-[#CBE56A] hover:text-[#2D274B] transition-all duration-300 shadow-md hover:shadow-xl text-sm"
    >
      Start
    </button>
  )}

  {session.status === "active" && (
    <>
      <a
        href={`${session.jitsiLink}?config.closePageUrl=${encodeURIComponent(`${FRONTEND_URL}/trainer/sessions`)}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center px-4 py-2 bg-[#3B3361] text-[#CBE56A] rounded-lg font-medium hover:bg-[#CBE56A] hover:text-[#2D274B] transition-all duration-300 shadow-md hover:shadow-xl text-sm"
      >
        <Video className="h-4 w-4 mr-2" /> Join
      </a>

      <button
        onClick={() => updateSessionStatus(session._id || session.id, "completed")}
        className="px-4 py-2 bg-[#3B3361] text-[#CBE56A] rounded-lg font-medium hover:bg-[#CBE56A] hover:text-[#2D274B] transition-all duration-300 shadow-md hover:shadow-xl text-sm"
      >
        End
      </button>
    </>
  )}
</div>

                  </div>
                </div>

                {session.description && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">{session.description}</p>
                )}

                <div className="flex items-center text-xs text-gray-500 font-medium mt-3 gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {session.duration}m</span>
                  </div>
                  {session.language && (
                    <div className="flex items-center gap-1">
                      <span className="mx-1">•</span>
                      <span>Language: {session.language}</span>
                    </div>
                  )}
                  {session.level && (
                    <div className="flex items-center gap-1">
                      <span className="mx-1">•</span>
                      <span>Level: {session.level}</span>
                    </div>
                  )}
                  {session.jitsiRoomName && (
                    <div className="flex items-center gap-1 text-[#3B3361] font-semibold">
                      <span className="mx-1">•</span>
                      <span>Room: {session.jitsiRoomName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-[#3B3361]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-7 w-7 text-[#3B3361]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No sessions yet</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create your first session with your students
            </p>
            <Link
              to="/trainer/students"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B3361] text-[#CBE56A] rounded-xl hover:bg-[#CBE56A] hover:text-[#2D274B] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View Students
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerSessions;
