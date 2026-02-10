import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { TrendingUp, Users, UserPlus, Calendar, FilePlus, User, BookOpen } from "lucide-react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface Session {
    _id: string
    title: string
    trainer?: { name: string; email: string }
    status?: string
    createdAt?: string
}

const AdminHome: React.FC = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTrainers: 0,
        totalSessions: 0,
        totalReviews: 0
    })
    const [recentSessions, setRecentSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${API_BASE_URL}/api/admin/dashboard-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            const data = res.data
            setStats({
                totalUsers: data.totalUsers || 0,
                totalTrainers: data.totalTrainers || 0,
                totalSessions: data.totalSessions || 0,
                totalReviews: data.totalReviews || 0
            })
            setRecentSessions(data.recentSessions || [])
        } catch (error) {
            console.error('Failed to fetch admin dashboard stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="loading-dots">
                    <div></div><div></div><div></div><div></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto w-full">
            {/* Welcome Section */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#0ea5a3] rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">Welcome, Admin!</h2>
                </div>
                <p className="text-gray-600 font-medium text-sm sm:text-base">Monitor users, trainers, sessions, and reviews</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/admin/users" className="glass-effect rounded-xl p-4 shadow-xl text-center hover:shadow-lg transition">
                    <div className="w-10 h-10 bg-[#0ea5a3] rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalUsers}</div>
                    <div className="text-gray-600 text-sm font-medium">Users</div>
                </Link>

                <Link to="/admin/trainers" className="glass-effect rounded-xl p-4 shadow-xl text-center hover:shadow-lg transition">
                    <div className="w-10 h-10 bg-[#6ee7b7] rounded-xl flex items-center justify-center mx-auto mb-3">
                        <UserPlus className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalTrainers}</div>
                    <div className="text-gray-600 text-sm font-medium">Trainers</div>
                </Link>

                <Link to="/admin/sessions" className="glass-effect rounded-xl p-4 shadow-xl text-center hover:shadow-lg transition">
                    <div className="w-10 h-10 bg-[#f97316] rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalSessions}</div>
                    <div className="text-gray-600 text-sm font-medium">Sessions</div>
                </Link>

                <Link to="/admin/reviews" className="glass-effect rounded-xl p-4 shadow-xl text-center hover:shadow-lg transition">
                    <div className="w-10 h-10 bg-[#0ea5a3] rounded-xl flex items-center justify-center mx-auto mb-3">
                        <FilePlus className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalReviews}</div>
                    <div className="text-gray-600 text-sm font-medium">Reviews</div>
                </Link>
            </div>

            {/* Recent Sessions */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Sessions</h3>
                    <Link to="/admin/sessions" className="text-accent hover:text-accent-dark font-medium text-sm">View All</Link>
                </div>

                {recentSessions.length > 0 ? (
                    <div className="space-y-3">
                        {recentSessions.map((session) => (
                            <div key={session._id} className="p-4 bg-white bg-opacity-50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center w-full sm:w-auto">
                                    <div className="w-10 h-10 bg-[#0ea5a3] rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-gray-900 truncate">{session.title}</div>
                                        <div className="text-gray-600 text-sm font-medium truncate">Trainer: {session.trainer?.name || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right w-full sm:w-auto pl-[52px] sm:pl-0">
                                    <div className="text-xs text-gray-500">{new Date(session.createdAt || '').toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-[#0ea5a3]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="h-8 w-8 text-[#0ea5a3]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No sessions yet</h3>
                        <p className="text-gray-600 mb-4 font-medium">New sessions will appear here</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminHome