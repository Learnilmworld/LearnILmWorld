// File: src/pages/register/Steps/StepBasicInfo.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactFlagsSelect from "react-flags-select";
import type { RegisterFormData } from "../types";
import FormLabel from "../../../components/FormLabel";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Props = {
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  onNext: () => void;
  onBack: () => void;
};

const StepBasicInfo: React.FC<Props> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<{ email?: string; country?: string }>(
    {},
  );

  const [emailStatus, setEmailStatus] = useState<{
    message?: string;
    blocked?: boolean;
  }>({});

  const city = formData.location || "";

  const checkEmail = async (email: string) => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: formData.role }),
      });

      const data = await res.json();
      setEmailStatus(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Validations
  const validate = () => {
    let temp: any = {};

    if (!formData.email.trim()) temp.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      temp.email = "Invalid email format";

    if (!formData.nationalityCode) temp.country = "Please select your country";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    if (emailStatus.blocked) return;

    onNext();
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        {/* Heading */}
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Tell us about yourself
        </motion.h3>

        <p className="text-sm text-gray-500 mb-3">
          This helps us personalize your experience.
        </p>
        <div className="mb-2 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-2 shadow-sm ring-1 ring-blue-200 animate-pulse-subtle">
          {/* Google Icon */}
          <div className="flex-shrink-0">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-blue-800">
            <span className="font-bold">Pro Tip:</span> Login with Google only
            works if you register with your Google account.
          </p>
        </div>
        {/* Inputs */}
        <div className="space-y-5">
          {/* Email */}
          <div>
            <FormLabel required>Email address</FormLabel>

            {/* <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label> */}
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              onBlur={() => checkEmail(formData.email)}
              className={`w-full p-3 border rounded-xl outline-none transition ${
                errors.email
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-indigo-300"
              }`}
              placeholder="you@example.com"
            />
            {/* existing email error */}
            {emailStatus.message && !errors.email && (
              <p className="text-xs text-red-500 mt-1">{emailStatus.message}</p>
            )}

            {/* email validation error */}
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Country Select with Flags */}
          <div>
            <FormLabel required>Country</FormLabel>
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label> */}

            <ReactFlagsSelect
              selected={formData.nationalityCode || ""}
              searchable={true}
              searchPlaceholder="Search country..."
              onSelect={(code) => {
                const upper = code.toUpperCase();

                setFormData((prev) => ({
                  ...prev,
                  nationalityCode: upper,
                }));
              }}
              placeholder="Select country"
              className={`w-full ${errors.country ? "border-red-500" : ""}`}
            />

            {errors.country && (
              <p className="text-xs text-red-500 mt-1">{errors.country}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City / Area (optional)
            </label>

            <input
              type="text"
              value={city}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              placeholder="City, area or pin code"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-300 outline-none transition"
            />

            <p className="text-xs text-gray-400 mt-1">
              Tailor your experience! Knowing your city helps us filter for
              local accents and regional nuances.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepBasicInfo;
