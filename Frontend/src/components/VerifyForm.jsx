import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function VerifyForm({ onNavigateToLogin }) {
    const [code, setCode] = useState(['', '', '', '', '', ''])
    const inputRefs = useRef([])

    const handleChange = (index, value) => {
        if (value.length > 1) return

        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        // Handle backspace
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

        // Focus the next empty input or the last one
        const nextEmptyIndex = newCode.findIndex(val => !val)
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
        inputRefs.current[focusIndex]?.focus()
    }

    const handleSubmit = () => {
        const verificationCode = code.join('')
        console.log('Verify with code:', verificationCode)
    }

    return (
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-2">Verify</h2>
            <p className="text-sm text-gray-600 text-center mb-8">
                6-digit code has been sent to your mail to confirm verification
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

            <Button onClick={handleSubmit} className="w-full bg-black hover:bg-gray-800 text-white">
                Continue
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