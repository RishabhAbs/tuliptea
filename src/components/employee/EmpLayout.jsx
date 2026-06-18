import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layers, LogOut, X, Mail, User, Briefcase, Calendar, Package, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlobalFilter from '../GlobalFilter';

const NAV = [
  { icon: Layers, label: 'Batches', path: '/employee/batches' },
];

export default function EmpLayout() {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const { employee, setEmployee, batches, sales } = useApp();
  const pendingBatches = batches; // Use all batches for profile stats to show history
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    setEmployee(null);
    navigate('/');
  };

  const emp = employee || { name: 'Employee', email: '—', initials: 'EM' };

  return (
    <div className="mob-screen" style={{ justifyContent: 'flex-start', padding: 0 }}>

      {/* Top Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        position: 'sticky', top: 0, zIndex: 40, flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="ABS" style={{ height: 32, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--tx-100)', letterSpacing: '-0.01em', lineHeight: 1.1 }}>Tulip Tea</div>
            <div style={{ fontSize: 10, color: 'var(--tx-500)', fontWeight: 600, letterSpacing: '0.04em' }}>EMPLOYEE PORTAL</div>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <GlobalFilter size={38} />

          {/* Profile avatar button */}
          <button
          onClick={() => setShowProfile(true)}
          style={{
            width: 38, height: 38, borderRadius: 13, flexShrink: 0,
            background: 'linear-gradient(145deg, rgba(255,190,11,0.18), rgba(217,119,6,0.1))',
            border: '1.5px solid rgba(255,190,11,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13, color: '#FFBE0B',
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(255,190,11,0.15)',
            transition: 'all 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,190,11,0.55)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(255,190,11,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,190,11,0.3)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,190,11,0.15)'; }}
        >
          {emp.initials}
          </button>
        </div>
      </header>

      {/* Page Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 72 }}>
        <Outlet />
      </div>

      {/* Bottom Nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, height: 60,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        zIndex: 50, padding: '0 20px',
      }}>
        {NAV.map(({ icon: Icon, label, path }) => {
          const active = pathname === path;
          return (
            <button key={path} onClick={() => navigate(path)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '7px 28px', borderRadius: 14,
              background: active ? 'rgba(240,68,56,0.1)' : 'none',
              border: active ? '1px solid rgba(240,68,56,0.2)' : '1px solid transparent',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s',
            }}>
              <Icon size={20} color={active ? '#F04438' : 'var(--tx-500)'} strokeWidth={active ? 2.5 : 2} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', color: active ? '#F04438' : 'var(--tx-500)' }}>
                {label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Profile Bottom Sheet */}
      {showProfile && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowProfile(false); }}
        >
          <div style={{
            width: '100%', maxWidth: 430,
            background: '#ffffff',
            backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
            borderRadius: '28px 28px 0 0',
            border: '1px solid rgba(0,0,0,0.09)', borderBottom: 'none',
            padding: '0 0 40px',
            animation: 'slideUp 0.32s cubic-bezier(0.22,1,0.36,1)',
          }}>
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 8px' }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.12)' }} />
            </div>

            {/* Close */}
            <button onClick={() => setShowProfile(false)} style={{
              position: 'absolute', top: 16, right: 18,
              background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 10, padding: '6px', cursor: 'pointer', color: 'var(--tx-500)',
              display: 'flex', alignItems: 'center',
            }}>
              <X size={16} />
            </button>

            {/* Avatar + name */}
            <div style={{ textAlign: 'center', padding: '20px 24px 24px' }}>
              <div style={{
                width: 72, height: 72, borderRadius: 24, margin: '0 auto 14px',
                background: 'linear-gradient(145deg, #FFBE0B, #d97706 50%, #b45309)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 900, color: '#1a0a00',
                boxShadow: '0 8px 0 #b45309, 0 12px 24px rgba(180,83,9,0.42), inset 0 2px 5px rgba(255,255,255,0.3)',
              }}>
                {emp.initials}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--tx-100)', letterSpacing: '-0.01em' }}>{emp.name}</div>
              <div style={{ fontSize: 13, color: 'var(--tx-500)', marginTop: 4 }}>{emp.email}</div>
              <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,190,11,0.08)', border: '1px solid rgba(255,190,11,0.2)', borderRadius: 99, padding: '4px 12px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFBE0B', boxShadow: '0 0 8px rgba(255,190,11,0.7)' }} />
                <span style={{ fontSize: 11.5, color: '#FFBE0B', fontWeight: 600 }}>Active</span>
              </div>
            </div>

            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(240,68,56,0.2), transparent)', margin: '0 20px' }} />

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '20px 20px 16px' }}>
              {[
                { label: 'Batches Added', value: pendingBatches.filter(b => b.addedBy === emp.name).length, color: '#F04438' },
                { label: 'Sales Created', value: sales.filter(s => s.addedBy === emp.name).length,          color: '#FFBE0B' },
                { label: 'Total Batches', value: pendingBatches.length,                                     color: '#fcd34d' },
              ].map(stat => (
                <div key={stat.label} style={{ background: 'rgba(240,68,56,0.04)', border: '1px solid rgba(240,68,56,0.1)', borderRadius: 14, padding: '14px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: stat.color, letterSpacing: '-0.02em' }}>{stat.value}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--tx-700)', marginTop: 3, fontWeight: 600, lineHeight: 1.3 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Info rows */}
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: User,      label: 'Role',       value: 'Batch Operator' },
                { icon: Briefcase, label: 'Department', value: 'Processing Unit' },
                { icon: Calendar,  label: 'Joined',     value: 'January 2024' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px',
                  background: 'rgba(240,68,56,0.03)',
                  border: '1px solid rgba(240,68,56,0.08)',
                  borderRadius: 12,
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(240,68,56,0.06)', border: '1px solid rgba(240,68,56,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color="var(--tx-300)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: 'var(--tx-700)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--tx-100)', fontWeight: 600, marginTop: 1 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Logout */}
            <div style={{ padding: '0 20px' }}>
              <button onClick={handleLogout} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                padding: '14px', background: 'rgba(240,68,56,0.07)',
                border: '1px solid rgba(240,68,56,0.2)', borderRadius: 16,
                color: '#F04438', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.18s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(240,68,56,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(240,68,56,0.07)'; }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
