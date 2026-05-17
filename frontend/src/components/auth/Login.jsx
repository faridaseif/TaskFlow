import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        setIsLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
        const payload = isLogin ? { email, password } : { email, password, name };

        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log("Auth Response Data:", data);

            if (data.success) {
                if (isLogin) {
                    login({
                        name: data.name,
                        email: data.email,
                        role: data.role,
                        signupDate: data.signupDate
                    });

                    // Always redirect to profile on login
                    navigate('/profile');
                } else {
                    setSuccessMsg("Registration successful! Please sign in.");
                    setIsLogin(true);
                }
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Server connection failed. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            console.log("Login/Signup response:", data);

            if (data.success) {
                setSuccessMsg(data.message);
                setIsResetting(true);
            } else {
                setError(data.message || "Email verification failed.");
            }
        } catch (err) {
            setError("Failed to process request. Check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword })
            });
            const data = await response.json();
            if (data.success) {
                setSuccessMsg("Password reset successful! Please sign in.");
                setIsResetting(false);
                setIsForgotPassword(false);
                setIsLogin(true);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* BACKGROUND DECORATION */}
            <div className="background-decoration">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
                <div className="blob blob-4"></div>
            </div>

            <div className={`auth-card-container ${!isLogin ? 'right-panel-active' : ''}`} id="container">

                {/* SIGN UP FORM */}
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-brand">
                            <div className="logo-box">
                                <svg className="logo-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                            </div>
                        </div>
                        <h1>Create Account</h1>
                        <p className="subtitle">Enter your workspace details to get started</p>

                        <div className="input-with-icon">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-with-icon">
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-with-icon">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? "🙈" : "👁️"}
                            </span>
                        </div>
                        {error && !isLogin && <div className="error-msg">{error}</div>}
                        {successMsg && !isLogin && <div className="success-msg">{successMsg}</div>}
                        <button type="submit" className="primary-btn" disabled={isLoading}>
                            {isLoading ? 'CREATING WORKSPACE...' : 'SIGN UP'}
                        </button>
                    </form>
                </div>

                {/* LOG IN / FORGOT PASSWORD FORM */}
                <div className="form-container sign-in-container">
                    {isForgotPassword ? (
                        <form onSubmit={isResetting ? handleResetPassword : handleForgotPassword}>
                            <div className="form-brand">
                                <div className="logo-box">
                                    <svg className="logo-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="14" width="7" height="7"></rect>
                                        <rect x="3" y="14" width="7" height="7"></rect>
                                    </svg>
                                </div>
                            </div>
                            <h1>{isResetting ? 'Reset Password' : 'Forgot Password'}</h1>
                            <p className="subtitle">
                                {isResetting ? 'Enter your new workspace password' : 'Enter your email to verify your account'}
                            </p>
                            
                            <div className="input-with-icon">
                                <input 
                                    type="email" 
                                    placeholder="Email address" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isResetting}
                                />
                            </div>
                            
                            {isResetting && (
                                <div className="input-with-icon">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="New Password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? "🙈" : "👁️"}
                                    </span>
                                </div>
                            )}

                            {error && <div className="error-msg">{error}</div>}
                            {successMsg && <div className="success-msg">{successMsg}</div>}
                            
                            <button type="submit" className="primary-btn" disabled={isLoading}>
                                {isLoading ? 'PROCESSING...' : (isResetting ? 'UPDATE PASSWORD' : 'VERIFY EMAIL')}
                            </button>
                            
                            <a href="#" className="forgot-password" style={{marginTop: '20px', display: 'block'}} onClick={(e) => {
                                e.preventDefault();
                                setIsForgotPassword(false);
                                setIsResetting(false);
                                setError(null);
                                setSuccessMsg(null);
                            }}>
                                Back to Sign In
                            </a>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-brand">
                                <div className="logo-box">
                                    <svg className="logo-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="14" width="7" height="7"></rect>
                                        <rect x="3" y="14" width="7" height="7"></rect>
                                    </svg>
                                </div>
                            </div>
                            <h1>Welcome back</h1>
                            <p className="subtitle">Sign in to your dashboard to manage tasks</p>
                            
                            <div className="input-with-icon">
                                <input 
                                    type="email" 
                                    placeholder="Email address" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-with-icon">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "🙈" : "👁️"}
                                </span>
                            </div>
                            <div className="forgot-container">
                                <a href="#" className="forgot-password" onClick={(e) => {
                                    e.preventDefault();
                                    setIsForgotPassword(true);
                                    setError(null);
                                    setSuccessMsg(null);
                                }}>Forgot your password?</a>
                            </div>
                            {error && isLogin && <div className="error-msg">{error}</div>}
                            {successMsg && isLogin && <div className="success-msg">{successMsg}</div>}
                            <button type="submit" className="primary-btn" disabled={isLoading}>
                                {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                            </button>
                        </form>
                    )}
                </div>

                {/* OVERLAY CONTAINER */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Already have an account?</h1>
                            <p>Sign in to access your projects and task progress.</p>
                            <button className="ghost-btn" id="signIn" onClick={() => { setIsLogin(true); setIsForgotPassword(false); setIsResetting(false); setError(null); setSuccessMsg(null); }}>SIGN IN</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>New to TaskFlow?</h1>
                            <p>Create a professional workspace and start managing your projects today.</p>
                            <button className="ghost-btn" id="signUp" onClick={() => { setIsLogin(false); setIsForgotPassword(false); setIsResetting(false); setError(null); setSuccessMsg(null); }}>SIGN UP</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
