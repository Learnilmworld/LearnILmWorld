// src/pages/trainer/TrainerReviews.tsx
import { useState, useEffect } from 'react'
import {
    User, Star, MessageSquare
} from 'lucide-react'
import axios from 'axios'

interface Review {
  _id?: string;
  id?: string;
  studentName?: string;
  student?: { name?: string };
  rating?: number;
  comment?: string;
  createdAt?: string | undefined;
}

interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

/* ---------- Types ---------- */
// type AnyObj = Record<string, any>

// const FRONTEND_URL= import.meta.env.VITE_FRONTEND_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 


/* ---------- TrainerReviews ---------- */
const TrainerReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<{ 
    averageRating: number; totalReviews: number; ratingDistribution: RatingDistribution;
    }>
    ({ averageRating: 0, totalReviews: 0, ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } 
    })

  useEffect(() => { fetchReviews() }, [])

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/reviews/trainer-reviews`)
      const reviewsData = Array.isArray(res.data) ? res.data : []
      setReviews(reviewsData)

      const totalReviews = reviewsData.length
      const averageRating = totalReviews > 0 ? reviewsData.reduce((s, r) => s + (r.rating || 0), 0) / totalReviews : 0
      const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

      reviewsData.forEach(r => { 
        const rInt = Math.round(r.rating || 0); 
        if (rInt >= 1 && rInt <= 5) {
            ratingDistribution[rInt as 1 | 2 | 3 | 4 | 5]++
            }
        })

      setStats({ averageRating: Math.round(averageRating * 10) / 10, totalReviews, ratingDistribution })
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-dots"><div></div><div></div><div></div><div></div></div>
      </div>
    )
  }

  return (
  <div className="space-y-10 max-w-6xl mx-auto px-6 py-10">
    {/* Top Summary Section */}
    <div className="grid md:grid-cols-2 gap-8">
      {/* Average Rating Card */}
      <div className="rounded-2xl p-8 bg-white shadow-lg border border-gray-100 text-center">
        <div className="text-6xl font-extrabold text-[#3B3361] mb-3">
          {stats.averageRating.toFixed(1)}
        </div>
        <div className="flex justify-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-6 w-6 ${
                i < Math.floor(stats.averageRating)
                  ? "text-[#CBE56A] fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-gray-700 font-medium">Average Rating</p>
        <p className="text-sm text-gray-500 mt-2">
          {stats.totalReviews} total reviews
        </p>
      </div>

      {/* Rating Distribution Card */}
      <div className="rounded-2xl p-8 bg-white shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-[#3B3361] mb-6">
          Rating Distribution
        </h3>
        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <span className="w-8 text-sm font-semibold text-[#3B3361]">
                {rating}
              </span>
              <Star className="h-4 w-4 text-[#CBE56A] fill-current mx-2" />
              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                <div
                  className="bg-[#3B3361] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      stats.totalReviews > 0
                        ? (stats.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5] / stats.totalReviews) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">
                {stats.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Reviews List */}
    <div className="rounded-2xl p-8 bg-white shadow-lg border border-gray-100">
      <h3 className="text-3xl font-bold text-[#3B3361] mb-8">All Reviews</h3>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id || review.id}
              className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#9787F3] rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#2D274B]">
                      {review.studentName || review.student?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt ?? "").toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (review.rating || 0)
                          ? "text-[#CBE56A] fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#9787F3]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-[#9787F3]" />
          </div>
          <h3 className="text-xl font-bold text-[#2D274B] mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-600">
            Reviews from students will appear here after completed sessions.
          </p>
        </div>
      )}
    </div>
  </div>
)};

export default TrainerReviews