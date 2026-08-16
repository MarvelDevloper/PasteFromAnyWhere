import React from 'react';
import { AlertTriangle, X } from './Icons';

const DeleteModal = ({ isOpen, onClose, onConfirm, pasteTitle, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fb7185', fontWeight: 700 }}>
            <AlertTriangle size={20} />
            <span>Confirm Deletion</span>
          </div>
          <button className="icon-btn" onClick={onClose} disabled={isDeleting}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
          Are you sure you want to delete <strong style={{ color: '#fff' }}>"{pasteTitle || 'this paste'}"</strong>? This action cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Paste'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
