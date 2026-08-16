import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FileCode, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from '../components/Icons';
import { pasteApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PasteCard from '../components/PasteCard';
import DeleteModal from '../components/DeleteModal';

const Dashboard = () => {
  const [pastes, setPastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering & Search
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'public' | 'private'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPastes, setTotalPastes] = useState(0);

  // Deletion Modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useAuth();

  const fetchPastes = async (currentPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await pasteApi.getAll(currentPage, 9);
      if (response.data?.success) {
        setPastes(response.data.pastes || []);
        setPage(response.data.page || 1);
        setTotalPages(response.data.totalPages || 1);
        setTotalPastes(response.data.totalPastes || 0);
      } else {
        setPastes([]);
      }
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.msg === 'no paste found') {
        setPastes([]);
      } else {
        setError(err.response?.data?.msg || 'Failed to load pastes. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastes(page);
  }, [page]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const response = await pasteApi.delete(deleteTarget._id);
      showToast(response.data?.msg || 'Paste deleted successfully!', 'success');
      setDeleteTarget(null);
      fetchPastes(page);
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to delete paste.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter local pastes by activeTab and searchTerm
  const filteredPastes = pastes.filter((paste) => {
    const matchesPrivacy =
      activeTab === 'all' ? true : paste.privacy === activeTab;
    const matchesSearch =
      paste.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paste.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paste.language && paste.language.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesPrivacy && matchesSearch;
  });

  return (
    <div className="main-content animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Pastes & Code Snippets</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Manage, view, share, and update your pastes in one place.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => fetchPastes(page)} title="Refresh">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
          <Link to="/create" className="btn btn-primary">
            <Plus size={18} />
            <span>Create New Paste</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="tab-group">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Pastes ({pastes.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'public' ? 'active' : ''}`}
            onClick={() => setActiveTab('public')}
          >
            Public ({pastes.filter(p => p.privacy === 'public').length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'private' ? 'active' : ''}`}
            onClick={() => setActiveTab('private')}
          >
            Private ({pastes.filter(p => p.privacy === 'private').length})
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            className="form-input"
            placeholder="Search pastes by title, content, or language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={16} className="search-icon" />
        </div>
      </div>

      {/* Main Content Area */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#fb7185',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="pastes-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card skeleton" style={{ height: '180px' }} />
          ))}
        </div>
      ) : filteredPastes.length > 0 ? (
        <>
          <div className="pastes-grid">
            {filteredPastes.map((paste) => (
              <PasteCard
                key={paste._id}
                paste={paste}
                onDeleteClick={(target) => setDeleteTarget(target)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', padding: '0 0.5rem' }}>
                Page <strong style={{ color: '#fff' }}>{page}</strong> of {totalPages}
              </span>

              <button
                className="btn btn-secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FileCode size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            No Pastes Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            {searchTerm
              ? `No pastes matched your search "${searchTerm}".`
              : activeTab !== 'all'
              ? `No ${activeTab} pastes found.`
              : 'You haven\'t created any pastes yet.'}
          </p>
          <Link to="/create" className="btn btn-primary">
            <Plus size={16} />
            <span>Create Your First Paste</span>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        pasteTitle={deleteTarget?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
