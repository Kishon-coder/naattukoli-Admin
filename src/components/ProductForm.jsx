import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const UNITS = ['KG', 'Liter', 'Piece', 'Dozen'];
const DEFAULT_TYPES = ['Country Chicken', 'Eggs', 'Duck', 'Quail', 'Turkey', 'Other'];

const initForm = {
  name: '', price: '', priceUnit: 'KG', quantity: '', quantityUnit: 'KG',
  availability: 'Available', description: '', type: '', customType: ''
};

const s = {
  label: {
    display: 'block', marginBottom: '6px',
    fontSize: '11px', fontWeight: '700', color: '#78350f',
    textTransform: 'uppercase', letterSpacing: '0.07em',
    fontFamily: 'system-ui, sans-serif',
  },
  input: {
    width: '100%', padding: '10px 13px',
    border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '10px',
    fontSize: '13.5px', color: '#1a0e04', background: 'white',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'system-ui, sans-serif', transition: 'border-color 0.15s',
  },
  select: {
    width: '100%', padding: '10px 32px 10px 13px',
    border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '10px',
    fontSize: '13.5px', color: '#1a0e04', background: 'white',
    outline: 'none', cursor: 'pointer', boxSizing: 'border-box',
    fontFamily: 'system-ui, sans-serif', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a16207' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
  },
  group: { marginBottom: '14px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' },
  divider: {
    display: 'flex', alignItems: 'center', gap: '10px',
    margin: '16px 0 14px',
    fontSize: '10px', fontWeight: '700', color: '#c8a98a',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    fontFamily: 'system-ui, sans-serif',
  },
};

