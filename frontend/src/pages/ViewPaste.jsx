import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Copy, LinkIcon, Edit3, Trash2, Globe, Lock, Clock, AlertCircle } from '../components/Icons';
import { pasteApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DeleteModal from '../components/DeleteModal';

const ViewPaste = () => {
  const { pasteId } = useParams();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaste = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await pasteApi.getSingle(pasteId);
        if (response.data?.success) {
          // Backend getSingle returns object or pastes array
          const fetchedPastes = response.data.pastes;
          if (Array.isArray(fetchedPastes)) {
            const found = fetchedPastes.find((p) => p._id === pasteId);
            if (found) {
              setPaste(found);
            } else if (fetchedPastes.length > 0) {
              setPaste(fetchedPastes[0]);
            } else {
              setError('Paste not found.');
            }
          } else if (fetchedPastes) {
            setPaste(fetchedPastes);
          } else {
            setError('Paste not found.');
          }
        } else {
          setError(response.data?.msg || 'Unable to fetch paste details.');
        }
      } catch (err) {
        if (err.response?.status === 402) {
          setError('This paste is private. Only the owner can view it.');
        } else {
          setError(err.response?.data?.msg || 'Failed to load paste.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (pasteId) {
      fetchPaste();
    }
  }, [pasteId]);

  const copyContent = () => {
    if (!paste) return;
    navigator.clipboard.writeText(paste.content);
    showToast('Content copied to clipboard!', 'success');
  };

  const copyShareableLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast('Shareable URL copied to clipboard!', 'success');
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await pasteApi.delete(pasteId);
      showToast(response.data?.msg || 'Paste deleted successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to delete paste.', 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const isOwner = user?.id && paste?.userId && (paste.userId === user.id || paste.userId._id === user.id);

  const lines = paste?.content ? paste.content.split('\n') : [];

  return (
    <div className="main-content animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {loading ? (
        <div className="glass-card skeleton" style={{ height: '300px' }} />
      ) : error ? (
        <div className="empty-state">
          <div className="empty-icon" style={{ color: '#fb7185' }}>
            <AlertCircle size={32} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Unable to Access Paste</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/dashboard" className="btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      ) : paste ? (
        <div className="view-paste-container">
          {/* Header Card */}
          <div className="view-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className={`badge ${paste.privacy === 'private' ? 'badge-private' : 'badge-public'}`}>
                  {paste.privacy === 'private' ? <Lock size={12} /> : <Globe size={12} />}
                  {paste.privacy || 'public'}
                </span>
                <span className="badge badge-lang">{paste.language || 'text'}</span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, wordBreak: 'break-word' }}>{paste.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                <Clock size={14} />
                <span>
                  Created on {new Date(paste.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={copyContent}>
                <Copy size={16} />
                <span>Copy Raw</span>
              </button>
              <button className="btn btn-secondary" onClick={copyShareableLink}>
                <LinkIcon size={16} />
                <span>Share URL</span>
              </button>

              {isOwner && (
                <>
                  <Link to={`/paste/${paste._id}/edit`} className="btn btn-secondary">
                    <Edit3 size={16} />
                    <span>Edit</span>
                  </Link>
                  <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Code Viewer Container */}
          <div className="code-viewer-container">
            <div className="code-viewer-toolbar">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {lines.length} lines | {paste.content.length} characters
              </span>
              <button className="icon-btn" onClick={copyContent} title="Copy Code">
                <Copy size={16} />
              </button>
            </div>

            <div className="code-content-wrapper" style={{ display: 'flex' }}>
              <div
                style={{
                  userSelect: 'none',
                  paddingRight: '1rem',
                  marginRight: '1rem',
                  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-dim)',
                  textAlign: 'right',
                }}
              >
                {lines.map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>
              <div style={{ flex: 1 }}>{paste.content}</div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        pasteTitle={paste?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ViewPaste;
