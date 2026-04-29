import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/products', label: 'Products', end: false },
  { to: '/messages', label: 'Messages', end: false },
];

const NAV_ICONS = {
  '/': <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  '/products': <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  '/messages': <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

const sidebar = {
  width: '250px', minWidth: '250px',
  background: 'linear-gradient(180deg, #0f0c08 0%, #1c1108 100%)',
  display: 'flex', flexDirection: 'column',
  height: '100vh', position: 'sticky', top: 0,
  borderRight: '1px solid rgba(249,115,22,0.1)',
};

export default function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/login'); };

  const pageTitles = { '/': 'Dashboard', '/products': 'Products', '/messages': 'Messages' };

  const Sidebar = () => (
    <div style={sidebar}>
      {/* Logo */}
      <div style={{ padding: '26px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '13px', flexShrink: 0,
            background: 'linear-gradient(135deg, #f97316, #c2410c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '800', fontSize: '19px', fontFamily: 'Georgia, serif',
            boxShadow: '0 4px 14px rgba(249,115,22,0.45)',
          }}>N</div>
          <div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '15px', fontFamily: 'Georgia, serif' }}>Naattukoli</div>
            <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: '10px', letterSpacing: '0.1em', marginTop: '1px' }}>ADMIN PORTAL</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', padding: '10px 12px 6px' }}>
          Menu
        </div>
        {navItems.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '11px',
              padding: '10px 13px', borderRadius: '10px',
              textDecoration: 'none', transition: 'all 0.15s',
              background: isActive ? 'rgba(249,115,22,0.16)' : 'transparent',
              border: `1px solid ${isActive ? 'rgba(249,115,22,0.35)' : 'transparent'}`,
              color: isActive ? '#fb923c' : 'rgba(255,255,255,0.45)',
            })}>
            <span style={{
              width: '32px', height: '32px', borderRadius: '8px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              background: 'rgba(255,255,255,0.05)',
            }}>
              {NAV_ICONS[to]}
            </span>
            <span style={{ fontWeight: '600', fontSize: '13.5px' }}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Admin footer */}
      <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', marginBottom: '8px' }}>
          <div style={{
            width: '33px', height: '33px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #f97316, #b91c1c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '700', fontSize: '12px',
          }}>
            {admin?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: 'rgba(255,255,255,0.82)', fontSize: '12.5px', fontWeight: '600' }}>{admin?.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{admin?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
            padding: '9px', borderRadius: '9px', cursor: 'pointer', fontWeight: '600', fontSize: '12.5px',
            border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: '#f87171',
          }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f0ea' }}>
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 40, backdropFilter: 'blur(3px)' }}
          onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <div className="d-sidebar"><Sidebar /></div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div style={{ position: 'fixed', left: 0, top: 0, zIndex: 50, height: '100vh', boxShadow: '6px 0 40px rgba(0,0,0,0.6)' }}>
          <Sidebar />
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header style={{
          height: '62px', padding: '0 28px', background: 'white',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}
              style={{ padding: '7px', borderRadius: '8px', border: 'none', background: '#f5ede3', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span style={{ fontSize: '17px', fontWeight: '700', color: '#1a0e04', fontFamily: 'Georgia, serif', letterSpacing: '-0.01em' }}>
              {pageTitles[location.pathname] || 'Admin'}
            </span>
          </div>
         
        </header>

        <main style={{ flex: 1, padding: '28px 28px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .d-sidebar { display: flex; }
        .mobile-menu-btn { display: none; }
        .admin-name { display: block; }
        @media (max-width: 1023px) {
          .d-sidebar { display: none; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 640px) {
          .admin-name { display: none !important; }
        }
      `}</style>
    </div>
  );
}