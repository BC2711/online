import React, { useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../../service/api/admin/login/login";
import { useAuth } from "../../../../context/AuthContext";

// ErrorMessages Component
interface ErrorMessagesProps {
    errors?: string[] | string;
    id?: string;
}

const ErrorMessages: React.FC<ErrorMessagesProps> = ({ errors, id }) => {
    if (!errors) return null;
    const errorList = Array.isArray(errors) ? errors : [errors];
    if (errorList.length === 0) return null;

    return (
        <div id={id} className="mt-1 space-y-1">
            {errorList.map((error, index) => (
                <p key={index} className="text-sm font-medium text-red-600">
                    {error}
                </p>
            ))}
        </div>
    );
};

// Form-related interfaces
interface FormErrors {
    email?: string;
    password?: string;
    general?: string; // Added to handle general errors
}

interface FormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const [error, setError] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const { setAuthToken } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError({});
        setLoading(true);

        try {
            const response = await login(formData);
            if (!response.token) {
                throw new Error("Login failed: No token received.");
            }

            // Store the token and user data
            setAuthToken(response.token);
            localStorage.setItem("authToken", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));

            // Redirect to the admin dashboard
            navigate("/admin/home");
        } catch (error: any) {
            setError({
                email: error.errors.email,
                password: error.errors.password,
                general: error.message || "An unexpected error occurred. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                {/* Branding */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                    <p className="text-gray-600 text-sm">Sign in to manage your store</p>
                </div>

                {/* Error Message */}
                <div className="text-center">
                    <ErrorMessages errors={error.general} id="general-error" />
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <Typography variant="h6" color="primary" className="mb-2">
                            Email Address
                        </Typography>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            aria-label="Email Address"
                        />
                        <ErrorMessages errors={error.email} id="email-error" />
                    </div>
                    <div className="mb-4">
                        <Typography variant="h6" color="primary" className="mb-2">
                            Password
                        </Typography>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            aria-label="Password"
                        />
                        <ErrorMessages errors={error.password} id="password-error" />
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right mb-4">
                        <Link
                            to="/admin/forget-password"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={loading}
                    >
                        {loading ? "Logging In..." : "Log In"}
                    </Button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link className="text-blue-600 hover:underline" to="/admin/sign-up">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}