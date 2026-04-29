import React, { useState, useEffect, useCallback } from 'react';
import API from '../utils/api';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/contact');
      setMessages(data.messages || []);
    } catch {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const markRead = async (id) => {
    try {
      await API.patch(`/contact/${id}/read`);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
    } catch { /* silent */ }
  };

  const handleExpand = (msg) => {
    setExpandedId(expandedId === msg._id ? null : msg._id);
    if (!msg.read) markRead(msg._id);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/contact/${deleteId}`);
      setDeleteId(null);
      fetchMessages();
    } catch {
      alert('Failed to delete message');
    } finally {
      setDeleting(false);
    }
  };

  const unread = messages.filter(m => !m.read).length;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-earth-900" style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1c1710' }}>
            Messages
          </h1>
          <p style={{ color: '#8b7145', marginTop: '2px', fontSize: '14px' }}>
            Customer contact messages
            {unread > 0 && (
              <span style={{
                marginLeft: '8px', backgroundColor: '#f97316', color: 'white',
                fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '999px'
              }}>
                {unread} unread
              </span>
            )}
          </p>
        </div>
        <button onClick={fetchMessages}
          style={{
            backgroundColor: 'white', border: '1px solid #dccfb4', borderRadius: '10px',
            padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            color: '#6e5a38'
          }}>
          🔄 Refresh
        </button>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', maxWidth: '360px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 'bold', color: '#1c1710', marginBottom: '8px' }}>Delete Message?</h3>
            <p style={{ color: '#8b7145', marginBottom: '20px', fontSize: '14px' }}>This message will be permanently deleted.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteId(null)}
                style={{ flex: 1, backgroundColor: '#f0e8d8', borderRadius: '10px', padding: '10px', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', borderRadius: '10px', padding: '10px', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: deleting ? 0.6 : 1 }}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div style={{ width: '36px', height: '36px', border: '4px solid #f97316', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>{error}</div>
      ) : messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f0e8d8' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          <p style={{ color: '#8b7145', fontSize: '16px', fontFamily: 'Georgia, serif' }}>No messages yet</p>
          <p style={{ color: '#a88d5f', fontSize: '13px', marginTop: '4px' }}>Customer messages will appear here</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map(msg => (
            <div key={msg._id}
              style={{
                backgroundColor: 'white',
                borderRadius: '14px',
                border: `1px solid ${msg.read ? '#f0e8d8' : '#fdba74'}`,
                boxShadow: msg.read ? '0 1px 3px rgba(0,0,0,0.05)' : '0 2px 8px rgba(249,115,22,0.1)',
                overflow: 'hidden',
                transition: 'all 0.2s',
              }}>
              {/* Message Header - always visible */}
              <div
                onClick={() => handleExpand(msg)}
                style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Unread dot */}
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: msg.read ? 'transparent' : '#f97316',
                  border: msg.read ? '1px solid #dccfb4' : 'none'
                }}></div>

                {/* Avatar */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  backgroundColor: msg.read ? '#f0e8d8' : '#fff7ed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 'bold', color: '#f97316', flexShrink: 0
                }}>
                  {msg.name[0].toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '700', color: '#1c1710', fontSize: '14px' }}>{msg.name}</span>
                    <span style={{ color: '#a88d5f', fontSize: '12px' }}>📞 {msg.phone}</span>
                    {!msg.read && (
                      <span style={{ backgroundColor: '#fff7ed', color: '#f97316', fontSize: '10px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '999px', border: '1px solid #fdba74' }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <p style={{
                    color: '#6e5a38', fontSize: '13px', marginTop: '2px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: expandedId === msg._id ? 'normal' : 'nowrap',
                    maxWidth: '100%'
                  }}>
                    {msg.message}
                  </p>
                </div>

                {/* Date + Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                  <span style={{ color: '#a88d5f', fontSize: '11px', whiteSpace: 'nowrap' }}>{formatDate(msg.createdAt)}</span>
                  <span style={{ fontSize: '12px', color: '#a88d5f' }}>{expandedId === msg._id ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Expanded Detail */}
              {expandedId === msg._id && (
                <div style={{ borderTop: '1px solid #f0e8d8', padding: '16px', backgroundColor: '#faf7f2' }}>
                  <p style={{ color: '#1c1710', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>
                    {msg.message}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <a href={`tel:${msg.phone}`}
                      style={{
                        backgroundColor: '#f97316', color: 'white', padding: '7px 14px',
                        borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px'
                      }}>
                      📞 Call {msg.name}
                    </a>
                    <a href={`https://wa.me/${msg.phone.replace(/\D/g, '')}?text=Hi ${msg.name}, regarding your enquiry...`}
                      target="_blank" rel="noreferrer"
                      style={{
                        backgroundColor: '#16a34a', color: 'white', padding: '7px 14px',
                        borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px'
                      }}>
                      💬 WhatsApp Reply
                    </a>
                    {!msg.read && (
                      <button onClick={() => markRead(msg._id)}
                        style={{
                          backgroundColor: '#f0e8d8', color: '#6e5a38', padding: '7px 14px',
                          borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer'
                        }}>
                        ✓ Mark as Read
                      </button>
                    )}
                    <button onClick={() => setDeleteId(msg._id)}
                      style={{
                        backgroundColor: '#fef2f2', color: '#ef4444', padding: '7px 14px',
                        borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer'
                      }}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}