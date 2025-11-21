// src/pages/Register.tsx
import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, GraduationCap, BookOpen } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import '../theme.css'

import 'react-phone-input-2/lib/style.css'
import 'flag-icons/css/flag-icons.min.css'
import PhoneInput from 'react-phone-input-2'

import TrainerForm from './auth/components/TrainerForm'
import StudentForm from './auth/components/StudentForm'

/* ---------- Types (kept local to avoid extra files) ---------- */
export interface Certificate {
  name: string
  issuer: string
  certificateLink: string
  issuedDate: string
  certificateImage?: File | string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: 'student' | 'trainer'
  education: string
  experience: string
  certificates: Certificate[]
  dob: string
  bio: string
  resume: File | string | null
  phone: string
  languages?: string
  subjects?: string
  standards?: string
  customStandardRange?: string
  nationalityCode?: string
}

/* ---------------- Register page ---------------- */
const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [searchParams] = useSearchParams()
  const defaultRole = (searchParams.get('role') || 'student') as string

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole as 'student' | 'trainer',
    education: '',
    certificates: [],
    experience: '',
    dob: '',
    bio: '',
    resume: null,
    phone: '',
    subjects: '',
    languages: '',
    standards: '',
    customStandardRange: '',
    nationalityCode: '',
  })

  const showStandards = formData.role === 'trainer' && formData.subjects?.trim() !== ''

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /* ---------- small helpers ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addCertificate = (certificate: Certificate) => {
    setFormData(prev => ({
      ...prev,
      certificates: [...(prev.certificates || []), certificate],
    }))
  }

  const removeCertificate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }))
  }

  const handleCertificateChange = (index: number, field: keyof Certificate, value: any) => {
    const newCerts = [...formData.certificates]
    newCerts[index] = { ...newCerts[index], [field]: value }
    setFormData(prev => ({ ...prev, certificates: newCerts }))
  }

  const validatePhoneNumber = (phone: string) => {
    const cleanedPhone = phone.replace(/\s|-/g, '')
    const phoneRegex = /^[0-9]{10,15}$/
    return phoneRegex.test(cleanedPhone)
  }

  const today = new Date()
  const maxDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  const maxDOBString = maxDOB.toISOString().split('T')[0]

  /* ---------- submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (formData.role === 'trainer') {
      const dob = new Date(formData.dob)
      const age = today.getFullYear() - dob.getFullYear()
      const hasBirthdayPassed =
        today.getMonth() > dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())
      const actualAge = hasBirthdayPassed ? age : age - 1
      if (actualAge < 18) {
        setError('Trainer must be at least 18 years old.')
        setLoading(false)
        return
      }
      if (!validatePhoneNumber(formData.phone)) {
        setError('Please enter a valid phone number (10–15 digits).')
        setLoading(false)
        return
      }
      const hasSubjects = formData.subjects?.trim() !== ''
      const hasLanguages = formData.languages?.trim() !== ''
      if (!hasSubjects && !hasLanguages) {
        setError('Please enter at least one of: Subjects or Languages.')
        setLoading(false)
        return
      }
      if (formData.subjects?.trim() !== '' && !formData.standards) {
        setError('Please select the standards you can teach.')
        setLoading(false)
        return
      }
      if (formData.standards === 'Others' && !formData.customStandardRange?.trim()) {
        setError('Please specify your custom standard range.')
        setLoading(false)
        return
      }
    }

    const experienceYears = parseInt(formData.experience) || 0
    const sanitizedCertificates = (formData.certificates || []).map(cert => ({
      ...cert,
      certificateImage: typeof cert.certificateImage === 'string' ? cert.certificateImage : '',
    }))

    let resumeData = ''
    if (formData.resume instanceof File) {
      resumeData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
        reader.readAsDataURL(formData.resume as Blob)
      })
    } else if (typeof formData.resume === 'string') {
      resumeData = formData.resume
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      profile: {
        phone: formData.phone,
        ...(formData.role === 'trainer' && {
          education: formData.education,
          teachingExperienceDetails: formData.experience,
          experience: experienceYears,
          certifications: sanitizedCertificates,
          dob: formData.dob,
          bio: formData.bio,
          nationalityCode: formData.nationalityCode,
          resume: resumeData,
          subjects: formData.subjects?.split(',').map(s => s.trim()).filter(Boolean),
          languages: formData.languages?.split(',').map(l => l.trim()).filter(Boolean),
          standards:
            formData.standards === 'Others'
              ? formData.customStandardRange
              : formData.standards,
        }),
      },
    })

    if (result?.success) {
      if (formData.role === 'student') {
        navigate('/student')
      } else {
        setError(
          'Your registration has been received! An admin will review and verify your details before you can log in.'
        )
        setTimeout(() => navigate('/login'), 3000)
      }
    } else {
      setError(result?.error || 'Registration failed')
    }
    setLoading(false)
  }

  /* ---------- render ---------- */
  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 transition-all duration-700 ${
        formData.role === 'trainer' ? 'bg-[#2D274B]' : 'bg-[#dc8d33]'
      }`}
    >
      {/* Decorative orbs (same as before) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full" style={{ background: '#fff7e1', opacity: 0.16, animation: 'floaty 6s ease-in-out infinite' }} />
        <div className="absolute top-44 right-20 w-24 h-24 rounded-full" style={{ background: '#fff7e1', opacity: 0.26, animation: 'floaty 6s ease-in-out infinite', animationDelay: '1.8s' }} />
        <div className="absolute bottom-24 left-1/4 w-40 h-40 rounded-full" style={{ background: '#fff7e1', opacity: 0.14, animation: 'floaty 6s ease-in-out infinite', animationDelay: '3.2s' }} />
        <div className="absolute bottom-44 right-44 w-40 h-40 rounded-full" style={{ background: '#fff7e1', opacity: 0.14, animation: 'floaty 6s ease-in-out infinite', animationDelay: '1.8s' }} />
      </div>

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto relative z-10 p-4 sm:p-8">
        <div className="text-center mb-8">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 text-center ${formData.role === 'trainer' ? 'text-[#dc8d33]' : 'text-[#2D274B]'}`}>
            Join LearniLM 🌎 World
          </h1>
          <p className={`text-xl font-bold sm:text-base md:text-xl ${formData.role === 'trainer' ? 'text-[#dc8d33]' : 'text-[#2D274B]'}`}>
            Start your Learning Journey today
          </p>
        </div>

        <div className="glass-effect rounded-2xl p-8 shadow-2xl bg-white/80 backdrop-blur">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              <div className="flex items-center gap-2">⚠️ <span>{error}</span></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* role toggle */}
            <div>
              <label className="block text-base font-bold text-[#2D274B] mb-3">I want to join as :</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition bg-gray-100 ${formData.role === 'student' ? 'border-[#9787F3] bg-[rgba(151,135,243,0.06)]' : 'border-gray-200 hover:border-[#9787F3]'}`}>
                  <input type="radio" name="role" value="student" checked={formData.role === 'student'} onChange={handleChange} className="sr-only" />
                  <BookOpen className="h-6 w-6 text-[#9787F3] mr-3" />
                  <div><div className="font-semibold text-[#2D274B]">Student</div><div className="text-sm font-bold text-[#4B437C]">Start your learning journey</div></div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition bg-gray-100 ${formData.role === 'trainer' ? 'border-[#9787F3] bg-[rgba(151,135,243,0.06)]' : 'border-gray-200 hover:border-[#9787F3]'}`}>
                  <input type="radio" name="role" value="trainer" checked={formData.role === 'trainer'} onChange={handleChange} className="sr-only" />
                  <GraduationCap className="h-6 w-6 text-[#9787F3] mr-3" />
                  <div><div className="font-semibold text-[#2D274B]">Trainer</div><div className="text-sm font-bold text-[#4B437C]">Be a Teacher</div></div>
                </label>
              </div>
            </div>

            {/* Common fields: name, email, password, phone input */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#2D274B] mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8C83C9] h-5 w-5" />
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300" placeholder="Enter your full name" />
              </div>
            </div>
            {/* email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#2D274B] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8C83C9] h-5 w-5" />
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300" placeholder="Enter your email" />
              </div>
            </div>
            {/* pass */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#2D274B] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8C83C9] h-5 w-5" />
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300" placeholder="Create a password" />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8C83C9] hover:text-[#4B437C]">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
              </div>
            </div>
            {/* confirm pass */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#2D274B] mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8C83C9] h-5 w-5" />
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} required className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300" placeholder="Confirm your password" />
                <button type="button" onClick={() => setShowConfirmPassword(s => !s)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8C83C9] hover:text-[#4B437C]">{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
              </div>
            </div>
            {/* phone */}
            <div>
              <label className="block text-sm font-semibold text-[#2D274B] mb-2">Phone Number</label>
              <div className="w-full">
                <PhoneInput
                  country={'in'}
                  value={formData.phone}
                  onChange={(phone, countryData) => setFormData(prev => ({ ...prev, phone, nationalityCode: (countryData as any)?.iso2?.toUpperCase() || '' }))}
                  inputStyle={{ width: '100%', borderRadius: '0.75rem', border: '2px solid #e5e7eb', padding: '12px 14px 12px 52px', fontSize: '16px' }}
                  buttonStyle={{ border: 'none', backgroundColor: 'transparent' }}
                  dropdownStyle={{ maxHeight: '200px' }}
                  enableSearch={true}
                />
              </div>
            </div>

            {/* role-specific chunk (component) */}
            {formData.role === 'trainer' ? (
              <TrainerForm
                formData={formData}
                setFormData={setFormData}
                addCertificate={addCertificate}
                removeCertificate={removeCertificate}
                handleCertificateChange={handleCertificateChange}
                maxDOBString={maxDOBString}
                showStandards={showStandards}
              />
            ) : (
              <StudentForm formData={formData} setFormData={setFormData} maxDOBString={maxDOBString} />
            )

            /* submit button (shared) */}
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className={`w-full flex items-center justify-center text-base sm:text-lg py-3 rounded-xl font-semibold text-[#2D274B] hover:opacity-90 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} style={{ backgroundColor: '#CBE56A', color: '#2D274B' }}>
                {loading ? <div className="loading-dots"><div></div><div></div><div></div><div></div></div> : <>Create Account <ArrowRight className="ml-2 h-5 w-5" /></>}
              </button>
            </div>
          </form>
          {/* sign in */}
          <div className="mt-8 text-center">
            <p className="text-[#4B437C] font-bold">
              Already have an account? <Link to="/login" className="font-bold hover:underline" style={{ color: '#9787F3' }}>Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
