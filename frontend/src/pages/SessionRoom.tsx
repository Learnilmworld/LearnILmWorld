import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Video, VideoOff, Mic, MicOff, Phone, Users, Clock, Globe, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

interface Session {
  _id: string
  title: string
  description: string
  trainer: {
    _id: string
    name: string
    email: string
  }
  students: Array<{
    _id: string
    name: string
    email: string
  }>
  jitsiLink: string
  jitsiRoomName: string
  status: string
  duration: number
  scheduledDate: string
  language: string
  level: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const SessionRoom = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sessionStarted, setSessionStarted] = useState(false)

  useEffect(() => {
    if (sessionId) {
      fetchSession()
    }
  }, [sessionId])

  const fetchSession = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sessions/${sessionId}`)
      setSession(response.data)
      
      // Check if session is active
      if (response.data.status === 'active') {
        setSessionStarted(true)
      }
    } catch (error) {
      console.error('Failed to fetch session:', error)
      setError('Failed to load session details')
    } finally {
      setLoading(false)
    }
  }

  const startSession = async () => {
    if (!session || user?.role !== 'trainer') return
    
    try {
      await axios.put(`${API_BASE_URL}/api/sessions/${session._id}/status`, { status: 'active' })
      setSessionStarted(true)
      setSession({ ...session, status: 'active' })
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  const endSession = async () => {
    if (!session || user?.role !== 'trainer') return
    
    try {
      await axios.put(`${API_BASE_URL}/api/sessions/${session._id}/status`, { status: 'completed' })
      navigate(user.role === 'trainer' ? '/trainer/sessions' : '/student/sessions')
    } catch (error) {
      console.error('Failed to end session:', error)
    }
  }

  const joinJitsiMeeting = () => {
    if (session?.jitsiLink) {
      window.open(session.jitsiLink, '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-green via-cream to-soft-coral flex items-center justify-center">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-green via-cream to-soft-coral flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Session not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-green via-cream to-soft-coral">
      {/* Header */}
      <header className="bg-white bg-opacity-90 backdrop-blur-lg border-b border-white border-opacity-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div>
                <div className="text-lg font-semibold">LEARN🌎SPHERE</div>
                <div className="text-xs text-slate-500 -mt-1">Live lessons · Micro-courses</div>
              </div>
            </div>
            
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-accent transition-colors duration-300 font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Session Info */}
        <div className="glass-effect rounded-2xl p-8 shadow-xl mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{session.title}</h1>
              <p className="text-gray-600">with {session.trainer.name}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              session.status === 'completed' ? 'bg-green-100 text-green-800' :
              session.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
              session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {session.status}
            </div>
          </div>

          {session.description && (
            <p className="text-gray-600 mb-6">{session.description}</p>
          )}

          {/* Session Details */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-accent mr-3" />
              <div>
                <div className="font-semibold text-gray-900">Duration</div>
                <div className="text-gray-600">{session.duration} minutes</div>
              </div>
            </div>

            <div className="flex items-center">
              <Users className="h-5 w-5 text-accent mr-3" />
              <div>
                <div className="font-semibold text-gray-900">Participants</div>
                <div className="text-gray-600">{session.students.length + 1} people</div>
              </div>
            </div>

            {session.language && (
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-accent mr-3" />
                <div>
                  <div className="font-semibold text-gray-900">Language</div>
                  <div className="text-gray-600">{session.language}</div>
                </div>
              </div>
            )}

            {session.level && (
              <div className="flex items-center">
                <div className="w-5 h-5 bg-accent rounded-full mr-3 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Level</div>
                  <div className="text-gray-600 capitalize">{session.level}</div>
                </div>
              </div>
            )}
          </div>

          {/* Participants */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Participants</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Trainer */}
              <div className="flex items-center p-4 bg-white bg-opacity-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-soft-coral rounded-full flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{session.trainer.name}</div>
                  <div className="text-sm text-gray-600">Trainer</div>
                </div>
              </div>

              {/* Students */}
              {session.students.map((student) => (
                <div key={student._id} className="flex items-center p-4 bg-white bg-opacity-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-soft-green to-cream rounded-full flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-600">Student</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Controls */}
          <div className="text-center">
            {session.status === 'scheduled' && user?.role === 'trainer' && (
              <button
                onClick={startSession}
                className="btn-primary mr-4"
              >
                Start Session
              </button>
            )}

            {(session.status === 'active' || sessionStarted) && (
              <div className="space-y-4">
                <button
                  onClick={joinJitsiMeeting}
                  className="btn-primary text-lg px-8 py-4 flex items-center mx-auto"
                >
                  <Video className="h-6 w-6 mr-3" />
                  Join Video Call
                </button>
                
                <div className="text-sm text-gray-600">
                  Room: {session.jitsiRoomName}
                </div>

                {user?.role === 'trainer' && (
                  <button
                    onClick={endSession}
                    className="btn-secondary ml-4"
                  >
                    End Session
                  </button>
                )}
              </div>
            )}

            {session.status === 'completed' && (
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 mb-4">
                  Session Completed
                </div>
                <p className="text-gray-600 mb-6">
                  Thank you for participating in this session!
                </p>
                {user?.role === 'student' && (
                  <button
                    onClick={() => navigate('/student/sessions')}
                    className="btn-primary"
                  >
                    Leave a Review
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Session Info Card */}
        <div className="glass-effect rounded-2xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Session Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Scheduled Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(session.scheduledDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Scheduled Time:</span>
              <span className="font-medium text-gray-900">
                {new Date(session.scheduledDate).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Session ID:</span>
              <span className="font-mono text-gray-900">{session._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Meeting Room:</span>
              <span className="font-mono text-gray-900">{session.jitsiRoomName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionRoom