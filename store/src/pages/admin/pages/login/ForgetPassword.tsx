import React from "react";
import { Button, Input } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function ForgetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                {/* Branding */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
                    <p className="text-gray-600 text-sm">
                        Enter your email address to reset your password.
                    </p>
                </div>

                {/* Forget Password Form */}
                <form>
                    <div className="mb-4">
                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M2.94 6.94a1.5 1.5 0 012.12 0L10 11.88l4.94-4.94a1.5 1.5 0 112.12 2.12l-6 6a1.5 1.5 0 01-2.12 0l-6-6a1.5 1.5 0 010-2.12z" />
                                </svg>
                            }
                            required
                        />
                    </div>

                    {/* Reset Password Button */}
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Reset Password
                    </Button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Remember your password?{" "}
                        <Link to="/admin/login" className="text-blue-600 hover:underline"> Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}