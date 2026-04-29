import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const c = {
  amber: '#f97316', amberDark: '#c2410c', cream: '#fdf8f3',
  dark: '#1a0e04', mid: '#78350f', muted: '#a16207',
  green: '#16a34a', red: '#dc2626', blue: '#2563eb',
};

function StatCard({ icon, label, value, sub, accent, href }) {
  const [hov, setHov] = useState(false);
  const content = (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: 'white', borderRadius: '16px', padding: '22px 24px',
        border: `1px solid ${hov ? accent + '55' : 'rgba(0,0,0,0.07)'}`,
        boxShadow: hov ? `0 8px 32px ${accent}1a` : '0 1px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.2s', cursor: href ? 'pointer' : 'default',
        transform: hov ? 'translateY(-2px)' : 'none',
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${accent}25`,
        }}>
          {icon}
        </div>
        {href && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}><path d="M7 17L17 7M7 7h10v10"/></svg>}
      </div>
      <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b5545', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '32px', fontWeight: '800', color: c.dark, fontFamily: 'Georgia, serif', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: accent, fontWeight: '600', marginTop: '6px' }}>{sub}</div>}
    </div>
  );
  return href ? <Link to={href} style={{ textDecoration: 'none' }}>{content}</Link> : content;
}

export default function DashboardPage() {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([API.get('/products'), API.get('/contact')])
      .then(([p, m]) => {
        const prods = p.data.products || [];
        const msgs = m.data.messages || [];
        setStats({
          total: prods.length,
          available: prods.filter(x => x.availability === 'Available').length,
          outOfStock: prods.filter(x => x.availability === 'Out of Stock').length,
          unread: m.data.unreadCount || 0,
          messages: msgs.length,
        });
        setRecent(prods.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '44px', height: '44px', border: `3px solid ${c.amber}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 14px' }}></div>
        <p style={{ color: c.muted, fontSize: '14px' }}>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: '1300px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ color: c.muted, fontSize: '13px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>
          {greeting} ☀️
        </p>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: c.dark, fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>
          Welcome back, {admin?.name}
        </h1>
        <p style={{ color: '#9a7c6a', fontSize: '14px', marginTop: '5px' }}>Here's your store overview for today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        <StatCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}
          label="Total Products" value={stats?.total ?? 0} accent={c.amber} sub="in your store" href="/products" />
        <StatCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
          label="Available" value={stats?.available ?? 0} accent={c.green} sub="ready to sell" />
        <StatCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
          label="Out of Stock" value={stats?.outOfStock ?? 0} accent={c.red} sub="needs restock" />
        <StatCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
          label="Messages" value={stats?.messages ?? 0} accent={c.blue}
          sub={stats?.unread > 0 ? `${stats.unread} unread` : 'All caught up ✓'} href="/messages" />
      </div>

      {/* Quick Actions */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '22px 24px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: c.dark, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Actions</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {[
            { to: '/products', label: '+ Add Product', bg: c.amber, color: 'white', shadow: `0 4px 14px ${c.amber}40` },
            { to: '/products', label: '📦 Manage Inventory', bg: '#fef7f0', color: c.amberDark, border: `1px solid ${c.amber}30` },
            { to: '/messages', label: `📩 View Messages${stats?.unread > 0 ? ` (${stats.unread})` : ''}`, bg: '#eff6ff', color: c.blue, border: '1px solid #bfdbfe' },
          ].map(btn => (
            <Link key={btn.label} to={btn.to}
              style={{
                padding: '9px 18px', borderRadius: '10px', textDecoration: 'none',
                background: btn.bg, color: btn.color, fontWeight: '600', fontSize: '13.5px',
                border: btn.border || 'none', boxShadow: btn.shadow || 'none',
                transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: '6px',
              }}>
              {btn.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Products */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: c.dark, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Products</h3>
          <Link to="/products" style={{ fontSize: '13px', color: c.amber, fontWeight: '600', textDecoration: 'none' }}>View all →</Link>
        </div>

        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '44px', marginBottom: '10px' }}>🐓</div>
            <p style={{ color: c.muted, fontSize: '15px', fontWeight: '600', margin: '0 0 4px' }}>No products yet</p>
            <Link to="/products" style={{ color: c.amber, fontSize: '13px', fontWeight: '600' }}>Add your first product</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1px', background: 'rgba(0,0,0,0.05)' }}>
            {recent.map(p => (
              <div key={p._id} style={{ background: 'white', padding: '16px', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef7f0'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
                onClick={() => navigate('/products')}>
                <div style={{ width: '100%', paddingBottom: '75%', position: 'relative', borderRadius: '10px', overflow: 'hidden', background: '#f5ede3', marginBottom: '10px' }}>
                  {p.image?.url
                    ? <img src={p.image.url} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🐓</div>}
                </div>
                <p style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '13px', color: c.dark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                <p style={{ margin: '0 0 8px', fontSize: '12px', color: c.muted, fontWeight: '600' }}>₹{p.price}/{p.priceUnit}</p>
                <span style={{
                  fontSize: '10.5px', fontWeight: '700', padding: '3px 8px', borderRadius: '999px',
                  background: p.availability === 'Available' ? '#dcfce7' : '#fee2e2',
                  color: p.availability === 'Available' ? '#15803d' : '#dc2626',
                }}>
                  {p.availability === 'Available' ? '● In Stock' : '● Out of Stock'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
