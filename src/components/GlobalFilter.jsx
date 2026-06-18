import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function GlobalFilter({ size = 34 }) {
  const { globalFilter = { grade: 'All', date: 'All' }, setGlobalFilter } = useApp();
  const [open, setOpen] = useState(false);

  const isActive = globalFilter.grade !== 'All' || globalFilter.date !== 'All';

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: size, height: size, borderRadius: 10,
          background: isActive ? 'rgba(240,68,56,0.1)' : 'rgba(0,0,0,0.04)',
          border: isActive ? '1px solid rgba(240,68,56,0.3)' : '1px solid rgba(240,68,56,0.15)',
          cursor: 'pointer', color: isActive ? '#F04438' : 'var(--tx-500)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Filter size={size === 34 ? 15 : 17} />
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: size + 8, right: 0, width: 220,
            background: 'var(--bg-layer)', border: '1px solid rgba(240,68,56,0.2)',
            borderRadius: 14, padding: '14px', zIndex: 100,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            animation: 'fadeInUp 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx-100)' }}>Global Filters</span>
              {isActive && (
                <button
                  onClick={() => setGlobalFilter({ grade: 'All', date: 'All' })}
                  style={{ background: 'none', border: 'none', color: '#F04438', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                >
                  Clear
                </button>
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--tx-500)', fontWeight: 600, marginBottom: 6 }}>GRADE</div>
              <select
                value={globalFilter.grade}
                onChange={e => setGlobalFilter(prev => ({ ...prev, grade: e.target.value }))}
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.6)', border: '1px solid var(--red-border)',
                  color: 'var(--tx-100)', fontSize: 13, outline: 'none'
                }}
              >
                {['All', 'A+', 'A', 'B+', 'B', 'C'].map(g => <option key={g} value={g}>{g === 'All' ? 'All Grades' : `Grade ${g}`}</option>)}
              </select>
            </div>

            <div>
              <div style={{ fontSize: 11, color: 'var(--tx-500)', fontWeight: 600, marginBottom: 6 }}>TIME ADDED</div>
              <select
                value={globalFilter.date}
                onChange={e => setGlobalFilter(prev => ({ ...prev, date: e.target.value }))}
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.6)', border: '1px solid var(--red-border)',
                  color: 'var(--tx-100)', fontSize: 13, outline: 'none'
                }}
              >
                <option value="All">All Time</option>
                <option value="Today">Today</option>
                <option value="7D">Last 7 Days</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
