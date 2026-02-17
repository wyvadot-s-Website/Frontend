import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png";

import SuccessView from "@/components/auth/SuccessView.jsx";
import SignUpView from "../components/auth/SignUpView.jsx";
import VerifyEmailView from "../components/auth/VerifyEmailView.jsx";
import LoginView from "../components/auth/LoginView.jsx";
import ForgotPasswordView from "../components/auth/ForgotPasswordView.jsx";
import VerifyResetView from "../components/auth/VerifyResetView.jsx";
import ResetSuccessView from "../components/auth/ResetSuccessView.jsx";


import {
  signupUser,
  verifyUserEmail,
  loginUser,
  googleAuthUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  resendVerificationCode,
} from "@/services/userService";

// In initialFormState in AuthModal.jsx
const initialFormState = {
  firstName: "",
  middleName: "",
  lastName: "",
  phoneNumber: "",
  country: "",
  countryCode: "+234",  // ✅ Set default value!
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
  const [verifyResetError, setVerifyResetError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0)
  const [verifiedResetCode, setVerifiedResetCode] = useState("");
  

  const startCooldown = () => {
  setResendCooldown(600); // 60 seconds
  const timer = setInterval(() => {
    setResendCooldown((prev) => {
      if (prev <= 1) { clearInterval(timer); return 0; }
      return prev - 1;
    });
  }, 1000);
};

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
  // Validation
  if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
    toast.error("Please fill in all required fields");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  if (!formData.countryCode) {
    toast.error("Please enter country code");
    return;
  }

  if (!formData.phoneNumber) {
    toast.error("Please enter phone number");
    return;
  }

  try {
    setLoading(true);

    // Prepare data matching backend User schema
    const signupData = {
      firstName: formData.firstName,
      middleName: formData.middleName || "", // Optional field
      lastName: formData.lastName,
      email: formData.email,
      countryCode: formData.countryCode, // Send separately
      phoneNumber: formData.phoneNumber,  // Send separately
      country: formData.country || "",    // Optional field
      password: formData.password,
    };

    await signupUser(signupData);
toast.success("Verification code sent to your email");
startCooldown(); // ✅ ADD THIS - starts 10min timer immediately
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
      window.dispatchEvent(new Event("wyvadot_auth_updated"));
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
      window.dispatchEvent(new Event("wyvadot_auth_updated"));
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
      startCooldown(); // ✅ ADD THIS - starts 10min timer immediately
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
    setVerifyResetError("");
    const codeString = verificationCode.join("");
    await verifyResetCode({
      email: formData.email,
      code: codeString,
    });
    setVerifiedResetCode(codeString); // ✅ save it before clearing
    setVerificationCode(["", "", "", "", "", ""]);
    setView("reset");
  } catch (err) {
    setVerifyResetError("Invalid code, please try again");
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
      code: verifiedResetCode, // ✅ use saved code instead of cleared array
      newPassword: formData.newPassword,
    });
    toast.success("Password reset successful");
    resetForm();
    setVerifiedResetCode(""); // ✅ clear after success
    setView("reset-success");
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};
  // ✅ ADD: Resend OTP for signup verification
const handleResendSignupCode = async () => {
  try {
    setLoading(true);
    await resendVerificationCode(formData.email); // ✅ use dedicated endpoint
    toast.success("Verification code resent to your email");
    startCooldown();
  } catch (err) {
    toast.error(err.message || "Failed to resend code");
  } finally {
    setLoading(false);
  }
};

// ✅ ADD: Resend OTP for password reset
const handleResendResetCode = async () => {
  try {
    setLoading(true);
    await forgotPassword(formData.email);
    toast.success("Reset code resent to your email");
    startCooldown();
  } catch (err) {
    toast.error(err.message || "Failed to resend code");
  } finally {
    setLoading(false);
  }
};
  // ===============================
  // VIEW RENDERING
  // ===============================
  if (view === "success")
    return <SuccessView isOpen={isOpen} onContinue={() => setView("login")} />;

  if (view === "signup")
    return (
      <SignUpView
        isOpen={isOpen}
        onClose={onClose}
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
        onClose={onClose}
        email={formData.email}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        verificationCode={verificationCode}
        handleVerificationChange={handleVerificationChange}
        handleVerify={handleVerifySignup}
        onResendCode={handleResendSignupCode}
        resendCooldown={resendCooldown}
      />
    );

  if (view === "login")
  return (
    <LoginView
      isOpen={isOpen}
      onClose={onClose}
      formData={formData}
      handleChange={handleChange}
      showPassword={showPassword}           
      setShowPassword={setShowPassword}     
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
        onClose={onClose}
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
        onClose={onClose}
        verificationCode={verificationCode}
        handleVerificationChange={handleVerificationChange}
        handleVerify={handleVerifyReset}
        formData={formData}         
      onResendCode={handleResendResetCode}  
      verifyError={verifyResetError}
      resendCooldown={resendCooldown}
      />
    );

    if (view === "reset")
  return (
    <ForgotPasswordView
      isOpen={isOpen}
      onClose={onClose}
      formData={formData}
      handleChange={handleChange}
      handleContinue={handleResetPassword}  // ✅ calls reset, not forgot
      backToLogin={() => setView("login")}
      isReset={true}
      
    />
  );

  if (view === "reset-success")
    return (
      <ResetSuccessView
        isOpen={isOpen}
        onClose={onClose}
        logo={logo}
        continueToLogin={() => setView("login")}
      />
    );
    // ✅ ADD THIS - it's completely missing


  return null;
}

export default AuthModal;