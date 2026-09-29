import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Lock, User, LogIn } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleManualLogin = async (e, customUser, customPass) => {
    if (e) e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const userToLogin = customUser || username;
    const passToLogin = customPass || password;

    const result = await login(userToLogin, passToLogin);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    if (!credentialResponse.credential) {
      setError('Google Login failed. No credential received.');
      return;
    }
    const result = await loginWithGoogle(credentialResponse.credential);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleGoogleError = () => {
    setError('Google Login was unsuccessful or cancelled.');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-icon">
            <ShieldCheck size={42} color="#8DA2E2" />
          </div>
          <h2>VisitorHub</h2>
          <p>Please sign in to access visitor management</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleManualLogin}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                id="username"
                className="input-field"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="password"
                className="input-field"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={isSubmitting}>
            <LogIn size={18} />
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="demo-login-divider">
          <span>Or continue with Google</span>
        </div>

        <div className="google-auth-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            shape="rectangular"
            theme="outline"
            size="large"
            text="signin_with"
            width="100%"
          />
        </div>

        <div className="demo-login-divider" style={{ marginTop: '2rem' }}>
          <span>Quick Demo Testing</span>
        </div>

        <div className="demo-buttons-grid">
          <button
            type="button"
            className="btn btn-demo admin-demo-btn"
            onClick={() => handleManualLogin(null, 'admin', 'adminpassword')}
          >
            <ShieldCheck size={16} />
            <span>Admin</span>
          </button>

          <button
            type="button"
            className="btn btn-demo receptionist-demo-btn"
            onClick={() => handleManualLogin(null, 'receptionist', 'receptionpassword')}
          >
            <UserCheck size={16} />
            <span>Receptionist</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
