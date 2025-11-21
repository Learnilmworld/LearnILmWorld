// src/components/StudentForm.tsx
import React from 'react'
import type { RegisterFormData } from '../../Register'

type Props = {
  formData: RegisterFormData
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>
  maxDOBString: string
}

const StudentForm: React.FC<Props> = ({ formData, setFormData, maxDOBString }) => {
  return (
    <div>
      {/* Students usually only need minimal additional fields.
          If you want to keep exact same common fields here, add them. */}
      {/* <div>
        <label className="block text-sm font-semibold text-[#2D274B] mb-2">Why are you joining?</label>
        <input type="text" name="bio" value={formData.bio} onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))} placeholder="E.g., Learn English for work" className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl" />
      </div> */}

      <div className="mt-4">
        <label className="block text-sm font-semibold text-[#2D274B] mb-2">Date of Birth (optional)</label>
        <input type="date" name="dob" value={formData.dob} onChange={e => setFormData(prev => ({ ...prev, dob: e.target.value }))} max={maxDOBString} className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl" />
      </div>
    </div>
  )
}

export default StudentForm