export default function ProductForm({ product, onSuccess, onCancel }) {
  const [form, setForm] = useState(initForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const isCustomType = form.type === '__custom__';

  useEffect(() => {
    if (product) {
      const isDefault = DEFAULT_TYPES.includes(product.type);
      setForm({
        name: product.name || '',
        price: product.price || '',
        priceUnit: product.priceUnit || 'KG',
        quantity: product.quantity || '',
        quantityUnit: product.quantityUnit || 'KG',
        availability: product.availability || 'Available',
        description: product.description || '',
        type: isDefault ? product.type : '__custom__',
        customType: isDefault ? '' : (product.type || ''),
      });
      if (product.image?.url) setImagePreview(product.image.url);
    }
  }, [product]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const finalType = isCustomType ? form.customType : form.type;
    if (!finalType) { setError('Please select or enter a product type'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries({ name: form.name, price: form.price, priceUnit: form.priceUnit,
        quantity: form.quantity, quantityUnit: form.quantityUnit,
        availability: form.availability, description: form.description, type: finalType,
      }).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      const opts = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (product) await API.put(`/products/${product._id}`, fd, opts);
      else await API.post('/products', fd, opts);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally { setLoading(false); }
  };

  const focusStyle = (name) => focusedField === name
    ? { borderColor: '#f97316', boxShadow: '0 0 0 3px rgba(249,115,22,0.12)' } : {};

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Image Upload */}
      <div style={s.group}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          {/* Preview */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '12px', flexShrink: 0,
            overflow: 'hidden', background: '#f5ede3',
            border: '2px solid rgba(249,115,22,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {imagePreview
              ? <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '26px' }}>🐓</span>}
          </div>
          {/* Upload zone */}
          <label style={{ flex: 1, cursor: 'pointer' }}>
            <div style={{
              border: '2px dashed rgba(249,115,22,0.3)', borderRadius: '10px',
              padding: '12px', textAlign: 'center', background: '#fef7f0',
              transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>📸</div>
              <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#78350f' }}>
                {imageFile ? imageFile.name : 'Click to upload image'}
              </div>
              <div style={{ fontSize: '11px', color: '#c8a98a', marginTop: '2px' }}>JPG, PNG, WEBP · up to 5MB</div>
            </div>
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Divider */}
      <div style={s.divider}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.07)' }} />
        <span>Product Details</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.07)' }} />
      </div>

      {/* Name */}
      <div style={s.group}>
        <label style={s.label}>Product Name *</label>
        <input name="name" value={form.name} onChange={handleChange} required
          placeholder="e.g. Country Chicken (Whole)"
          style={{ ...s.input, ...focusStyle('name') }}
          onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField('')} />
      </div>

      {/* Type */}
      <div style={s.group}>
        <label style={s.label}>Type / Category *</label>
        <select name="type" value={form.type} onChange={handleChange}
          style={{ ...s.select, ...focusStyle('type') }}
          onFocus={() => setFocusedField('type')} onBlur={() => setFocusedField('')}>
          <option value="">Select Type</option>
          {DEFAULT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          <option value="__custom__">+ Custom Type</option>
        </select>
        {isCustomType && (
          <input name="customType" value={form.customType} onChange={handleChange}
            placeholder="Enter custom type"
            style={{ ...s.input, marginTop: '8px', ...focusStyle('customType') }}
            onFocus={() => setFocusedField('customType')} onBlur={() => setFocusedField('')} />
        )}
      </div>

      {/* Divider */}
      <div style={s.divider}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.07)' }} />
        <span>Pricing & Stock</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.07)' }} />
      </div>

      {/* Price row */}
      <div style={s.row}>
        <div>
          <label style={s.label}>Price (₹) *</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} required min="0"
            placeholder="e.g. 450"
            style={{ ...s.input, ...focusStyle('price') }}
            onFocus={() => setFocusedField('price')} onBlur={() => setFocusedField('')} />
        </div>
        <div>
          <label style={s.label}>Per Unit</label>
          <select name="priceUnit" value={form.priceUnit} onChange={handleChange} style={s.select}>
            {UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Quantity row */}
      <div style={s.row}>
        <div>
          <label style={s.label}>Quantity *</label>
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required min="0"
            placeholder="e.g. 50"
            style={{ ...s.input, ...focusStyle('quantity') }}
            onFocus={() => setFocusedField('quantity')} onBlur={() => setFocusedField('')} />
        </div>
        <div>
          <label style={s.label}>Unit</label>
          <select name="quantityUnit" value={form.quantityUnit} onChange={handleChange} style={s.select}>
            {UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Availability */}
      <div style={s.group}>
        <label style={s.label}>Availability</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {['Available', 'Out of Stock'].map(opt => {
            const isActive = form.availability === opt;
            const isGreen = opt === 'Available';
            return (
              <button key={opt} type="button"
                onClick={() => setForm(p => ({ ...p, availability: opt }))}
                style={{
                  padding: '10px', borderRadius: '10px', cursor: 'pointer',
                  fontWeight: '700', fontSize: '13px', transition: 'all 0.15s',
                  border: `2px solid ${isActive ? (isGreen ? '#16a34a' : '#dc2626') : 'rgba(0,0,0,0.08)'}`,
                  background: isActive ? (isGreen ? '#dcfce7' : '#fee2e2') : '#f9f6f2',
                  color: isActive ? (isGreen ? '#15803d' : '#dc2626') : '#9a7c6a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                {isGreen ? '✓' : '✕'} {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div style={s.group}>
        <label style={s.label}>Description <span style={{ color: '#c8a98a', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3}
          placeholder="Brief product description..."
          style={{ ...s.input, resize: 'vertical', minHeight: '75px', ...focusStyle('desc') }}
          onFocus={() => setFocusedField('desc')} onBlur={() => setFocusedField('')} />
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', color: '#dc2626', fontSize: '13px', fontWeight: '600' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
        <button type="button" onClick={onCancel} style={{
          flex: 1, padding: '11px', borderRadius: '10px',
          border: '1.5px solid rgba(0,0,0,0.1)', background: '#f9f6f2',
          color: '#6b5545', fontWeight: '700', fontSize: '13.5px', cursor: 'pointer',
          fontFamily: 'system-ui, sans-serif',
        }}>
          Cancel
        </button>
        <button type="submit" disabled={loading} style={{
          flex: 2, padding: '11px', borderRadius: '10px', border: 'none',
          background: loading ? '#fdba74' : 'linear-gradient(135deg, #f97316, #ea580c)',
          color: 'white', fontWeight: '700', fontSize: '13.5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
          fontFamily: 'system-ui, sans-serif', transition: 'all 0.15s',
        }}>
          {loading ? 'Saving...' : product ? '💾 Update Product' : '➕ Add Product'}
        </button>
      </div>
    </form>
  );
}