import { Route, Routes } from "react-router-dom";
import LoginPage from "../admin/pages/login/Login";
import SignupPage from "../admin/pages/login/Signup";
import ForgetPasswordPage from "../admin/pages/login/ForgetPassword";

const AuthRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="sign-up" element={<SignupPage />} />
                <Route path="forget-password" element={<ForgetPasswordPage />} />
            </Routes>

        </>
    );
};

export default AuthRoutes;