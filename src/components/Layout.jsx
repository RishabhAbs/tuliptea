import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Layers, Users, Bell, LogOut, Shield, BookOpen } from 'lucide-react';
import GlobalFilter from './GlobalFilter';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen,        label: 'Masters',   path: '/masters' },
  { icon: Layers,          label: 'Batches',   path: '/batches' },
  { icon: Users,           label: 'Users',     path: '/users' },
];

export default function Layout() {
  const navigate   = useNavigate();
  const { pathname } = useLocation();

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
        position: 'sticky', top: 0, zIndex: 40,
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="ABS" style={{ height: 32, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--tx-100)', letterSpacing: '-0.01em' }}>
              Tulip Tea
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Shield size={8} color="#fbbf24" />
              <span style={{ fontSize: 9.5, fontWeight: 700, color: '#fbbf24', letterSpacing: '0.07em' }}>ADMIN PORTAL</span>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Notification */}
          <div style={{ position: 'relative' }}>
            <button style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.08)',
              cursor: 'pointer', color: 'var(--tx-500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bell size={14} />
            </button>
            <div style={{
              position: 'absolute', top: 6, right: 6,
              width: 7, height: 7, borderRadius: '50%',
              background: '#FFBE0B', boxShadow: '0 0 8px rgba(255,190,11,0.7)',
              border: '1.5px solid #FFF8F0',
            }} />
          </div>

          <GlobalFilter size={34} />

          {/* Admin Avatar */}
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(145deg,#F04438,#b91c1c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 12, color: 'white',
            boxShadow: '0 3px 8px rgba(240,68,56,0.35)',
          }}>SA</div>

          {/* Logout */}
          <button
            onClick={() => navigate('/admin/login')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(248,113,113,0.07)',
              border: '1px solid rgba(248,113,113,0.14)',
              color: 'rgba(248,113,113,0.75)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
            title="Sign Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Page Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        height: 64,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        zIndex: 50, padding: '0 8px',
      }}>
        {NAV.map(({ icon: Icon, label, path }) => {
          const active = pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '8px 4px',
                background: active ? 'rgba(240,68,56,0.1)' : 'none',
                border: active ? '1px solid rgba(240,68,56,0.2)' : '1px solid transparent',
                borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.18s', margin: '0 3px',
              }}
            >
              <Icon size={19} color={active ? '#F04438' : 'var(--tx-500)'} strokeWidth={active ? 2.5 : 2} />
              <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.04em', color: active ? '#F04438' : 'var(--tx-500)' }}>
                {label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
