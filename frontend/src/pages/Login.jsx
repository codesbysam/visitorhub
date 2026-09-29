import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User, LogIn, UserCheck } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(username, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleVisitorLogin = async () => {
    setError('');
    setIsSubmitting(true);
    
    // Auto-login with the seeded visitor account
    const result = await login('visitor', 'visitorpassword');
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setError('Visitor access is currently unavailable.');
    }
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
            <span>{isSubmitting ? 'Signing in...' : 'Sign In as Admin'}</span>
          </button>
        </form>

        <div className="demo-login-divider" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <span>Or</span>
        </div>

        <button 
          type="button" 
          className="btn btn-demo receptionist-demo-btn" 
          onClick={handleVisitorLogin}
          disabled={isSubmitting}
          style={{ width: '100%' }}
        >
          <UserCheck size={18} />
          <span>Login as Visitor (No Password)</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
