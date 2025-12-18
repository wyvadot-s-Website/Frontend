import React, { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import logo from "../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png"

function AuthModal({ isOpen, onClose, initialView = 'signup' }) {
  const [view, setView] = useState(initialView)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    country: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  // Check if user has completed signup before
  useEffect(() => {
    if (isOpen) {
      const hasCompletedSignup = localStorage.getItem('wyvadotpr_signup_completed')
      if (hasCompletedSignup === 'true') {
        setView('login')
      } else {
        setView(initialView)
      }
    }
  }, [isOpen, initialView])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleVerificationChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)
      
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus()
      }
    }
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    setView('verify')
  }

  const handleLogin = (e) => {
    e.preventDefault()
    onClose()
  }

  const handleVerify = (e) => {
    e.preventDefault()
    // Mark signup as completed
    localStorage.setItem('wyvadotpr_signup_completed', 'true')
    setView('success')
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    setView('verify-reset')
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    setView('reset-success')
  }

  const handleCloseModal = () => {
    setVerificationCode(['', '', '', '', '', ''])
    onClose()
  }

  const handleSuccessContinue = () => {
    setView('welcome')
  }

  const handleWelcomeContinue = () => {
    handleCloseModal()
  }

  // Sign Up Success
  if (view === 'success') {
    return (
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">Account Created!</DialogTitle>
            <DialogDescription className="mb-6">
              Your account has been successfully created
            </DialogDescription>

            <Button
              onClick={handleSuccessContinue}
              className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Welcome/Splash Screen
  if (view === 'welcome') {
    return (
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className=" mx-auto mb-6 flex items-center justify-center">
              <div className="flex items-center gap-1">
                <div className=" bg-orange-500 rounded-full"></div>
                    <img src={logo} alt="" className='w-40 '/>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">Welcome to WyvadotPR</DialogTitle>
            <DialogDescription className="mb-8">
              Get started in the best laundry for you
            </DialogDescription>

            <Button
              onClick={handleWelcomeContinue}
              className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
            >
              Get started now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Sign Up View
  if (view === 'signup') {
    return (
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Sign up to WyvadotPR</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Your First name"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="middleName" className="text-sm font-medium">Middle name</Label>
              <Input
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Your Middle name"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Your Last name"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Your Country"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter Address"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your Password"
                  className="pr-10 border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="pr-10 border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleSignUp}
              className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
            >
              Sign Up
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-gray-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={() => setView('login')} className="text-orange-500 font-semibold hover:underline">
              Login
            </button>
          </p>
        </DialogContent>
      </Dialog>
    )
  }

  // Email Verification View
  if (view === 'verify') {
    return (
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Verify your email</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-sm">Enter the code sent to</Label>
              <p className="text-sm font-medium">{formData.email || 'wyvaman@gmail.com'}</p>
            </div>

            <div className="flex gap-2 justify-center">
              {verificationCode.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleVerificationChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-semibold border-gray-300"
                />
              ))}
            </div>

            <div className="text-center">
              <button className="text-sm text-orange-500 hover:underline">
                Resend code
              </button>
            </div>

            <Button
              onClick={handleVerify}
              className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
            >
              Verify
            </Button>

            <button
              onClick={() => setView('signup')}
              className="w-full text-sm text-gray-600 hover:underline"
            >
              ← Back to sign up
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Login View
  if (view === 'login') {
    return (
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Login to Wyvadotpr</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email Address"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your Password"
                  className="pr-10 border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-sm text-orange-500 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
            >
              Login
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-gray-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={() => setView('signup')} className="text-orange-500 font-semibold hover:underline">
              Sign Up
            </button>
          </p>
        </DialogContent>
      </Dialog>
    )
  }

  // Forgot Password View
  if (view === 'forgot') {
    return (
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Reset Password ?</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword" className="text-sm font-medium">Confirm Password</Label>
              <Input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="border-gray-300"
              />
            </div>

            <Button
              onClick={handleForgotPassword}
              className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
            >
              Continue
            </Button>

            <button
              onClick={() => setView('login')}
              className="w-full text-sm text-gray-600 hover:underline"
            >
              ← Back to login
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Verify Reset Password
  if (view === 'verify-reset') {
    return (
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Verify your email</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-sm">Enter the code sent to</Label>
              <p className="text-sm font-medium">{formData.email || 'presente@gmail.com'}</p>
            </div>

            <div className="flex gap-2 justify-center">
              {verificationCode.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleVerificationChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-semibold border-gray-300"
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-red-500 mb-2">Invalid code, retry again</p>
              <button className="text-sm text-orange-500 hover:underline">
                Resend code
              </button>
            </div>

            <Button
              onClick={handleResetPassword}
              className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
            >
              Verify
            </Button>

            <button
              onClick={() => setView('forgot')}
              className="w-full text-sm text-gray-600 hover:underline"
            >
              ← Back to login
            </button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Password Reset Success
  if (view === 'reset-success') {
    return (
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className=" mx-auto mb-6 flex items-center justify-center">
              <div className="flex items-center gap-1">
                <div className=" bg-orange-500 rounded-full"></div>
                    <img src={logo} alt="" className='w-40 '/>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">Password Updated</DialogTitle>
            <DialogDescription className="mb-8">
              Your password has been successfully changed
            </DialogDescription>

            <Button
              onClick={() => setView('login')}
              className="w-full bg-[#FF8D28] hover:bg-orange-600 text-white"
            >
              Continue to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}

export default AuthModal