import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import BASE_URL from '../utils/api.js'

function VerifyForm({ onNavigateToLogin }) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef([])

  const handleChange = (index, value) => {
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('')
    const newCode = [...code]

    pastedData.forEach((char, index) => {
      if (index < 6 && /^\d$/.test(char)) {
        newCode[index] = char
      }
    })

    setCode(newCode)

    const nextEmptyIndex = newCode.findIndex(val => !val)
    inputRefs.current[nextEmptyIndex === -1 ? 5 : nextEmptyIndex]?.focus()
  }

  const handleSubmit = async () => {
    const verificationCode = code.join('')
    const email = localStorage.getItem("pending_admin_email")

    if (!email) {
      toast.error("Signup session expired. Please sign up again.")
      return
    }

    if (verificationCode.length !== 6) {
      toast.error("Enter the 6-digit code")
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${BASE_URL}/api/admin/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: verificationCode
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Verification failed")
      }

      toast.success("Admin verified successfully ⭐⭐")
      localStorage.removeItem("pending_admin_email")

      onNavigateToLogin()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-2">Verify</h2>
      <p className="text-sm text-gray-600 text-center mb-8">
        6-digit code has been sent for admin approval
      </p>

      <div className="flex gap-3 justify-center mb-8">
        {code.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-lg font-semibold"
          />
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black hover:bg-gray-800 text-white"
      >
        {loading ? "Verifying…" : "Continue"}
      </Button>

      <p className="text-center text-sm text-gray-600 mt-6">
        Have an account?{' '}
        <button
          onClick={onNavigateToLogin}
          className="text-orange-500 hover:text-orange-600 font-semibold"
        >
          Login
        </button>
      </p>
    </div>
  )
}

export default VerifyForm

