import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Users, User, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ---------- TrainerStudents ---------- */
const TrainerStudents = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [sessionData, setSessionData] = useState({
    title: "",
    description: "",
    duration: 60,
    language: "",
    level: "beginner",
    scheduledDate: "",
    scheduledTime: "",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/bookings/trainer-bookings`);
      setBookings(
        Array.isArray(res.data)
          ? res.data.filter((b) => b.paymentStatus === "completed")
          : []
      );
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBookings.length === 0) {
      alert("Please select at least one student");
      return;
    }
    try {
      const scheduledDateTime = new Date(
        `${sessionData.scheduledDate}T${sessionData.scheduledTime}`
      );
      await axios.post(`${API_BASE_URL}/api/sessions`, {
        ...sessionData,
        bookingIds: selectedBookings,
        scheduledDate: scheduledDateTime.toISOString(),
      });
      setShowCreateModal(false);
      setSelectedBookings([]);
      setSessionData({
        title: "",
        description: "",
        duration: 60,
        language: "",
        level: "beginner",
        scheduledDate: "",
        scheduledTime: "",
      });
      fetchBookings();
    } catch (err) {
      console.error("Failed to create session:", err);
      alert("Failed to create session");
    }
  };

  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
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
  <div className="space-y-8 max-w-[1200px] mx-auto p-6">
    <div className="rounded-2xl p-8 bg-white shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#2D274B]">My Students</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-5 py-2 rounded-xl bg-[#3B3361] text-[#CBE56A] font-medium hover:bg-[#CBE56A] hover:text-[#2D274B] shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus className="h-5 w-5 mr-2" /> Create Session
        </button>
      </div>

      {/* Student List */}
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <div
              key={booking._id || booking.id}
              className="p-6 bg-white rounded-xl flex items-center justify-between hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center">
                {/* Icon Box - matches home section style */}
                <div className="w-10 h-10 bg-[#9787F3] rounded-lg flex items-center justify-center mr-4">
                  <User className="h-5 w-5 text-white" />
                </div>

                {/* Student Info */}
                <div>
                  <div className="font-bold text-[#2D274B]">
                    {booking.studentName || booking.student?.name}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">
                    {booking.student?.email}
                  </div>
                  <div className="text-gray-500 text-sm font-medium">
                    Booked on{" "}
                    {new Date(booking.createdAt).toLocaleDateString()} • $
                    {booking.amount}
                  </div>
                </div>
              </div>

              {/* Status + Selection */}
              <div className="text-right">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                    booking.sessionId
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.sessionId ? "Session Created" : "Awaiting Session"}
                </div>

                {!booking.sessionId && (
                  <label className="flex items-center cursor-pointer justify-end">
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking._id || booking.id)}
                      onChange={() => toggleBookingSelection(booking._id || booking.id)}
                      className="mr-2 accent-[#3B3361]"
                    />
                    <span className="text-sm text-gray-600">
                      Select for session
                    </span>
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#9787F3]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-[#9787F3]" />
          </div>
          <h3 className="text-xl font-bold text-[#2D274B] mb-2">
            No students yet
          </h3>
          <p className="text-gray-600 font-medium">
            Students will appear here after they book sessions with you
          </p>
        </div>
      )}
    </div>

    {/* Create Session Modal (unchanged) */}
    {showCreateModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-[#2D274B]">
              Create New Session
            </h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleCreateSession} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Selected Students ({selectedBookings.length})
              </label>
              <div className="text-sm text-gray-600">
                {selectedBookings.length === 0
                  ? "Please select students from the list above"
                  : `${selectedBookings.length} student(s) selected`}
              </div>
            </div>

            {/* Rest of modal form remains unchanged */}
            {/* ... */}
          </form>
        </div>
      </div>
    )}
  </div>
)};

export default TrainerStudents;
