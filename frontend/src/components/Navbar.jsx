import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, Plus, LayoutDashboard, LogOut, LogIn, UserPlus, Shield } from './Icons';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="brand">
          <div className="brand-icon">
            <Code2 size={20} />
          </div>
          <span>PasteBin<span style={{ color: 'var(--accent-primary)' }}>.io</span></span>
        </Link>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`btn btn-secondary ${isActive('/dashboard') ? 'active' : ''}`}
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/create"
                className="btn btn-primary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              >
                <Plus size={16} />
                <span>New Paste</span>
              </Link>

              <div className="nav-user">
                <div className="user-badge" title={`User ID: ${user?.id || 'Authenticated'}`}>
                  <Shield size={14} style={{ color: 'var(--accent-cyan)' }} />
                  <span>{user?.id ? `ID: ${user.id.substring(0, 6)}...` : 'User'}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="btn btn-danger"
                  style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
                  title="Logout"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`btn btn-secondary ${isActive('/login') ? 'active' : ''}`}
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="btn btn-primary"
              >
                <UserPlus size={16} />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
