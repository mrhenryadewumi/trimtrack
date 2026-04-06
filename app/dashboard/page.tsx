'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { courses } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BookOpen, Clock, ChevronRight, Sparkles } from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    )
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || ''

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={20} className="text-yellow-500" />
              <span className="text-sm font-medium text-gray-500">Your Learning Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Welcome back{firstName ? `, ${firstName}` : ''}!
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Pick up where you left off or start a new course.</p>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="font-bold text-lg text-gray-900 mb-5">Your Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <span className="text-4xl block mb-3">{course.icon}</span>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><BookOpen size={12} /> {course.lessons} lessons</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Continue Learning <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
