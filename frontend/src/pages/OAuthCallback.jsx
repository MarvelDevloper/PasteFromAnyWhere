import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

const OAuthCallback = () => {
  const { login, showToast } = useAuth();
  const navigate = useNavigate();
  const calledRef = useRef(false);

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (calledRef.current) return;
    calledRef.current = true;

    const handleCallback = async () => {
      try {
        const response = await authApi.verifyRefresh();
        if (response.data?.token) {
          login(response.data.token, response.data.refreshToken);
          showToast('Login successful! Welcome back.', 'success');
          navigate('/dashboard', { replace: true });
        } else {
          showToast('Failed to authenticate with Google. Please try again.', 'error');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('Google OAuth callback verification error:', err);
        showToast('Authentication failed. Please try again.', 'error');
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [login, navigate, showToast]);

  return (
    <div className="auth-page">
      <div className="glass-card auth-card animate-fade-in" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h1 className="auth-title">Connecting to Google</h1>
        <p className="auth-subtitle" style={{ marginTop: '0.5rem' }}>
          Please wait while we complete your sign-in...
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.1)',
            borderTop: '4px solid var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
