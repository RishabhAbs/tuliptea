import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Users, TrendingUp, ArrowRight, Package, ShoppingBag, Tag, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const gradeColor = g => g === 'A+' ? '#FFBE0B' : g === 'A' ? '#fbbf24' : g === 'B+' ? '#F04438' : g === 'B' ? '#b91c1c' : 'var(--tx-500)';


function BrandsCard({ brands, pendingBatches, onNavigateBrands }) {
  const totalKgs = pendingBatches.reduce((s, b) => s + Number(b.totalKgs || 0), 0);
  return (
    <div
      className="glass-panel glass-card-hover"
      onClick={onNavigateBrands}
      style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 14, flexShrink: 0, background: 'rgba(240,68,56,0.09)', border: '1px solid rgba(240,68,56,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Tag size={19} color="#F04438" strokeWidth={2} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx-100)' }}>All Marks</div>
        <div style={{ fontSize: 12, color: 'var(--tx-500)', marginTop: 2 }}>
          {brands.length} mark{brands.length !== 1 ? 's' : ''}
          {totalKgs > 0 && <span style={{ color: '#F04438', fontWeight: 600, marginLeft: 8 }}>{totalKgs} kg total</span>}
        </div>
      </div>
      <div style={{ background: 'rgba(240,68,56,0.1)', color: '#F04438', padding: '3px 10px', borderRadius: 10, fontSize: 13, fontWeight: 800 }}>
        {brands.length}
      </div>
      <ArrowRight size={15} color="var(--tx-500)" />
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { batches, sales, brands, agents } = useApp();
  const pendingBatches = batches.filter(b => b.status === 'pending');
  const [activeStat, setActiveStat] = useState(null);

  const stats = [
    { label: 'Pending Batches', value: pendingBatches.length,  icon: Layers },
    { label: 'Pending Sales',   value: sales.length,           icon: ShoppingBag },
    { label: 'Total Kgs',       value: pendingBatches.reduce((s, b) => s + Number(b.totalKgs || 0), 0), icon: TrendingUp },
    { label: 'Mark Report',      value: brands.length,                                      icon: Tag, path: '/brand-report' },
  ];

  const renderActiveStatList = () => {
    if (activeStat === 'Pending Batches') {
      return pendingBatches.length ? pendingBatches.map(b => (
        <div key={b.id || b.batchNo} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx-100)', fontFamily: 'monospace' }}>{b.batchNo}</div>
            <div style={{ fontSize: 12, color: 'var(--tx-500)', marginTop: 2 }}>{b.totalKgs} kg · {b.createdAt}</div>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: gradeColor(b.grade) }}>{b.grade}</div>
        </div>
      )) : <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx-500)' }}>No pending batches.</div>;
    } else if (activeStat === 'Pending Sales') {
      return sales.length ? sales.map(s => (
        <div key={s.id} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx-100)' }}>{s.partyName}</div>
            <div style={{ fontSize: 12, color: 'var(--tx-500)', marginTop: 2 }}>{s.batchNo} · {s.totalKgs} kg</div>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: gradeColor(s.grade) }}>{s.grade}</div>
        </div>
      )) : <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx-500)' }}>No pending sales.</div>;
    } else if (activeStat === 'Total Kgs') {
      return pendingBatches.length ? pendingBatches.map(b => (
        <div key={b.id || b.batchNo} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx-100)', fontFamily: 'monospace' }}>{b.batchNo}</div>
            <div style={{ fontSize: 12, color: 'var(--tx-500)' }}>Grade {b.grade}</div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#F04438' }}>{b.totalKgs} kg</div>
        </div>
      )) : <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx-500)' }}>No pending batches.</div>;
    }
    return null;
  };

  return (
    <div style={{ padding: '20px 16px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--tx-100)', letterSpacing: '-0.02em' }}>Dashboard</h2>
          <p style={{ fontSize: 13, color: 'var(--tx-500)', marginTop: 3 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div style={{ background: 'rgba(240,68,56,0.1)', color: '#b91c1c', padding: '4px 10px', borderRadius: 12, fontSize: 13, fontWeight: 800 }}>
          {pendingBatches.length + sales.length} Items
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-panel glass-card-hover" style={{ padding: '12px 14px', cursor: 'pointer' }} onClick={() => s.path ? navigate(s.path) : setActiveStat(activeStat === s.label ? null : s.label)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(240,68,56,0.09)', border: '1px solid rgba(240,68,56,0.18)' }}>
                  <Icon size={15} color="#F04438" strokeWidth={2} />
                </div>
                <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--tx-100)', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--tx-500)', fontWeight: 500, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Brands Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
          Marks
        </div>

        <BrandsCard brands={brands} pendingBatches={pendingBatches} onNavigateBrands={() => navigate('/brands')} />
      </div>

      {/* Quick Access */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Quick Access</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: Layers, label: 'View All Batches', sub: `${pendingBatches.length} pending batches`,     path: '/batches'      },
            { icon: Users,  label: 'Manage Users',     sub: 'View employee details',                       path: '/users'        },
            { icon: Tag,    label: 'Mark Report',      sub: `${brands.length} mark${brands.length !== 1 ? 's' : ''}`, path: '/brand-report' },
            { icon: User,   label: 'Agent Report',     sub: `${agents.length} agent${agents.length !== 1 ? 's' : ''}`, path: '/agent-report' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.path} className="glass-panel glass-card-hover" style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }} onClick={() => navigate(item.path)}>
                <div style={{ width: 42, height: 42, borderRadius: 14, flexShrink: 0, background: 'rgba(240,68,56,0.09)', border: '1px solid rgba(240,68,56,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={19} color="#F04438" strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx-100)' }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--tx-500)', marginTop: 2 }}>{item.sub}</div>
                </div>
                <ArrowRight size={16} color="var(--tx-700)" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Stat Bottom Sheet */}
      {activeStat && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setActiveStat(null); }}
        >
          <div style={{
            width: '100%', maxWidth: 430, display: 'flex', flexDirection: 'column',
            background: '#ffffff',
            backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
            borderRadius: '28px 28px 0 0',
            border: '1px solid rgba(0,0,0,0.09)', borderBottom: 'none',
            padding: '0 0 20px',
            animation: 'slideUp 0.32s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 8px', flexShrink: 0 }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.12)' }} />
            </div>
            <div style={{ padding: '0 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--tx-100)' }}>{activeStat}</div>
              <button onClick={() => setActiveStat(null)} style={{ background: 'rgba(0,0,0,0.04)', border: 'none', borderRadius: 10, padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--tx-500)' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ overflowY: 'auto', padding: '16px 20px', maxHeight: 260, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {renderActiveStatList()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
