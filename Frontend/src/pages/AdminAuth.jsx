import React, { useState } from 'react'
import SignUpForm from '../components/SignUpForm.jsx'
import LoginForm from '../components/LoginForm'
import VerifyForm from '../components/VerifyForm'

function AdminAuth() {
    const [currentView, setCurrentView] = useState('login') // 'signup', 'login', 'verify'

    return (
        <div className={'w-full max-w-md mx-auto'}>
            {/* Background Image - Wyveadat logo */}


            {/* Forms */}
            <div className="z-10">
                {currentView === 'signup' && (
                    <SignUpForm onNavigateToLogin={() => setCurrentView('login')} />
                )}

                {currentView === 'login' && (
                    <LoginForm onNavigateToSignup={() => setCurrentView('signup')} />
                )}

                {currentView === 'verify' && (
                    <VerifyForm onNavigateToLogin={() => setCurrentView('login')} />
                )}
            </div>

            {/* Navigation buttons for demo */}
            <div className="absolute bottom-8 right-8 flex gap-2 z-20">
                <button
                    onClick={() => setCurrentView('signup')}
                    className={`px-4 py-2 rounded text-sm ${
                        currentView === 'signup'
                            ? 'bg-orange-500 text-white'
                            : 'bg-white text-gray-700 border'
                    }`}
                >
                    Sign Up
                </button>
                <button
                    onClick={() => setCurrentView('login')}
                    className={`px-4 py-2 rounded text-sm ${
                        currentView === 'login'
                            ? 'bg-orange-500 text-white'
                            : 'bg-white text-gray-700 border'
                    }`}
                >
                    Login
                </button>
                <button
                    onClick={() => setCurrentView('verify')}
                    className={`px-4 py-2 rounded text-sm ${
                        currentView === 'verify'
                            ? 'bg-orange-500 text-white'
                            : 'bg-white text-gray-700 border'
                    }`}
                >
                    Verify
                </button>
            </div>
        </div>
    )
}

export default AdminAuth