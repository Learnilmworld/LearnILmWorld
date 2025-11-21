// src/components/TrainerForm.tsx
import React from 'react'
import { Plus } from 'lucide-react'
// , Calendar
import type { RegisterFormData, Certificate } from '../../Register'

type Props = {
  formData: RegisterFormData
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>
  addCertificate: (c: Certificate) => void
  removeCertificate: (index: number) => void
  handleCertificateChange: (index: number, field: keyof Certificate, value: any) => void
  maxDOBString: string
  showStandards: boolean
}

const TrainerForm: React.FC<Props> = ({ formData, setFormData, addCertificate, removeCertificate, handleCertificateChange, maxDOBString, showStandards }) => {
  return (
    <div>
      <div>
        <label className="block text-sm font-semibold text-[#2D274B] mb-2">Education</label>
        <input type="text" name="education" value={formData.education} onChange={e => setFormData(prev => ({ ...prev, education: e.target.value }))} className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl" placeholder="Enter your education" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#2D274B] mt-4 mb-2">Teaching Experience</label>
        <input type="text" name="experience" value={formData.experience} onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))} className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl" placeholder="E.g., 5 years teaching English" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#2D274B] mt-4 mb-2">Subjects You Can Teach</label>
        <input type="text" name="subjects" value={formData.subjects} onChange={e => setFormData(prev => ({ ...prev, subjects: e.target.value }))} placeholder="e.g., Math, Science, English" className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl" />
        <p className="text-xs text-gray-500 mt-1">You may leave this empty if you select languages below.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#2D274B] mt-4 mb-2">Languages You Can Teach In</label>
        <input type="text" name="languages" value={formData.languages} onChange={e => setFormData(prev => ({ ...prev, languages: e.target.value }))} placeholder="e.g., English, Hindi, Urdu" className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl" />
        <p className="text-xs text-gray-500 mt-1">You must fill at least one of: Subjects or Languages.</p>
      </div>

      {showStandards && (
        <div className="mt-4">
          <label className="block text-sm font-semibold text-[#2D274B] mb-2">Standards You Can Teach <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-4">
            {['5-8', '5-10', '5-12', 'Others'].map(option => (
              <label key={option} className="flex items-center gap-2 text-[#2D274B] font-medium">
                <input type="radio" name="standards" value={option} checked={formData.standards === option} onChange={e => setFormData(prev => ({ ...prev, standards: e.target.value }))} />
                {option}
              </label>
            ))}
          </div>

          {formData.standards === 'Others' && (
            <input type="text" name="customStandardRange" value={formData.customStandardRange} onChange={e => setFormData(prev => ({ ...prev, customStandardRange: e.target.value }))} placeholder="Specify range (e.g., 3-9)" className="mt-3 w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl" />
          )}
        </div>
      )}

      <div className="mt-4">
        <label className="block text-sm font-semibold text-[#2D274B] mb-2">Date of Birth</label>
        <input type="date" name="dob" value={formData.dob} onChange={e => setFormData(prev => ({ ...prev, dob: e.target.value }))} max={maxDOBString} className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl" />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold text-[#2D274B] mb-2">Short Bio / Pitch</label>
        <textarea name="bio" value={formData.bio} onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))} rows={3} className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl" placeholder="Describe your teaching style..." />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold text-[#2D274B] mb-2">Resume (PDF or link)</label>
        <input type="file" accept=".pdf" onChange={e => { const file = e.target.files?.[0]; if (file) setFormData(prev => ({ ...prev, resume: file })) }} className="w-full pl-4 pr-4 py-2 border-2 border-gray-500 rounded-xl" />
        <p className="text-sm text-[#6B64A1] mt-1">Or paste a link instead:</p>
        <input type="text" placeholder="https://example.com/myresume.pdf" onChange={e => setFormData(prev => ({ ...prev, resume: e.target.value }))} className="w-full pl-4 pr-4 py-2 border-2 border-gray-200 rounded-xl mt-2" />
      </div>

      {/* Certificates */}
      <div className="space-y-3 mt-6">
        <label className="block text-sm font-semibold text-[#2D274B] mb-2">Certificates</label>
        {(formData.certificates || []).map((cert, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-xl mb-4">
            <input type="text" placeholder="Certificate Name" value={cert.name} onChange={e => handleCertificateChange(index, 'name', e.target.value)} className="pl-2 py-2 border rounded-xl" />
            <input type="file" accept="image/*" onChange={e => {
              const file = e.target.files?.[0]; if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => handleCertificateChange(index, 'certificateImage', reader.result as string);
              reader.readAsDataURL(file);
            }} className="pl-2 py-2 border rounded-xl" />
            <input type="text" placeholder="Issued By (Issuer Name)" value={cert.issuer} onChange={e => handleCertificateChange(index, 'issuer', e.target.value)} className="pl-2 py-2 border rounded-xl" />
            <input type="text" placeholder="Certificate Link" value={cert.certificateLink} onChange={e => handleCertificateChange(index, 'certificateLink', e.target.value)} className="pl-2 py-2 border rounded-xl" />
            <input type="date" value={cert.issuedDate} onChange={e => handleCertificateChange(index, 'issuedDate', e.target.value)} className="pl-2 py-2 border rounded-xl" />
            <button type="button" onClick={() => removeCertificate(index)} className="mt-2 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200" style={{ backgroundColor: 'rgba(255, 0, 0, 0.08)', color: '#E74C3C' }}>Remove</button>
          </div>
        ))}

        <button type="button" onClick={() => addCertificate({ name: '', issuer: '', certificateLink: '', issuedDate: '', certificateImage: '' })} className="font-semibold mt-2 text-[#9787F3] flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Certificate
        </button>
      </div>
    </div>
  )
}

export default TrainerForm
