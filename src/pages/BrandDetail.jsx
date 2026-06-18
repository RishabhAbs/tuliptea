import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const gradeColor  = g => g === 'A+' ? '#FFBE0B' : g === 'A' ? '#fcd34d' : g === 'B+' ? '#f87171' : g === 'B' ? '#F04438' : 'var(--tx-500)';
const gradeBg     = g => g === 'A+' ? 'rgba(255,190,11,0.12)' : g === 'A' ? 'rgba(252,211,77,0.1)' : g === 'B+' ? 'rgba(248,113,113,0.1)' : g === 'B' ? 'rgba(240,68,56,0.1)' : 'rgba(148,163,184,0.08)';
const gradeBorder = g => g === 'A+' ? 'rgba(255,190,11,0.35)' : g === 'A' ? 'rgba(252,211,77,0.25)' : g === 'B+' ? 'rgba(248,113,113,0.25)' : g === 'B' ? 'rgba(240,68,56,0.28)' : 'rgba(148,163,184,0.18)';

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--tx-500)' }}>
      <span>{label}</span>
      <span style={{ fontWeight: 700, color: 'var(--tx-100)' }}>{value}</span>
    </div>
  );
}

function BatchPopup({ b, agent, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 380,
          background: '#ffffff',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(240,68,56,0.18)',
          borderRadius: 22,
          overflow: 'hidden',
          animation: 'fadeInUp 0.18s both',
        }}
      >
        {/* Popup header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: gradeBg(b.grade), border: `1.5px solid ${gradeBorder(b.grade)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: gradeColor(b.grade) }}>{b.grade}</span>
            </div>
            <div>
              <div style={{ fontSize: 9.5, color: 'var(--tx-700)', fontWeight: 700, letterSpacing: '0.07em' }}>BATCH NO.</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--tx-100)', fontFamily: 'monospace' }}>{b.batchNo}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: b.status === 'pending' ? '#F04438' : '#fbbf24',
              background: b.status === 'pending' ? 'rgba(240,68,56,0.08)' : 'rgba(251,191,36,0.1)',
              border: `1px solid ${b.status === 'pending' ? 'rgba(240,68,56,0.2)' : 'rgba(251,191,36,0.25)'}`,
              borderRadius: 7, padding: '3px 8px',
            }}>
              {b.status === 'pending' ? 'Pending' : 'Sold'}
            </span>
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: 'rgba(148,163,184,0.12)', border: '1px solid rgba(148,163,184,0.22)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={13} color="var(--tx-500)" />
            </button>
          </div>
        </div>

        <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(240,68,56,0.12), transparent)', margin: '0 16px' }} />

        {/* Details */}
        <div style={{ padding: '12px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Row label="Total Kgs"  value={`${b.totalKgs} kg`} />
          {b.noOfBags  && <Row label="Bags"      value={`${b.noOfBags} × ${b.perBagWeight} kg`} />}
          {b.mfgDate   && <Row label="Mfg. Date" value={b.mfgDate} />}
          {agent       && <Row label="Agent"     value={agent.name} />}
          <Row label="Added By"   value={b.addedBy || '—'} />
          <Row label="Added On"   value={b.createdAt} />
          <div style={{ marginTop: 2 }}>
            <span style={{ fontSize: 10, color: 'var(--tx-700)', fontFamily: 'monospace', background: 'rgba(240,68,56,0.05)', border: '1px solid rgba(240,68,56,0.1)', borderRadius: 6, padding: '2px 8px' }}>{b.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrandDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { brands, batches, agents } = useApp();
  const pendingBatches = batches; // Use all batches for Detail view to show history
  const [selected, setSelected] = useState(null);

  const brand = brands.find(b => b.id === id);
  const brandBatches = pendingBatches.filter(b => b.brandId === id);
  const totalKgs = brandBatches.reduce((s, b) => s + Number(b.totalKgs || 0), 0);

  if (!brand) return (
    <div style={{ padding: '40px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 15, color: 'var(--tx-500)' }}>Mark not found</div>
      <button onClick={() => navigate('/brands')} style={{ marginTop: 16, fontSize: 13, color: '#F04438', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>← Back to Marks</button>
    </div>
  );

  return (
    <div style={{ padding: '12px 16px' }}>

      {/* Compact header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button
          onClick={() => navigate('/brands')}
          style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--tx-500)', fontSize: 12.5, fontWeight: 600, padding: 0 }}
        >
          <ArrowLeft size={13} /> Back to Marks
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 11.5, color: 'var(--tx-500)', background: 'rgba(240,68,56,0.07)', border: '1px solid rgba(240,68,56,0.14)', borderRadius: 7, padding: '2px 8px', fontWeight: 600 }}>
            {brandBatches.length} batch{brandBatches.length !== 1 ? 'es' : ''}
          </span>
          {totalKgs > 0 && (
            <span style={{ fontSize: 11.5, color: '#F04438', background: 'rgba(240,68,56,0.07)', border: '1px solid rgba(240,68,56,0.14)', borderRadius: 7, padding: '2px 8px', fontWeight: 700 }}>
              {totalKgs} kg
            </span>
          )}
        </div>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--tx-100)', letterSpacing: '-0.02em', marginBottom: 10 }}>{brand.name}</h2>

      {brandBatches.length === 0 ? (
        <div className="glass-panel" style={{ padding: '44px 24px', textAlign: 'center' }}>
          <Package size={32} color="rgba(240,68,56,0.25)" strokeWidth={1.5} style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 14, color: 'var(--tx-500)', fontWeight: 600 }}>No batches for this mark</div>
          <div style={{ fontSize: 12, color: 'var(--tx-700)', marginTop: 4 }}>Add a batch and select <strong>{brand.name}</strong></div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {brandBatches.map((b, i) => (
            <div
              key={b.id}
              onClick={() => setSelected(b)}
              className="glass-panel glass-card-hover"
              style={{ padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, animation: `fadeInUp 0.22s ${i * 0.05}s both` }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                background: gradeBg(b.grade), border: `1.5px solid ${gradeBorder(b.grade)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 12, fontWeight: 900, color: gradeColor(b.grade) }}>{b.grade}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--tx-100)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.batchNo}</div>
                <div style={{ fontSize: 11, color: 'var(--tx-500)', marginTop: 1 }}>
                  {b.totalKgs} kg · {b.createdAt}
                </div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, flexShrink: 0,
                color: b.status === 'pending' ? '#F04438' : '#fbbf24',
                background: b.status === 'pending' ? 'rgba(240,68,56,0.08)' : 'rgba(251,191,36,0.1)',
                border: `1px solid ${b.status === 'pending' ? 'rgba(240,68,56,0.2)' : 'rgba(251,191,36,0.25)'}`,
                borderRadius: 6, padding: '2px 7px',
              }}>
                {b.status === 'pending' ? 'Pending' : 'Sold'}
              </span>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <BatchPopup
          b={selected}
          agent={agents.find(a => a.id === selected.agentId)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
