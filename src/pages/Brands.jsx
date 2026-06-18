import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ArrowRight, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Brands() {
  const navigate = useNavigate();
  const { brands, batches } = useApp();
  const pendingBatches = batches; // Use all batches for the summary counts in Brands list
  const [search, setSearch] = useState('');

  const filtered = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '20px 16px' }}>
      {/* Header row with search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--tx-100)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Marks</h2>
          <p style={{ fontSize: 12, color: 'var(--tx-500)', marginTop: 1 }}>{brands.length} mark{brands.length !== 1 ? 's' : ''} registered</p>
        </div>
        {brands.length > 0 && (
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#f5f5f5',
                border: '1.5px solid rgba(240,68,56,0.2)',
                borderRadius: 12, padding: '8px 32px 8px 12px',
                color: 'var(--tx-100)', fontSize: 13, fontFamily: 'inherit', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(240,68,56,0.5)'}
              onBlur={e  => e.target.style.borderColor = 'rgba(240,68,56,0.2)'}
            />
            <Search size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx-500)', pointerEvents: 'none' }} />
          </div>
        )}
      </div>

      {brands.length === 0 ? (
        <div className="glass-panel" style={{ padding: '52px 24px', textAlign: 'center' }}>
          <div style={{ width: 68, height: 68, borderRadius: 22, margin: '0 auto 18px', background: 'rgba(240,68,56,0.07)', border: '1px solid rgba(240,68,56,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={28} color="rgba(240,68,56,0.35)" strokeWidth={1.5} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx-500)', marginBottom: 8 }}>No Marks Added</div>
          <div style={{ fontSize: 13, color: 'var(--tx-700)', lineHeight: 1.5, marginBottom: 20 }}>Add marks from the Masters section.</div>
          <button onClick={() => navigate('/masters')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(240,68,56,0.08)', border: '1px solid rgba(240,68,56,0.18)', borderRadius: 12, padding: '10px 18px', fontSize: 13, color: '#F04438', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Tag size={14} /> Go to Masters
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '28px 20px', textAlign: 'center' }}>
          <Search size={22} color="rgba(240,68,56,0.25)" strokeWidth={1.5} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 13, color: 'var(--tx-500)', fontWeight: 600 }}>No marks match "{search}"</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((brand, i) => {
            const count = pendingBatches.filter(b => b.brandId === brand.id).length;
            const kgs   = pendingBatches.filter(b => b.brandId === brand.id).reduce((s, b) => s + Number(b.totalKgs || 0), 0);
            return (
              <div
                key={brand.id}
                className="glass-panel glass-card-hover"
                style={{ padding: '11px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11, animation: `fadeInUp 0.2s ${i * 0.05}s both` }}
                onClick={() => navigate(`/brands/${brand.id}`)}
              >
                <div style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0, background: 'rgba(240,68,56,0.09)', border: '1px solid rgba(240,68,56,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Tag size={15} color="#F04438" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--tx-100)' }}>{brand.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--tx-500)', marginTop: 1 }}>
                    {count} batch{count !== 1 ? 'es' : ''}
                    {kgs > 0 && <span style={{ color: '#F04438', fontWeight: 600, marginLeft: 6 }}>{kgs} kg</span>}
                  </div>
                </div>
                <ArrowRight size={14} color="var(--tx-700)" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
