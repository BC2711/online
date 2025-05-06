import React from "react";
import { Button, Input } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                {/* Branding */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
                    <p className="text-gray-600 text-sm">Join us and start your journey</p>
                </div>

                {/* Signup Form */}
                <form>
                    <div className="mb-4">
                        <Input
                            type="text"
                            label="Full Name"
                            placeholder="Enter your full name"
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 2a4 4 0 00-4 4v1a4 4 0 108 0V6a4 4 0 00-4-4zM4 12a6 6 0 0112 0v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            }
                            required
                        />
                    </div>
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
                    <div className="mb-4">
                        <Input
                            type="password"
                            label="Password"
                            placeholder="Enter your password"
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 2a4 4 0 00-4 4v2H5a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3v-6a3 3 0 00-3-3h-1V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v2H8V6zm-3 5a1 1 0 011-1h8a1 1 0 011 1v6a1 1 0 01-1 1H6a1 1 0 01-1-1v-6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            }
                            required
                        />
                    </div>

                    {/* Signup Button */}
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Sign Up
                    </Button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/admin/login" className="text-blue-600 hover:underline"> Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}