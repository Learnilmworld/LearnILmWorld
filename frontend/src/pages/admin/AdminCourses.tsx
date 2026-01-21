import React, { useEffect, useState } from "react"
import axios from "axios"
import { Trash2, Plus, Edit } from "lucide-react"


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface Course {
    _id: string
    title: string
    description?: string
    thumbnail: string
    videoUrl?: string
    pdfUrl?: string
    createdAt: string
}

const AdminCourses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)

    const [editingId, setEditingId] = useState<string | null>(null)


    // form state
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [thumbnail, setThumbnail] = useState("")
    const [videoUrl, setVideoUrl] = useState("")
    const [pdfUrl, setPdfUrl] = useState("")
    const [submitting, setSubmitting] = useState(false)

    // fetch courses
    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get(`${API_BASE_URL}/api/courses`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setCourses(res.data)
        } catch (err) {
            console.error("Error fetching courses:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    // handle base64 image
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setThumbnail(reader.result as string)
        }
        reader.readAsDataURL(file)
    }
    //handle edit
    const handleEdit = (course: Course) => {
        setEditingId(course._id)
        setTitle(course.title)
        setDescription(course.description || "")
        setThumbnail(course.thumbnail)
        setVideoUrl(course.videoUrl || "")
        setPdfUrl(course.pdfUrl || "")
    }

    // create course
    const handleCreateCourse = async () => {
        if (!title || !thumbnail) {
            alert("Title and thumbnail are required")
            return
        }

        try {
            setSubmitting(true)
            const token = localStorage.getItem("token")

            const res = await axios.post(
                `${API_BASE_URL}/api/admin/courses`,
                {
                    title,
                    description,
                    thumbnail,
                    videoUrl,
                    pdfUrl,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            setCourses([res.data, ...courses])

            // reset form
            setTitle("")
            setDescription("")
            setThumbnail("")
            setVideoUrl("")
            setPdfUrl("")
        } catch (err) {
            console.error("Create course error:", err)
            alert("Failed to create course")
        } finally {
            setSubmitting(false)
        }
    }

    // update courses
    const handleUpdateCourse = async () => {
        if (!editingId) return

        try {
            setSubmitting(true)
            const token = localStorage.getItem("token")

            const res = await axios.put(
                `${API_BASE_URL}/api/admin/courses/${editingId}`,
                {
                    title,
                    description,
                    thumbnail,
                    videoUrl,
                    pdfUrl,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            setCourses(
                courses.map(c => (c._id === editingId ? res.data : c))
            )

            // reset form
            setEditingId(null)
            setTitle("")
            setDescription("")
            setThumbnail("")
            setVideoUrl("")
            setPdfUrl("")
        } catch (err) {
            console.error("Update course error:", err)
            alert("Failed to update course")
        } finally {
            setSubmitting(false)
        }
    }


    // delete course
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this course?")) return
        try {
            const token = localStorage.getItem("token")
            await axios.delete(`${API_BASE_URL}/api/admin/courses/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setCourses(courses.filter(c => c._id !== id))
        } catch (err) {
            console.error("Delete course error:", err)
            alert("Failed to delete course")
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-6">
            <div className="glass-effect rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Courses</h2>
                <p className="text-gray-600 mb-6">Create and manage courses.</p>

                {/* CREATE COURSE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Course title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="input"
                    />

                    <input
                        type="text"
                        placeholder="Video URL (optional)"
                        value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}
                        className="input"
                    />

                    <input
                        type="text"
                        placeholder="PDF URL (optional)"
                        value={pdfUrl}
                        onChange={e => setPdfUrl(e.target.value)}
                        className="input"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="input"
                    />

                    <textarea
                        placeholder="Description (optional)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="input md:col-span-2"
                    />
                </div>

                <button
                    onClick={editingId ? handleUpdateCourse : handleCreateCourse}
                    disabled={submitting}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${editingId
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-[#0ea5a3] hover:bg-[#0c8f8d] text-white"
                        }`}
                >
                    <Plus size={18} />
                    {submitting
                        ? "Saving..."
                        : editingId
                            ? "Update Course"
                            : "Create Course"}
                </button>

            </div>

            {/* COURSES TABLE */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl">
                {courses.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">No courses created.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-xl overflow-hidden">
                            <thead className="bg-[#0ea5a3] text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left">Thumbnail</th>
                                    <th className="px-4 py-3 text-left">Title</th>
                                    <th className="px-4 py-3 text-left">Created</th>
                                    <th className="px-4 py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course._id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-16 h-10 object-cover rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-3 font-medium">{course.title}</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {new Date(course.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-center flex justify-center gap-3">
                                            <button
                                                onClick={() => handleEdit(course)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit course"
                                            >
                                                <Edit size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(course._id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Delete course"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminCourses
