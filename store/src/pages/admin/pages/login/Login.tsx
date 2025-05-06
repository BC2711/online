import React, { useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { login } from "../../../../service/api/admin/login/login";
import { useAuth } from "../../../../context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { setAuthToken } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const credentials = { email, password };
            const response = await login(credentials);

            console.log("Login successful:", response.token);
            if(!response.token) {
                throw new Error("Login failed: No token received.");
            }

            // Store the token in localStorage or a state management library
            // setAuthToken(response.token);
            // Optionally, you can store user data in localStorage or a state management library
            localStorage.setItem("authToken", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));

            // Redirect to the admin dashboard
            window.location.href = "/admin/home";
        } catch (error: any) {
            console.error("Error during login:", error);
            setError(error.message || "An unexpected error occurred. Please try again.");
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
                {error && (
                    <div className="mb-4 text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <Typography variant="h6" color="primary" className="mb-2">
                            Email Address
                        </Typography>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-label="Email Address"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Typography variant="h6" color="primary" className="mb-2">
                            Password
                        </Typography>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-label="Password"
                            required
                        />
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right mb-4">
                        <Link to="/admin/forget-password" className="text-sm text-blue-600 hover:underline">
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