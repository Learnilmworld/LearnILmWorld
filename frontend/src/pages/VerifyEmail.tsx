import React, { useState, useEffect } from "react";
import { Mail, KeyRound, ArrowRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VerifyEmail: React.FC = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(0);

    // countdown timer
    useEffect(() => {
        if (timer <= 0) return;
        const t = setTimeout(() => setTimer(timer - 1), 1000);
        return () => clearTimeout(t);
    }, [timer]);

    const sendOtp = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            await axios.post(`${API_BASE_URL}/api/auth/send-email-otp`, { email });

            setMessage("OTP sent to your email");
            setTimer(60);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            await axios.post(`${API_BASE_URL}/api/auth/verify-email-otp`, { email, otp });

            setMessage("Email verified successfully. You can now login.");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 bg-[#5186cd]">
            {/* Home Button */}
            <Link
                to="/"
                className="absolute top-6 right-6 p-2 rounded-lg bg-[#fef5e4] text-[#5186cd]"
            >
                <Home className="h-6 w-6" />
            </Link>

            <div className="max-w-md w-full mx-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-white mb-2">
                        Verify Email
                    </h1>
                    <p className="text-white font-bold">
                        Enter your email and OTP to verify
                    </p>
                </div>

                <div className="glass-effect rounded-2xl p-8 shadow-2xl bg-white/80 backdrop-blur">

                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                            ⚠️ {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4">
                            ✅ {message}
                        </div>
                    )}

                    <div className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="font-semibold mb-2 block text-[#2D274B]">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-[#9787F3]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-10 py-3 border-2 rounded-xl"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Send OTP */}
                        <button
                            onClick={sendOtp}
                            disabled={loading || timer > 0}
                            className="w-full py-3 rounded-xl font-semibold bg-[#5186cd] text-white hover:bg-[#095ac4]"
                        >
                            {timer > 0 ? `Resend in ${timer}s` : "Send OTP"}
                        </button>

                        {/* OTP */}
                        <div>
                            <label className="font-semibold mb-2 block text-[#2D274B]">
                                OTP
                            </label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-3 text-[#9787F3]" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    className="w-full pl-10 py-3 border-2 rounded-xl tracking-widest text-lg"
                                    placeholder="Enter OTP"
                                />
                            </div>
                        </div>

                        {/* Verify */}
                        <button
                            onClick={verifyOtp}
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                            Verify Email <ArrowRight size={18} />
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
