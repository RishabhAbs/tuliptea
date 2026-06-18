import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Leaf, LayoutDashboard, Layers, Users, Settings,
  LogOut, ChevronRight, Bell, Shield,
} from 'lucide-react';

const NAV = [
  {
    label: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',  path: '/dashboard' },
      { icon: Layers,          label: 'Batches',    path: '/batches' },
      { icon: Users,           label: 'Users',      path: '/users' },
    ],
  },
  {
    label: 'System',
    items: [
      { icon: Bell,     label: 'Notifications', path: '/notifications', disabled: true },
      { icon: Settings, label: 'Settings',      path: '/settings',      disabled: true },
    ],
  },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon clay-icon-gold">
          <Leaf size={22} color="#1a0a00" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--tx-100)' }}>
            Tulip Tea
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Shield size={9} color="#fbbf24" />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#fbbf24', letterSpacing: '0.07em' }}>
              ADMIN PORTAL
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV.map(section => (
          <div key={section.label}>
            <div className="nav-label">{section.label}</div>
            {section.items.map(({ icon: Icon, label, path, disabled }) => (
              <button
                key={path}
                className={`nav-item ${pathname === path ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && navigate(path)}
              >
                <Icon size={16} strokeWidth={pathname === path ? 2.5 : 2} />
                <span style={{ flex: 1 }}>{label}</span>
                {pathname === path && (
                  <ChevronRight size={13} style={{ opacity: 0.5 }} />
                )}
                {disabled && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                    background: 'rgba(255,190,11,0.1)',
                    border: '1px solid rgba(255,190,11,0.2)',
                    borderRadius: 5,
                    padding: '2px 5px',
                    color: 'var(--tx-700)',
                  }}>SOON</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {/* User Card */}
        <div className="sidebar-user-card">
          <div
            className="avatar"
            style={{ background: 'linear-gradient(145deg,#F04438,#b91c1c)', boxShadow: '0 3px 6px rgba(240,68,56,0.35)' }}
          >
            SA
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx-100)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Super Admin
            </div>
            <div style={{ fontSize: 11, color: 'var(--tx-500)', marginTop: 1 }}>admin@tuliptea.in</div>
          </div>
          <div
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFBE0B', flexShrink: 0, boxShadow: '0 0 6px rgba(255,190,11,0.7)' }}
          />
        </div>

        {/* Logout */}
        <button className="logout-btn" onClick={() => navigate('/login')}>
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
