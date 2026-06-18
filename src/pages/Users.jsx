import React, { useState } from 'react';
import { Search, Users as UsersIcon, UserPlus, Mail, Phone, MapPin, Layers, Calendar } from 'lucide-react';

export default function Users() {
  const [search, setSearch] = useState('');

  return (
    <div style={{ padding: '12px 14px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--tx-100)', letterSpacing: '-0.02em' }}>Users</h2>
        <div style={{ background: 'rgba(240,68,56,0.1)', color: '#b91c1c', padding: '3px 9px', borderRadius: 10, fontSize: 11.5, fontWeight: 800 }}>
          0 Users
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap" style={{ marginBottom: 12, width: '100%' }}>
        <Search size={13} className="search-icon" />
        <input
          className="search-input"
          style={{ width: '100%' }}
          placeholder="Search users…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Empty state */}
      <div className="glass-panel" style={{ padding: '24px 20px', textAlign: 'center', marginBottom: 10 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 15, margin: '0 auto 10px',
          background: 'rgba(240,68,56,0.07)', border: '1px solid rgba(240,68,56,0.14)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <UsersIcon size={22} color="rgba(240,68,56,0.35)" strokeWidth={1.5} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx-500)', marginBottom: 4 }}>No Users Registered</div>
        <div style={{ fontSize: 12, color: 'var(--tx-700)', lineHeight: 1.5, marginBottom: 12 }}>
          Employee accounts will appear here once added.
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,190,11,0.08)', border: '1px solid rgba(255,190,11,0.18)',
          borderRadius: 10, padding: '7px 14px',
        }}>
          <UserPlus size={13} color="#FFBE0B" />
          <span style={{ fontSize: 12, color: 'var(--tx-300)', fontWeight: 600 }}>User management coming soon</span>
        </div>
      </div>

      {/* Info cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { icon: Mail,     label: 'Email Invites',      desc: 'Send invite links to new employees' },
          { icon: Phone,    label: 'Phone Verification',  desc: 'Verify employee phone numbers' },
          { icon: Layers,   label: 'Batch Assignment',    desc: 'Assign employees to batches' },
          { icon: Calendar, label: 'Activity Logs',       desc: 'Track employee activity and logins' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="glass-panel" style={{ padding: '8px 11px', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.6 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: 'rgba(240,68,56,0.06)', border: '1px solid rgba(240,68,56,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={13} color="var(--tx-500)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--tx-500)' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--tx-700)', marginTop: 1 }}>{item.desc}</div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--tx-700)', background: 'rgba(255,190,11,0.08)', border: '1px solid rgba(255,190,11,0.18)', borderRadius: 5, padding: '2px 6px', flexShrink: 0 }}>SOON</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
