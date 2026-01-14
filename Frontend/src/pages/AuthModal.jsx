import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png";

import SuccessView from "@/components/auth/SuccessView.jsx";
import SignUpView from "@/components/auth/SignupView.jsx";
import VerifyEmailView from "@/components/auth/VerifyEmailView.jsx";
import LoginView from "@/components/auth/LoginView.jsx";
import ForgotPasswordView from "@/components/auth/ForgotPasswordView.jsx";
import VerifyResetView from "@/components/auth/VerifyResetView.jsx";
import ResetSuccessView from "@/components/auth/ResetSuccessView.jsx";

import {
  signupUser,
  verifyUserEmail,
  loginUser,
  googleAuthUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "@/services/userService";

const initialFormState = {
  firstName: "",
  middleName: "",
  lastName: "",
  phoneNumber: "",
  country: "",
  countryCode: "",
  address: "",
  email: "",
  password: "",
  confirmPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

function AuthModal({ isOpen, onClose, initialView = "signup" }) {
  const [view, setView] = useState(initialView);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [formData, setFormData] = useState(initialFormState);

  // ===============================
  // RESET FORM
  // ===============================
  const resetForm = () => {
    setFormData(initialFormState);
    setVerificationCode(["", "", "", "", "", ""]);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      resetForm();
    }
  }, [isOpen, initialView]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleVerificationChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const code = [...verificationCode];
      code[index] = value;
      setVerificationCode(code);
    }
  };

  // ===============================
  // SIGN UP
  // ===============================
  const handleSignUp = async () => {
    try {
      setLoading(true);
      await signupUser(formData);
      toast.success("Verification code sent to your email");
      setView("verify");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignup = async () => {
    try {
      setLoading(true);
      await verifyUserEmail({
        email: formData.email,
        code: verificationCode.join(""),
      });

      toast.success("Email verified successfully");

      // 🔑 mark as newly signed up
      localStorage.setItem("justSignedUp", "true");

      resetForm();
      setView("success");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOGIN
  // ===============================
  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await loginUser(formData);

      localStorage.setItem("token", res.token);
      toast.success("Login successful");

      onClose();
      navigate("/home"); // dashboard
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // GOOGLE AUTH
  // ===============================
  const handleGoogleAuth = async (idToken) => {
    try {
      const res = await googleAuthUser(idToken);
      localStorage.setItem("token", res.token);
      toast.success("Authenticated with Google");
      resetForm();
      onClose();
      navigate("/home");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ===============================
  // FORGOT PASSWORD
  // ===============================
  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      await forgotPassword(formData.email);
      toast.success("Reset code sent to email");
      setView("verify-reset");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReset = async () => {
    try {
      setLoading(true);
      await verifyResetCode({
        email: formData.email,
        code: verificationCode.join(""),
      });
      setVerificationCode(["", "", "", "", "", ""]);
      setView("reset");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      await resetPassword({
        email: formData.email,
        code: verificationCode.join(""),
        newPassword: formData.newPassword,
      });
      toast.success("Password reset successful");
      resetForm();
      setView("reset-success");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // VIEW RENDERING
  // ===============================
  if (view === "success")
    return (
      <SuccessView
        isOpen={isOpen}
        onContinue={() => setView("login")}
      />
    );

  if (view === "signup")
    return (
      <SignUpView
        isOpen={isOpen}
        formData={formData}
        handleChange={handleChange}
        handleSignUp={handleSignUp}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        switchToLogin={() => setView("login")}
        onGoogleAuth={handleGoogleAuth}
        loading={loading}
      />
    );

  if (view === "verify")
    return (
      <VerifyEmailView
        isOpen={isOpen}
        email={formData.email}
        verificationCode={verificationCode}
        handleVerificationChange={handleVerificationChange}
        handleVerify={handleVerifySignup}
      />
    );

  if (view === "login")
    return (
      <LoginView
        isOpen={isOpen}
        formData={formData}
        handleChange={handleChange}
        handleLogin={handleLogin}
        goToSignup={() => setView("signup")}
        goToForgot={() => setView("forgot")}
        onGoogleAuth={handleGoogleAuth}
        loading={loading}
      />
    );

  if (view === "forgot")
    return (
      <ForgotPasswordView
        isOpen={isOpen}
        formData={formData}
        handleChange={handleChange}
        handleContinue={handleForgotPassword}
        backToLogin={() => setView("login")}
      />
    );

  if (view === "verify-reset")
    return (
      <VerifyResetView
        isOpen={isOpen}
        verificationCode={verificationCode}
        handleVerificationChange={handleVerificationChange}
        handleVerify={handleVerifyReset}
      />
    );

  if (view === "reset-success")
    return (
      <ResetSuccessView
        isOpen={isOpen}
        logo={logo}
        continueToLogin={() => setView("login")}
      />
    );

  return null;
}

export default AuthModal;

