import React, { useState, useEffect, useCallback } from 'react';
import API from '../utils/api';
import ProductForm from '../components/ProductForm';

const c = { amber: '#f97316', dark: '#1a0e04', muted: '#a16207', light: '#fef7f0' };

const Btn = ({ onClick, variant = 'ghost', children, disabled, style = {} }) => {
  const [hov, setHov] = useState(false);
  const base = { padding: '8px 14px', borderRadius: '8px', fontWeight: '600', fontSize: '12.5px', cursor: disabled ? 'not-allowed' : 'pointer', border: 'none', transition: 'all 0.15s', opacity: disabled ? 0.6 : 1, ...style };
  const variants = {
    primary: { background: hov ? '#ea580c' : c.amber, color: 'white', boxShadow: hov ? `0 4px 14px ${c.amber}50` : `0 2px 8px ${c.amber}30` },
    danger: { background: hov ? '#fee2e2' : '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
    ghost: { background: hov ? '#f5ede3' : '#fef7f0', color: c.muted, border: '1px solid rgba(249,115,22,0.15)' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
};

// ── Eye Icon SVG ──
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// ── Product Details Modal ──
const ProductDetailsModal = ({ product: p, onClose, onEdit }) => {
  if (!p) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(4px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '480px', boxShadow: '0 32px 80px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'popIn 0.2s ease' }}
      >
        {/* Header image / top section */}
        <div style={{ position: 'relative', background: '#fef7f0', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          {p.image?.url ? (
            <img
              src={p.image.url}
              alt={p.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
              🐓
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: '12px', right: '12px', width: '34px', height: '34px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '700' }}
          >
            ✕
          </button>

          {/* Availability badge */}
          <span style={{
            position: 'absolute', bottom: '12px', left: '14px',
            fontSize: '11.5px', fontWeight: '700', padding: '4px 11px', borderRadius: '999px',
            background: p.availability === 'Available' ? '#dcfce7' : '#fee2e2',
            color: p.availability === 'Available' ? '#15803d' : '#dc2626',
          }}>
            {p.availability === 'Available' ? '● Available' : '● Out of Stock'}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 24px 24px' }}>
          {/* Name + type */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: c.dark, fontFamily: 'Georgia, serif' }}>
              {p.name}
            </h2>
            <span style={{ background: '#fef7f0', color: c.muted, fontSize: '11.5px', fontWeight: '700', padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(249,115,22,0.2)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {p.type}
            </span>
          </div>

          {p.description && (
            <p style={{ margin: '0 0 18px', color: '#9a7c6a', fontSize: '13.5px', lineHeight: '1.6' }}>
              {p.description}
            </p>
          )}

          {/* Detail grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Price', value: `₹${p.price} / ${p.priceUnit}` },
              { label: 'Stock', value: `${p.quantity} ${p.quantityUnit}` },
              p.weight && { label: 'Weight', value: p.weight },
              p.ageWeeks && { label: 'Age', value: `${p.ageWeeks} weeks` },
              p.breed && { label: 'Breed', value: p.breed },
              p.feedType && { label: 'Feed', value: p.feedType },
            ].filter(Boolean).map(({ label, value }) => (
              <div key={label} style={{ background: '#faf5ef', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: '700', color: '#b08050', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
                  {label}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: c.dark }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: '#f9f6f2', color: '#6b5545', fontWeight: '600', fontSize: '13.5px', cursor: 'pointer' }}
            >
              Close
            </button>
            <button
              onClick={onEdit}
              style={{ flex: 1, padding: '11px', borderRadius: '10px', border: 'none', background: c.amber, color: 'white', fontWeight: '700', fontSize: '13.5px', cursor: 'pointer' }}
            >
              ✏️ Edit Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [viewProduct, setViewProduct] = useState(null); // ← details modal

  const fetchProducts = useCallback(async () => {
    try { setLoading(true); const { data } = await API.get('/products'); setProducts(data.products || []); }
    catch { setError('Failed to load products'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async () => {
    setDeleting(true);
    try { await API.delete(`/products/${deleteId}`); setDeleteId(null); fetchProducts(); }
    catch { alert('Delete failed'); }
    finally { setDeleting(false); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.type.toLowerCase().includes(search.toLowerCase())
  );

  // Open edit from details modal
  const handleEditFromView = () => {
    setEditProduct(viewProduct);
    setViewProduct(null);
    setShowForm(true);
  };

  return (
    <div style={{ maxWidth: '1300px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: '800', color: c.dark, fontFamily: 'Georgia, serif' }}>Products</h1>
          <p style={{ margin: 0, color: '#9a7c6a', fontSize: '13.5px' }}>{products.length} items in your inventory</p>
        </div>
        <Btn variant="primary" onClick={() => { setEditProduct(null); setShowForm(true); }}
          style={{ padding: '10px 20px', fontSize: '13.5px', borderRadius: '10px' }}>
          + Add Product
        </Btn>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or type..."
          style={{ width: '100%', padding: '11px 14px 11px 38px', borderRadius: '10px', fontSize: '13.5px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', color: c.dark, outline: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', boxSizing: 'border-box' }} />
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={viewProduct}
        onClose={() => setViewProduct(null)}
        onEdit={handleEditFromView}
      />

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px', overflowY: 'auto', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'white', borderRadius: '18px', width: '100%', maxWidth: '540px', marginTop: '20px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fef7f0' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: c.dark, fontFamily: 'Georgia, serif' }}>
                  {editProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: c.muted }}>{editProduct ? 'Update product details' : 'Fill in the product information below'}</p>
              </div>
              <button onClick={() => { setShowForm(false); setEditProduct(null); }}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b5545', fontWeight: '700', fontSize: '14px' }}>
                ✕
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <ProductForm product={editProduct}
                onSuccess={() => { setShowForm(false); setEditProduct(null); fetchProducts(); }}
                onCancel={() => { setShowForm(false); setEditProduct(null); }} />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'white', borderRadius: '18px', padding: '32px', maxWidth: '360px', width: '100%', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '700', color: c.dark, fontFamily: 'Georgia, serif' }}>Delete Product?</h3>
            <p style={{ color: '#9a7c6a', fontSize: '13.5px', marginBottom: '24px', lineHeight: '1.5' }}>This action is permanent and cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteId(null)}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: '#f9f6f2', color: '#6b5545', fontWeight: '600', fontSize: '13.5px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#dc2626', color: 'white', fontWeight: '600', fontSize: '13.5px', cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div style={{ width: '38px', height: '38px', border: `3px solid ${c.amber}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}></div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#dc2626', background: 'white', borderRadius: '16px' }}>{error}</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🐓</div>
          <p style={{ color: '#6b5545', fontSize: '16px', fontWeight: '600', fontFamily: 'Georgia, serif', margin: '0 0 4px' }}>
            {search ? 'No results found' : 'No products yet'}
          </p>
          <p style={{ color: '#9a7c6a', fontSize: '13px', margin: '0 0 16px' }}>{search ? 'Try a different search term' : 'Add your first product to get started'}</p>
          {!search && <Btn variant="primary" onClick={() => { setEditProduct(null); setShowForm(true); }}>+ Add Product</Btn>}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }} className="d-table">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#faf5ef', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                  {['', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9a7c6a', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p._id}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef7f0'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px 14px 16px', width: '52px' }}>
                      <div style={{ width: '46px', height: '46px', borderRadius: '10px', overflow: 'hidden', background: '#f5ede3', flexShrink: 0 }}>
                        {p.image?.url
                          ? <img src={p.image.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🐓</div>}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '700', color: c.dark, fontSize: '13.5px' }}>{p.name}</div>
                      {p.description && <div style={{ color: '#9a7c6a', fontSize: '12px', marginTop: '2px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: '#fef7f0', color: c.muted, fontSize: '11.5px', fontWeight: '700', padding: '3px 9px', borderRadius: '999px', border: '1px solid rgba(249,115,22,0.2)' }}>
                        {p.type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: c.dark, fontSize: '14px', whiteSpace: 'nowrap' }}>
                      ₹{p.price} <span style={{ color: '#9a7c6a', fontWeight: '400', fontSize: '12px' }}>/{p.priceUnit}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#6b5545', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {p.quantity} <span style={{ color: '#9a7c6a' }}>{p.quantityUnit}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: '11.5px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px',
                        background: p.availability === 'Available' ? '#dcfce7' : '#fee2e2',
                        color: p.availability === 'Available' ? '#15803d' : '#dc2626',
                      }}>
                        {p.availability === 'Available' ? '● Available' : '● Out of Stock'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {/* 👁 View Details */}
                        <button
                          onClick={() => setViewProduct(p)}
                          title="View details"
                          style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(249,115,22,0.2)', background: '#fef7f0', color: c.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0 }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#fed7aa'; e.currentTarget.style.borderColor = c.amber; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fef7f0'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.2)'; }}
                        >
                          <EyeIcon />
                        </button>
                        <Btn variant="ghost" onClick={() => { setEditProduct(p); setShowForm(true); }}>✏️ Edit</Btn>
                        <Btn variant="danger" onClick={() => setDeleteId(p._id)}>Delete</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="m-cards" style={{ display: 'none', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(p => (
              <div key={p._id} style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                {/* Clickable thumbnail → view details */}
                <div
                  onClick={() => setViewProduct(p)}
                  style={{ width: '62px', height: '62px', borderRadius: '12px', overflow: 'hidden', background: '#f5ede3', flexShrink: 0, cursor: 'pointer', position: 'relative' }}
                >
                  {p.image?.url
                    ? <img src={p.image.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>🐓</div>}
                  {/* Eye overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                    <span
                      onClick={() => setViewProduct(p)}
                      style={{ fontWeight: '700', color: c.dark, fontSize: '14px', cursor: 'pointer' }}
                    >
                      {p.name}
                    </span>
                    <span style={{ fontSize: '10.5px', fontWeight: '700', padding: '3px 8px', borderRadius: '999px', flexShrink: 0, background: p.availability === 'Available' ? '#dcfce7' : '#fee2e2', color: p.availability === 'Available' ? '#15803d' : '#dc2626' }}>
                      {p.availability === 'Available' ? 'In Stock' : 'Out'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '12.5px', color: '#9a7c6a' }}>{p.type} · ₹{p.price}/{p.priceUnit} · {p.quantity} {p.quantityUnit}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setViewProduct(p)}
                      style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid rgba(249,115,22,0.2)', background: '#fef7f0', color: c.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '600' }}
                    >
                      <EyeIcon /> View
                    </button>
                    <Btn variant="ghost" onClick={() => { setEditProduct(p); setShowForm(true); }}>✏️ Edit</Btn>
                    <Btn variant="danger" onClick={() => setDeleteId(p._id)}>🗑️</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @media (max-width: 768px) { .d-table { display: none !important; } .m-cards { display: flex !important; } }
      `}</style>
    </div>
  );
}