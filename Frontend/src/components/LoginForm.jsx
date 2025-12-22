import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'

function LoginForm({ onNavigateToSignup }) {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = () => {
        console.log('Login with:', formData)
        navigate("/theboss/dashboard")
    }

    return (
        <div className="w-full max-w-sm mx-auto bg-white/80 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-6 flex place-self-start">Login</h2>

            <div className="flex flex-col ">
                <div>
                    {/*<Label htmlFor="email" className="text-sm text-gray-600">Email</Label>*/}
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Email"
                    />
                </div>

                <div>
                    {/*<Label htmlFor="password" className="text-sm text-gray-600">Password</Label>*/}
                    <div className="relative mt-4">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            className="pr-10"
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <Button onClick={handleSubmit} className="w-30 h-10 flex place-self-end bg-black hover:bg-gray-800 text-white mt-6">
                    Continue
                </Button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <button
                    onClick={onNavigateToSignup}
                    className="text-orange-500 hover:text-orange-600 font-semibold"
                >
                    Create an account
                </button>
            </p>
        </div>
    )
}

export default LoginForm