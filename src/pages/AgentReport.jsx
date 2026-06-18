import React, { useState } from 'react';
import { ArrowLeft, User, Tag, Package, Truck, ShoppingBag, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const gradeColor  = g => g === 'A+' ? '#FFBE0B' : g === 'A' ? '#fbbf24' : g === 'B+' ? '#F04438' : g === 'B' ? '#b91c1c' : 'var(--tx-500)';
const gradeBg     = g => g === 'A+' ? 'rgba(255,190,11,0.1)' : g === 'A' ? 'rgba(255,190,11,0.07)' : g === 'B+' ? 'rgba(240,68,56,0.08)' : g === 'B' ? 'rgba(185,28,28,0.08)' : 'rgba(148,163,184,0.04)';
const gradeBorder = g => g === 'A+' ? 'rgba(255,190,11,0.25)' : g === 'A' ? 'rgba(255,190,11,0.18)' : g === 'B+' ? 'rgba(240,68,56,0.22)' : g === 'B' ? 'rgba(185,28,28,0.2)' : 'rgba(148,163,184,0.12)';

const TABS = [
  { key: 'pending',    label: 'Pending',    icon: Package },
  { key: 'dispatched', label: 'Dispatched', icon: Truck },
  { key: 'sales',      label: 'Sales',      icon: ShoppingBag },
];

function StatBox({ value, label, color }) {
  return (
    <div style={{ padding: '8px 6px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 17, fontWeight: 900, color, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--tx-500)', marginTop: 2, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function BackBtn({ onClick, label }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: 'var(--tx-500)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
      <ArrowLeft size={13} /> {label}
    </button>
  );
}

function TabBar({ active, setActive, counts }) {
  return (
    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 3, gap: 2, margin: '10px 14px 0' }}>
      {TABS.map(({ key, label, icon: Icon }) => {
        const on = active === key;
        return (
          <button key={key} onClick={() => setActive(key)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            padding: '7px 4px', position: 'relative',
            background: on ? 'rgba(240,68,56,0.12)' : 'none',
            border: on ? '1px solid rgba(240,68,56,0.25)' : '1px solid transparent',
            borderRadius: 11, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s',
          }}>
            <Icon size={12} color={on ? '#F04438' : 'var(--tx-500)'} strokeWidth={on ? 2.5 : 2} />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: on ? '#F04438' : 'var(--tx-500)' }}>{label}</span>
            {counts[key] > 0 && (
              <span style={{
                position: 'absolute', top: 3, right: 3,
                minWidth: 14, height: 14, borderRadius: 7,
                background: on ? '#F04438' : 'rgba(240,68,56,0.2)',
                color: on ? '#fff' : '#F04438',
                fontSize: 8, fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
              }}>{counts[key]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function BatchCard({ b, i }) {
  return (
    <div style={{
      padding: '10px 12px', marginBottom: 6, background: '#ffffff',
      border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      animation: `fadeInUp 0.25s ${i * 0.05}s both`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx-100)', marginBottom: 3 }}>{b.batchNo}</div>
        <div style={{ fontSize: 11.5, color: 'var(--tx-100)', fontWeight: 500 }}>{b.totalKgs} kg &nbsp;|&nbsp; {b.createdAt}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#F04438', background: 'rgba(240,68,56,0.08)', border: '1px solid rgba(240,68,56,0.18)', borderRadius: 6, padding: '2px 7px' }}>Pending</span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: gradeColor(b.grade) }}>{b.grade}</span>
      </div>
    </div>
  );
}

function DispatchCard({ d, i }) {
  return (
    <div style={{
      padding: '10px 12px', marginBottom: 6, background: '#ffffff',
      border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      animation: `fadeInUp 0.25s ${i * 0.05}s both`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx-100)', marginBottom: 3 }}>{d.batchNo}</div>
        <div style={{ fontSize: 11.5, color: 'var(--tx-100)', fontWeight: 500 }}>
          {d.totalKgs} kg &nbsp;|&nbsp; <span style={{ color: '#FFBE0B', fontWeight: 700 }}>&#8377;{d.rate}/kg</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#FFBE0B', background: 'rgba(255,190,11,0.1)', border: '1px solid rgba(255,190,11,0.22)', borderRadius: 6, padding: '2px 7px' }}>Dispatched</span>
        <span style={{ fontSize: 11, color: 'var(--tx-100)', fontWeight: 500 }}>{d.dispatchedAt}</span>
      </div>
    </div>
  );
}

function SaleCard({ s, i }) {
  return (
    <div style={{
      padding: '10px 12px', marginBottom: 6, background: '#ffffff',
      border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      animation: `fadeInUp 0.25s ${i * 0.05}s both`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx-100)', marginBottom: 3 }}>{s.batchNo}</div>
        <div style={{ fontSize: 11.5, color: 'var(--tx-100)', fontWeight: 500 }}>
          {s.partyName} &nbsp;|&nbsp; {s.totalKgs} kg &nbsp;|&nbsp; <span style={{ color: '#FFBE0B', fontWeight: 700 }}>&#8377;{s.rate}/kg</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#FFBE0B', background: 'rgba(255,190,11,0.1)', border: '1px solid rgba(255,190,11,0.22)', borderRadius: 6, padding: '2px 7px' }}>Sale</span>
        <span style={{ fontSize: 11, color: 'var(--tx-100)', fontWeight: 500 }}>{s.createdAt}</span>
      </div>
    </div>
  );
}

function ListCard({ icon: Icon, iconColor, iconBg, iconBorder, title, subtitle, onClick }) {
  return (
    <div className="glass-panel glass-card-hover" style={{ padding: '9px 11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={onClick}>
      <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: iconBg, border: `1px solid ${iconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={15} color={iconColor} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--tx-100)' }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--tx-500)', marginTop: 1 }}>{subtitle}</div>
      </div>
      <ChevronRight size={14} color="var(--tx-700)" />
    </div>
  );
}

export default function AgentReport() {
  const { agents, brands, batches, dispatched, sales } = useApp();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  // ── Level 2: agent detail with Pending/Dispatched/Sales tabs ─
  if (selectedAgent) {
    const agentBatches   = batches.filter(b => b.agentId === selectedAgent.id);
    const agentBatchIds  = agentBatches.map(b => b.id);
    const pendingBatches = agentBatches.filter(b => b.status === 'pending');
    const dispatchedList = dispatched.filter(d => agentBatchIds.includes(d.batchId));
    const dispatchedIds  = dispatchedList.map(d => d.id);
    const salesList      = sales.filter(s => agentBatchIds.includes(s.batchId) || dispatchedIds.includes(s.dispatchedId));
    const counts         = { pending: pendingBatches.length, dispatched: dispatchedList.length, sales: salesList.length };

    const empty = <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--tx-500)', fontSize: 13 }}>No records</div>;

    return (
      <div style={{ minHeight: '100%' }}>
        {/* Header */}
        <div style={{ padding: '12px 14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <BackBtn onClick={() => { setSelectedAgent(null); setActiveTab('pending'); }} label="Back to agents" />
        </div>
        <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,190,11,0.1)', border: '1px solid rgba(255,190,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={15} color="#FFBE0B" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--tx-100)', letterSpacing: '-0.02em' }}>{selectedAgent.name}</div>
        </div>

        {/* Stat boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, margin: '0 14px' }}>
          <StatBox value={pendingBatches.length} label="Pending"    color="#F04438" />
          <StatBox value={dispatchedList.length} label="Dispatched" color="#FFBE0B" />
          <StatBox value={salesList.length}       label="Sales"      color="#FFBE0B" />
        </div>

        {/* Tab bar */}
        <TabBar active={activeTab} setActive={setActiveTab} counts={counts} />

        {/* Tab content */}
        <div style={{ padding: '10px 14px 0' }}>
          {activeTab === 'pending'    && (pendingBatches.length === 0 ? empty : pendingBatches.map((b, i) => <BatchCard   key={b.id} b={b} i={i} />))}
          {activeTab === 'dispatched' && (dispatchedList.length === 0 ? empty : dispatchedList.map((d, i) => <DispatchCard key={d.id} d={d} i={i} />))}
          {activeTab === 'sales'      && (salesList.length      === 0 ? empty : salesList.map((s, i)      => <SaleCard    key={s.id} s={s} i={i} />))}
        </div>
      </div>
    );
  }

  // ── Level 1: all agents ──────────────────────────────────────
  const totalSales  = sales.length;
  const totalKgsAll = batches.filter(b => b.status === 'pending').reduce((s, b) => s + Number(b.totalKgs || 0), 0);

  return (
    <div style={{ minHeight: '100%' }}>
      <div style={{ padding: '12px 14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--tx-100)', letterSpacing: '-0.025em' }}>Agent Report</h2>
        <div style={{ background: 'rgba(240,68,56,0.1)', color: '#b91c1c', padding: '3px 9px', borderRadius: 10, fontSize: 11.5, fontWeight: 800 }}>{agents.length} Agents</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, margin: '0 14px 12px' }}>
        <StatBox value={agents.length}    label="Agents"      color="#F04438" />
        <StatBox value={totalSales}       label="Total Sales"  color="#FFBE0B" />
        <StatBox value={`${totalKgsAll}`} label="Total Kgs"   color="#FFBE0B" />
      </div>
      <div style={{ padding: '0 14px' }}>
        {agents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--tx-500)', fontSize: 13 }}>No agents found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {agents.map(agent => {
              const ab  = batches.filter(b => b.agentId === agent.id);
              const as_ = sales.filter(s => ab.map(b => b.id).includes(s.batchId));
              const kgs = ab.filter(b => b.status === 'pending').reduce((s, b) => s + Number(b.totalKgs || 0), 0);
              const brandCount = [...new Set(ab.map(b => b.brandId).filter(Boolean))].length;
              const sub = [
                `${ab.length} batch${ab.length !== 1 ? 'es' : ''}`,
                brandCount > 0 ? `${brandCount} mark${brandCount !== 1 ? 's' : ''}` : null,
                as_.length > 0 ? `${as_.length} sale${as_.length !== 1 ? 's' : ''}` : null,
                kgs > 0 ? `${kgs} kg` : null,
              ].filter(Boolean).join(' · ');
              return <ListCard key={agent.id} icon={User} iconColor="#FFBE0B" iconBg="rgba(255,190,11,0.1)" iconBorder="rgba(255,190,11,0.2)" title={agent.name} subtitle={sub} onClick={() => { setSelectedAgent(agent); setActiveTab('pending'); }} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
