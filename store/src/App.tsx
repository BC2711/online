import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminRoutes from "./pages/routes/AdminRoutes";
import PublicRoutes from "./pages/routes/PublicRoutes";
import { AuthProvider } from "./context/AuthContext";
import AuthRoutes from "./pages/routes/AuthRoutes";

// Error Boundary Component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            {children}
        </React.Suspense>
    );
};

const App = () => {
    return (
        <div className="App">
            <AuthProvider>
                <BrowserRouter>
                    <ErrorBoundary>
                        <Routes>
                            <Route path="/admin/*" element={<AdminRoutes />} />
                            <Route path="/store/*" element={<PublicRoutes />} />
                            <Route path="/auth/*" element={<AuthRoutes />} />
                        </Routes>
                    </ErrorBoundary>
                </BrowserRouter>
            </AuthProvider>

        </div>
    );
};

export default App;