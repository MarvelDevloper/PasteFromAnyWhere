// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from '../components/Icons';
// import { authApi } from '../services/api';
// import { useAuth } from '../context/AuthContext';

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const { login, showToast } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.email || !formData.password) {
//       setError('Please fill in all fields.');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await authApi.login(formData);
//       if (response.data?.token) {
//         login(response.data.token, response.data.refreshToken);
//         showToast('Login successful! Welcome back.', 'success');
//         navigate('/dashboard');
//       } else {
//         setError(response.data?.msg || 'Login failed. Please check your credentials.');
//       }
//     } catch (err) {
//       setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to connect to the server. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="glass-card auth-card animate-fade-in">
//         <div className="auth-header">
//           <h1 className="auth-title">Welcome Back</h1>
//           <p className="auth-subtitle">Sign in to manage and share your pastes</p>
//         </div>

//         {error && (
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '0.5rem',
//             background: 'rgba(244, 63, 94, 0.15)',
//             border: '1px solid rgba(244, 63, 94, 0.3)',
//             color: '#fb7185',
//             padding: '0.75rem 1rem',
//             borderRadius: 'var(--radius-md)',
//             marginBottom: '1.25rem',
//             fontSize: '0.875rem'
//           }}>
//             <AlertCircle size={18} style={{ flexShrink: 0 }} />
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className="form-label" htmlFor="email">Email Address</label>
//             <div style={{ position: 'relative' }}>
//               <input
//                 id="email"
//                 type="email"
//                 name="email"
//                 className="form-input"
//                 placeholder="name@example.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 disabled={loading}
//                 required
//                 style={{ paddingLeft: '2.5rem' }}
//               />
//               <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
//             </div>
//           </div>

//           <div className="form-group">
//             <label className="form-label" htmlFor="password">Password</label>
//             <div style={{ position: 'relative' }}>
//               <input
//                 id="password"
//                 type="password"
//                 name="password"
//                 className="form-input"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={handleChange}
//                 disabled={loading}
//                 required
//                 style={{ paddingLeft: '2.5rem' }}
//               />
//               <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={loading}
//             style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
//           >
//             {loading ? (
//               'Signing in...'
//             ) : (
//               <>
//                 <span>Sign In</span>
//                 <ArrowRight size={16} />
//               </>
//             )}
//           </button>
//         </form>

//         <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
//           Don't have an account?{' '}
//           <Link to="/register" style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
//             Create Account
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from '../components/Icons';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, showToast } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(formData);
      if (response.data?.token) {
        login(response.data.token, response.data.refreshToken);
        showToast('Login successful! Welcome back.', 'success');
        navigate('/dashboard');
      } else {
        setError(response.data?.msg || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to connect to the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card animate-fade-in">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to manage and share your pastes</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                name="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
          >
            {loading ? (
              'Signing in...'
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Google OAuth Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '1.5rem 0'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'var(--border-color)'
          }} />

          <span style={{
            fontSize: '0.8rem',
            color: 'var(--text-dim)'
          }}>
            OR
          </span>

          <div style={{
            flex: 1,
            height: '1px',
            background: 'var(--border-color)'
          }} />
        </div>

        {/* Google OAuth Login */}
        <button
          type="button"
          className="btn"
          onClick={() => {
            window.location.href =
              'https://paste-from-any-where.vercel.app/auth/google';
          }}
          style={{
            width: '100%',
            padding: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: 'white',
            color: '#111',
            border: '1px solid #ddd'
          }}
        >
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 700
          }}>
            G
          </span>

          <span>Continue with Google</span>
        </button>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;