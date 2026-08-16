import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Copy, LinkIcon, Edit3, Trash2, Globe, Lock, Clock } from './Icons';
import { useAuth } from '../context/AuthContext';

const PasteCard = ({ paste, onDeleteClick }) => {
  const { user, showToast } = useAuth();

  const isOwner = user?.id && paste.userId && (paste.userId === user.id || paste.userId._id === user.id);

  const copyContent = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(paste.content);
    showToast('Content copied to clipboard!', 'success');
  };

  const copyShareableLink = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/paste/${paste._id}`;
    navigator.clipboard.writeText(url);
    showToast('Shareable URL copied to clipboard!', 'success');
  };

  const formattedDate = paste.createdAt
    ? new Date(paste.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="paste-card">
      <div>
        <div className="paste-card-header">
          <div>
            <span className={`badge ${paste.privacy === 'private' ? 'badge-private' : 'badge-public'}`}>
              {paste.privacy === 'private' ? <Lock size={11} /> : <Globe size={11} />}
              {paste.privacy || 'public'}
            </span>
            <span className="badge badge-lang" style={{ marginLeft: '0.4rem' }}>
              {paste.language || 'text'}
            </span>
          </div>

          <div className="card-actions">
            <button className="icon-btn" onClick={copyContent} title="Copy Raw Content">
              <Copy size={15} />
            </button>
            <button className="icon-btn" onClick={copyShareableLink} title="Copy Shareable Link">
              <LinkIcon size={15} />
            </button>
            {isOwner && (
              <>
                <Link to={`/paste/${paste._id}/edit`} className="icon-btn" title="Edit Paste">
                  <Edit3 size={15} />
                </Link>
                <button
                  className="icon-btn danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick(paste);
                  }}
                  title="Delete Paste"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>

        <Link to={`/paste/${paste._id}`} style={{ textDecoration: 'none' }}>
          <h3 className="paste-card-title">{paste.title}</h3>
          <div className="paste-snippet">{paste.content}</div>
        </Link>
      </div>

      <div className="paste-card-footer">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={13} />
          {formattedDate}
        </span>

        <Link to={`/paste/${paste._id}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.775rem' }}>
          <Eye size={13} />
          View
        </Link>
      </div>
    </div>
  );
};

export default PasteCard;
