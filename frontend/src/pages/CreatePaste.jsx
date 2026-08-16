import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, ArrowLeft, Code2, Lock, Globe, AlertCircle, FileText } from '../components/Icons';
import { pasteApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML / CSS' },
  { value: 'cpp', label: 'C / C++' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'text', label: 'Plain Text' },
];

const CreatePaste = () => {
  const [formData, setFormData] = useState({
    title: '',
    language: 'javascript',
    privacy: 'public',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { showToast } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.language) {
      setError('Title, programming language, and content are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await pasteApi.create(formData);
      showToast(response.data?.msg || 'Paste successfully created!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to create paste.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="glass-card">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.3rem' }}>Create New Paste</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Share code, text, or notes with custom privacy settings.
          </p>
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
            <label className="form-label" htmlFor="title">Paste Title</label>
            <div style={{ position: 'relative' }}>
              <input
                id="title"
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Authentication Middleware Helper"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <FileText size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="language">Syntax Language</label>
              <div style={{ position: 'relative' }}>
                <select
                  id="language"
                  name="language"
                  className="form-select"
                  value={formData.language}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ paddingLeft: '2.5rem' }}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <Code2 size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="privacy">Privacy Exposure</label>
              <div style={{ position: 'relative' }}>
                <select
                  id="privacy"
                  name="privacy"
                  className="form-select"
                  value={formData.privacy}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ paddingLeft: '2.5rem' }}
                >
                  <option value="public">Public - Accessible via link</option>
                  <option value="private">Private - Only accessible by owner</option>
                </select>
                {formData.privacy === 'private' ? (
                  <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-amber)' }} />
                ) : (
                  <Globe size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-green)' }} />
                )}
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label" htmlFor="content">Paste Content / Code</label>
            <textarea
              id="content"
              name="content"
              className="form-textarea code-font"
              rows={14}
              placeholder="// Paste your code or plain text here..."
              value={formData.content}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Link to="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                'Creating Paste...'
              ) : (
                <>
                  <Plus size={18} />
                  <span>Create Paste</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePaste;
