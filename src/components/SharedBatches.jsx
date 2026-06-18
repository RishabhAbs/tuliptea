import React, { useState } from 'react';
import {
  Plus, X, Package, ShoppingBag, Truck,
  ChevronDown, AlertCircle, CheckCircle, Scale, Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/* ─── Design tokens ─────────────────────────── */
const gradeColor = g => g === 'A+' ? '#FFBE0B' : g === 'A' ? '#fbbf24' : g === 'B+' ? '#F04438' : g === 'B' ? '#b91c1c' : 'var(--tx-500)';
const gradeGlow  = g => g === 'A+' ? 'rgba(255,190,11,0.4)'  : g === 'A' ? 'rgba(255,190,11,0.25)'  : g === 'B+' ? 'rgba(240,68,56,0.35)'   : g === 'B' ? 'rgba(185,28,28,0.35)'   : 'rgba(148,163,184,0.15)';
const gradeBg    = g => g === 'A+' ? 'rgba(255,190,11,0.1)'   : g === 'A' ? 'rgba(255,190,11,0.07)'  : g === 'B+' ? 'rgba(240,68,56,0.08)'   : g === 'B' ? 'rgba(185,28,28,0.08)'   : 'rgba(148,163,184,0.04)';
const gradeBorder= g => g === 'A+' ? 'rgba(255,190,11,0.25)'  : g === 'A' ? 'rgba(255,190,11,0.18)'  : g === 'B+' ? 'rgba(240,68,56,0.22)'   : g === 'B' ? 'rgba(185,28,28,0.2)'    : 'rgba(148,163,184,0.12)';
// Grades are now loaded from DB via context; this fallback is used only if context is empty
const FALLBACK_GRADES = ['A+', 'A', 'B+', 'B', 'C'];
const TABS = [
  { key: 'pending',    label: 'Pending',    icon: Package },
  { key: 'dispatched', label: 'Dispatched', icon: Truck },
  { key: 'sales',      label: 'Sales',      icon: ShoppingBag },
];

/* ─── Shared form components ────────────────── */
const FLabel = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx-500)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 7 }}>
    {children}
  </div>
);

const FInput = ({ ...props }) => (
  <input {...props} style={{
    width: '100%', background: '#f5f5f5',
    border: '1.5px solid rgba(240,68,56,0.22)', borderRadius: 14,
    padding: '13px 15px', color: 'var(--tx-100)',
    fontSize: 14, fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
    ...props.style,
  }}
    onFocus={e  => { e.target.style.borderColor = 'rgba(240,68,56,0.55)'; e.target.style.background = '#efefef'; }}
    onBlur={e   => { e.target.style.borderColor = 'rgba(240,68,56,0.22)'; e.target.style.background = '#f5f5f5'; }}
  />
);

const FSelect = ({ children, ...props }) => (
  <div style={{ position: 'relative' }}>
    <select {...props} style={{
      width: '100%', background: '#f5f5f5',
      border: '1.5px solid rgba(240,68,56,0.22)', borderRadius: 14,
      padding: '13px 40px 13px 15px', color: props.value ? 'var(--tx-100)' : 'var(--tx-500)',
      fontSize: 14, fontFamily: 'inherit', outline: 'none', appearance: 'none', cursor: 'pointer',
      transition: 'border-color 0.2s',
    }}
      onFocus={e => e.target.style.borderColor = 'rgba(240,68,56,0.55)'}
      onBlur={e  => e.target.style.borderColor = 'rgba(240,68,56,0.22)'}
    >
      {children}
    </select>
    <ChevronDown size={15} color="var(--tx-500)" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
  </div>
);

const FTextarea = ({ ...props }) => (
  <textarea {...props} rows={3} style={{
    width: '100%', background: '#f5f5f5',
    border: '1.5px solid rgba(240,68,56,0.22)', borderRadius: 14,
    padding: '13px 15px', color: 'var(--tx-100)',
    fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'none', lineHeight: 1.5,
    transition: 'border-color 0.2s, background 0.2s',
  }}
    onFocus={e  => { e.target.style.borderColor = 'rgba(240,68,56,0.55)'; e.target.style.background = '#efefef'; }}
    onBlur={e   => { e.target.style.borderColor = 'rgba(240,68,56,0.22)'; e.target.style.background = '#f5f5f5'; }}
  />
);

/* ─── Empty state ────────────────────────────── */
const Empty = ({ icon: Icon, title, hint }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 28px', textAlign: 'center' }}>
    <div style={{ width: 76, height: 76, borderRadius: 26, marginBottom: 20, background: 'rgba(240,68,56,0.06)', border: '1px solid rgba(240,68,56,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={32} color="rgba(240,68,56,0.35)" strokeWidth={1.5} />
    </div>
    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx-500)', marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: 13, color: 'var(--tx-700)', lineHeight: 1.6, maxWidth: 220 }}>{hint}</div>
  </div>
);

/* ─── Batch card (Pending tab) ───────────────── */
const BatchCard = ({ b, i }) => (
  <div style={{
    padding: '10px 12px', marginBottom: 6,
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.07)',
    borderRadius: 16,
    animation: `fadeInUp 0.3s ${i * 0.06}s both`,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
  }}>
    {/* Left: batch no + meta */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx-100)', letterSpacing: '-0.01em', marginBottom: 4 }}>{b.batchNo}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--tx-100)', fontWeight: 500 }}>
        <span>{b.totalKgs} kg</span>
      </div>
    </div>
    {/* Right: status + grade on same row, date below */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#F04438', background: 'rgba(240,68,56,0.08)', border: '1px solid rgba(240,68,56,0.18)', borderRadius: 7, padding: '2px 8px' }}>Pending</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: gradeColor(b.grade) }}>{b.grade}</span>
      </div>
      <span style={{ fontSize: 11, color: 'var(--tx-100)', fontWeight: 500 }}>{b.createdAt}</span>
    </div>
  </div>
);

/* ─── Sale card (Sales tab) ──────────────────── */
const SaleCard = ({ s, i }) => (
  <div style={{
    padding: '10px 12px', marginBottom: 6,
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.07)', borderRadius: 16,
    animation: `fadeInUp 0.3s ${i * 0.06}s both`,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
  }}>
    {/* Left: batch no + meta */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx-100)', marginBottom: 4 }}>{s.batchNo}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--tx-100)', fontWeight: 500, flexWrap: 'wrap' }}>
        <span>{s.partyName}</span>
        <span style={{ color: 'rgba(0,0,0,0.15)' }}>|</span>
        <span>{s.totalKgs} kg</span>
        <span style={{ color: 'rgba(0,0,0,0.15)' }}>|</span>
        <span>&#8377;{s.rate}/kg</span>
      </div>
      {(s.agentName || s.locationName) && (
        <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
          {s.agentName    && <span style={{ fontSize: 10.5, color: 'var(--tx-500)', background: 'rgba(0,0,0,0.04)', borderRadius: 5, padding: '1px 6px' }}>Agent: {s.agentName}</span>}
          {s.locationName && <span style={{ fontSize: 10.5, color: 'var(--tx-500)', background: 'rgba(0,0,0,0.04)', borderRadius: 5, padding: '1px 6px' }}>{s.locationName}</span>}
        </div>
      )}
      {s.remark && (
        <div style={{ marginTop: 5, padding: '4px 8px', background: 'rgba(0,0,0,0.03)', borderRadius: 7 }}>
          <span style={{ fontSize: 11.5, color: 'var(--tx-500)', fontStyle: 'italic' }}>"{s.remark}"</span>
        </div>
      )}
    </div>
    {/* Right: status + grade on same row, date below */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#FFBE0B', background: 'rgba(255,190,11,0.1)', border: '1px solid rgba(255,190,11,0.22)', borderRadius: 7, padding: '2px 8px' }}>Sale</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: gradeColor(s.grade) }}>{s.grade}</span>
      </div>
      <span style={{ fontSize: 11, color: 'var(--tx-500)', fontWeight: 500 }}>{s.createdAt}</span>
    </div>
  </div>
);

/* ─── Dispatched card (Dispatched tab) ───────── */
const DispatchedCard = ({ d, i }) => (
  <div style={{
    padding: '10px 12px', marginBottom: 6,
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.07)', borderRadius: 16,
    animation: `fadeInUp 0.3s ${i * 0.05}s both`,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
  }}>
    {/* Left: batch no + meta */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx-100)', marginBottom: 4 }}>{d.batchNo}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--tx-100)', fontWeight: 500, flexWrap: 'wrap' }}>
        <span>{d.totalKgs} kg</span>
        <span style={{ color: 'rgba(0,0,0,0.15)' }}>|</span>
        <span>&#8377;{d.rate}/kg</span>
        {d.partyName && <><span style={{ color: 'rgba(0,0,0,0.15)' }}>|</span><span>{d.partyName}</span></>}
      </div>
      {(d.agentName || d.locationName) && (
        <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
          {d.agentName    && <span style={{ fontSize: 10.5, color: 'var(--tx-500)', background: 'rgba(0,0,0,0.04)', borderRadius: 5, padding: '1px 6px' }}>Agent: {d.agentName}</span>}
          {d.locationName && <span style={{ fontSize: 10.5, color: 'var(--tx-500)', background: 'rgba(0,0,0,0.04)', borderRadius: 5, padding: '1px 6px' }}>{d.locationName}</span>}
        </div>
      )}
      {d.remark && (
        <div style={{ marginTop: 5, padding: '4px 8px', background: 'rgba(0,0,0,0.03)', borderRadius: 7 }}>
          <span style={{ fontSize: 11.5, color: 'var(--tx-500)', fontStyle: 'italic' }}>"{d.remark}"</span>
        </div>
      )}
    </div>
    {/* Right: status + grade on same row, date below */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#FFBE0B', background: 'rgba(255,190,11,0.1)', border: '1px solid rgba(255,190,11,0.22)', borderRadius: 7, padding: '2px 8px' }}>Dispatched</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: gradeColor(d.grade) }}>{d.grade}</span>
      </div>
      <span style={{ fontSize: 11, color: 'var(--tx-100)', fontWeight: 500 }}>{d.dispatchedAt}</span>
    </div>
  </div>
);

/* ─── Form: Add Pending Batch ────────────────── */
function PendingForm({ form, setForm, onSubmit, brands, grades }) {
  const [err, setErr] = useState('');

  const updateBags = (bags, perBag) => {
    const n = parseFloat(bags);
    const p = parseFloat(perBag);
    if (!isNaN(n) && !isNaN(p) && n > 0 && p > 0) {
      setForm(f => ({ ...f, totalKgs: String((n * p).toFixed(2)) }));
    }
  };

  const handleBags = e => {
    const val = e.target.value;
    setErr('');
    setForm(f => ({ ...f, noOfBags: val }));
    updateBags(val, form.perBagWeight);
  };

  const handlePerBag = e => {
    const val = e.target.value;
    setErr('');
    setForm(f => ({ ...f, perBagWeight: val }));
    updateBags(form.noOfBags, val);
  };

  const submit = () => {
    if (!form.batchNo?.trim()) return setErr('Batch number is required');
    if (!form.grade)           return setErr('Please select a grade');
    if (!form.totalKgs || isNaN(form.totalKgs) || Number(form.totalKgs) <= 0) return setErr('Enter a valid quantity in kgs');
    if (!form.brandId)         return setErr('Please select a mark');
    onSubmit();
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(240,68,56,0.1)', border: '1px solid rgba(240,68,56,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Package size={18} color="#F04438" />
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--tx-100)' }}>Add Pending Batch</div>
          <div style={{ fontSize: 12, color: 'var(--tx-500)' }}>Enter new batch details</div>
        </div>
      </div>

      {err && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(248,113,113,0.09)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 12, padding: '10px 14px', margin: '16px 0 4px' }}>
          <AlertCircle size={13} color="#f87171" /><span style={{ fontSize: 12.5, color: '#f87171' }}>{err}</span>
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        {/* Mark */}
        <div style={{ marginBottom: 8 }}>
          <FLabel>Mark *</FLabel>
          <FSelect value={form.brandId || ''} onChange={e => { setErr(''); setForm(f => ({ ...f, brandId: e.target.value })); }}>
            <option value="" disabled>Select mark</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </FSelect>
        </div>

        {/* Batch No + Grade */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div><FLabel>Batch No.</FLabel><FInput placeholder="e.g. BTH-001" value={form.batchNo || ''} onChange={e => { setErr(''); setForm(f => ({ ...f, batchNo: e.target.value })); }} /></div>
          <div><FLabel>Grade</FLabel>
            <FSelect value={form.grade || ''} onChange={e => { setErr(''); setForm(f => ({ ...f, grade: e.target.value })); }}>
              <option value="" disabled>Select grade</option>
              {(grades.length ? grades : FALLBACK_GRADES.map((g, i) => ({ id: String(i), name: g }))).map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
            </FSelect>
          </div>
        </div>

        {/* No. of Bags + Per Bag Weight */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div><FLabel>No. of Bags</FLabel><FInput type="number" min="1" placeholder="e.g. 10" value={form.noOfBags || ''} onChange={handleBags} /></div>
          <div><FLabel>Per Bag (kg)</FLabel><FInput type="number" min="0.01" step="0.01" placeholder="e.g. 15" value={form.perBagWeight || ''} onChange={handlePerBag} /></div>
        </div>

        {/* Total Kgs + Mfg. Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          <div>
            <FLabel>Total Kgs</FLabel>
            <div style={{
              background: '#f5f5f5', border: '1.5px solid rgba(240,68,56,0.15)',
              borderRadius: 14, padding: '13px 15px',
              fontSize: 14, fontWeight: 700, color: form.totalKgs ? 'var(--tx-100)' : 'var(--tx-700)',
              fontFamily: 'inherit',
            }}>
              {form.totalKgs ? `${form.totalKgs} kg` : '—'}
            </div>
          </div>
          <div>
            <FLabel>Mfg. Date</FLabel>
            <FInput
              type="date" placeholder="Manufacturing date"
              value={form.mfgDate || ''}
              onChange={e => setForm(f => ({ ...f, mfgDate: e.target.value }))}
              style={{ colorScheme: 'light' }}
            />
          </div>
        </div>
      </div>

      <button className="clay-btn" onClick={submit}><Package size={15} /> Add Batch</button>
    </>
  );
}

/* ─── Form: Dispatch (from pending batch) ────── */
function DispatchForm({ form, setForm, pendingBatches, onSubmit, onClose, locations, agents }) {
  const [err, setErr] = useState('');
  React.useEffect(() => {
    if (!form.locationId && locations.length > 0) {
      const factory = locations.find(l => l.name.toLowerCase() === 'factory') || locations[0];
      setForm(f => ({ ...f, locationId: factory.id }));
    }
  }, [locations]);
  const submit = () => {
    if (!form.batchId)                                              return setErr('Please select a batch');
    if (!form.rate || isNaN(form.rate) || Number(form.rate) <= 0)  return setErr('Enter a valid rate per kg');
    onSubmit();
  };
  if (pendingBatches.length === 0) return (
    <>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--tx-100)', marginBottom: 4 }}>Create Dispatch</div>
      <Empty icon={Package} title="No pending batches" hint="Add a batch from the Pending tab first" />
      <button onClick={onClose} style={{ width: '100%', padding: '13px', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(240,68,56,0.15)', borderRadius: 14, color: 'var(--tx-500)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
    </>
  );
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(255,190,11,0.1)', border: '1px solid rgba(255,190,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Truck size={18} color="#FFBE0B" />
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--tx-100)' }}>Create Dispatch</div>
          <div style={{ fontSize: 12, color: 'var(--tx-500)' }}>Dispatch a pending batch with rate</div>
        </div>
      </div>

      {err && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(248,113,113,0.09)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 12, padding: '10px 14px', margin: '16px 0 4px' }}>
          <AlertCircle size={13} color="#f87171" /><span style={{ fontSize: 12.5, color: '#f87171' }}>{err}</span>
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <div style={{ marginBottom: 8 }}><FLabel>Select Pending Batch</FLabel>
          <FSelect value={form.batchId || ''} onChange={e => { setErr(''); setForm(f => ({ ...f, batchId: e.target.value })); }}>
            <option value="" disabled>Choose a pending batch</option>
            {pendingBatches.map(b => <option key={b.id} value={b.id}>{b.batchNo} · Grade {b.grade} · {b.totalKgs} kg</option>)}
          </FSelect>
        </div>
        <div style={{ marginBottom: 8 }}><FLabel>Rate (₹ per kg)</FLabel><FInput type="number" min="0.01" step="0.01" placeholder="e.g. 250.00" value={form.rate || ''} onChange={e => { setErr(''); setForm(f => ({ ...f, rate: e.target.value })); }} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div>
            <FLabel>Agent</FLabel>
            <FSelect value={form.agentId || ''} onChange={e => setForm(f => ({ ...f, agentId: e.target.value }))}>
              <option value="">Select agent</option>
              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </FSelect>
          </div>
          <div>
            <FLabel>Location</FLabel>
            <FSelect value={form.locationId || ''} onChange={e => setForm(f => ({ ...f, locationId: e.target.value }))}>
              {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </FSelect>
          </div>
        </div>
        <div style={{ marginBottom: 8 }}><FLabel>Party</FLabel><FInput placeholder="Enter party name" value={form.partyName || ''} onChange={e => setForm(f => ({ ...f, partyName: e.target.value }))} /></div>
        <div style={{ marginBottom: 20 }}><FLabel>Remark (Optional)</FLabel><FTextarea placeholder="Dispatch notes…" value={form.remark || ''} onChange={e => setForm(f => ({ ...f, remark: e.target.value }))} /></div>
      </div>

      <button className="clay-btn-gold" onClick={submit}>
        <Truck size={15} /> Confirm Dispatch
      </button>

      <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,190,11,0.06)', border: '1px solid rgba(255,190,11,0.12)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
        <CheckCircle size={13} color="#FFBE0B" />
        <span style={{ fontSize: 12, color: 'rgba(255,190,11,0.8)' }}>Dispatched records are saved to the database</span>
      </div>
    </>
  );
}

/* ─── Form: Create Sale (from dispatched) ────── */
function SalesForm({ form, setForm, dispatched, onSubmit, onClose, locations, agents }) {
  const [err, setErr] = useState('');
  React.useEffect(() => {
    if (!form.locationId && locations.length > 0) {
      const factory = locations.find(l => l.name.toLowerCase() === 'factory') || locations[0];
      setForm(f => ({ ...f, locationId: factory.id }));
    }
  }, [locations]);
  const submit = () => {
    if (!form.dispatchedId)       return setErr('Please select a dispatched batch');
    if (!form.partyName?.trim())  return setErr('Party name is required');
    onSubmit();
  };
  if (dispatched.length === 0) return (
    <>
      <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--tx-100)', marginBottom: 4 }}>Create Sale</div>
      <Empty icon={Truck} title="No dispatched batches" hint="Dispatch a batch from the Dispatched tab first" />
      <button onClick={onClose} style={{ width: '100%', padding: '13px', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(240,68,56,0.15)', borderRadius: 14, color: 'var(--tx-500)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
    </>
  );
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingBag size={18} color="#fbbf24" />
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--tx-100)' }}>Create Sale</div>
          <div style={{ fontSize: 12, color: 'var(--tx-500)' }}>Link a dispatched batch to a buyer</div>
        </div>
      </div>

      {err && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(248,113,113,0.09)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 12, padding: '10px 14px', margin: '16px 0 4px' }}>
          <AlertCircle size={13} color="#f87171" /><span style={{ fontSize: 12.5, color: '#f87171' }}>{err}</span>
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <div style={{ marginBottom: 8 }}><FLabel>Select Dispatched Batch</FLabel>
          <FSelect value={form.dispatchedId || ''} onChange={e => {
            setErr('');
            const d = dispatched.find(x => x.id === e.target.value);
            setForm(f => ({
              ...f,
              dispatchedId: e.target.value,
              partyName:    d?.partyName  || f.partyName  || '',
              rate:         d?.rate       || f.rate       || '',
              agentId:      d?.agentId    || f.agentId    || '',
            }));
          }}>
            <option value="" disabled>Choose a dispatched batch</option>
            {dispatched.map(d => <option key={d.id} value={d.id}>{d.batchNo} · Grade {d.grade} · ₹{d.rate}/kg</option>)}
          </FSelect>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div><FLabel>Party Name</FLabel><FInput placeholder="Enter party name" value={form.partyName || ''} onChange={e => { setErr(''); setForm(f => ({ ...f, partyName: e.target.value })); }} /></div>
          <div><FLabel>Rate (₹ per kg)</FLabel><FInput type="number" min="0.01" step="0.01" placeholder="e.g. 250.00" value={form.rate || ''} onChange={e => setForm(f => ({ ...f, rate: e.target.value }))} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div>
            <FLabel>Agent</FLabel>
            <FSelect value={form.agentId || ''} onChange={e => setForm(f => ({ ...f, agentId: e.target.value }))}>
              <option value="">Select agent</option>
              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </FSelect>
          </div>
          <div>
            <FLabel>Location</FLabel>
            <FSelect value={form.locationId || ''} onChange={e => setForm(f => ({ ...f, locationId: e.target.value }))}>
              {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </FSelect>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}><FLabel>Remark (Optional)</FLabel><FTextarea placeholder="Any notes about this sale…" value={form.remark || ''} onChange={e => setForm(f => ({ ...f, remark: e.target.value }))} /></div>
      </div>

      <button className="clay-btn" onClick={submit}><ShoppingBag size={15} /> Create Sale</button>
    </>
  );
}

/* ─── Main component ─────────────────────────── */
export default function SharedBatches({ isAdmin }) {
  const { batches, addPendingBatch, sales, addSale, dispatched, dispatchBatch, globalFilter = { grade: 'All', date: 'All' }, loading, dbError, reloadAll, brands, agents, grades, locations } = useApp();
  const pendingBatches = batches.filter(b => b.status === 'pending');
  const [activeTab,  setActiveTab]  = useState('pending');
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState({});
  const [toast,      setToast]      = useState('');

  const factoryLocation = locations.find(l => l.name.toLowerCase() === 'factory') || locations[0];

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2600); };
  const openModal  = () => { setForm({ locationId: factoryLocation?.id || '' }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setForm({}); };

  const handleSubmit = async () => {
    try {
      if (activeTab === 'pending') {
        await addPendingBatch({ batchNo: form.batchNo.trim(), grade: form.grade, totalKgs: form.totalKgs, noOfBags: form.noOfBags || null, perBagWeight: form.perBagWeight || null, mfgDate: form.mfgDate || null, brandId: form.brandId || null });
        showToast('Batch added successfully!');
      } else if (activeTab === 'dispatched') {
        await dispatchBatch(form.batchId, form.rate, form.remark || '', form.locationId || null, form.agentId || null, form.partyName || '');
        showToast('Batch dispatched and logged!');
      } else {
        await addSale({ dispatchedId: form.dispatchedId, partyName: form.partyName.trim(), remark: form.remark, locationId: form.locationId || null, agentId: form.agentId || null, rate: form.rate || null });
        showToast('Sale created successfully!');
      }
      closeModal();
    } catch (err) {
      showToast('Error: ' + (err.message || 'Something went wrong'));
    }
  };

  const checkDate = (dateStr) => {
    if (globalFilter.date === 'All') return true;
    const addedDate = new Date(dateStr);
    const now = new Date();
    const diff = (now - addedDate) / (1000 * 60 * 60 * 24);
    if (globalFilter.date === 'Today') return diff <= 1;
    if (globalFilter.date === '7D') return diff <= 7;
    return true;
  };
  const filteredPending = pendingBatches.filter(b => (globalFilter.grade === 'All' || b.grade === globalFilter.grade) && checkDate(b.createdAt));
  const filteredSales = sales.filter(s => (globalFilter.grade === 'All' || s.grade === globalFilter.grade) && checkDate(s.createdAt));
  const filteredDispatched = dispatched.filter(d => checkDate(d.dispatchedAt));
  
  const counts = { pending: filteredPending.length, sales: filteredSales.length, dispatched: filteredDispatched.length };
  const totalKgs = pendingBatches.reduce((sum, b) => sum + Number(b.totalKgs || 0), 0);

  const TAB_ORDER = ['pending', 'dispatched', 'sales'];
  const touchStartX = React.useRef(null);
  const handleTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = e => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    const idx = TAB_ORDER.indexOf(activeTab);
    if (diff > 0 && idx < TAB_ORDER.length - 1) setActiveTab(TAB_ORDER[idx + 1]);
    if (diff < 0 && idx > 0) setActiveTab(TAB_ORDER[idx - 1]);
    touchStartX.current = null;
  };


  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 14 }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(240,68,56,0.15)', borderTop: '3px solid #F04438', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
      <span style={{ fontSize: 13, color: 'var(--tx-500)' }}>Loading from database…</span>
    </div>
  );

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* DB error banner */}
      {dbError && (
        <div style={{ margin: '12px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: 'rgba(248,113,113,0.09)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 14, padding: '11px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={15} color="#f87171" />
            <span style={{ fontSize: 13, color: '#f87171' }}>Server unreachable — start the API server (<span style={{ fontFamily: 'monospace' }}>cd server &amp;&amp; npm start</span>)</span>
          </div>
          <button onClick={reloadAll} style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 8, padding: '4px 10px', fontSize: 12, color: '#f87171', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, whiteSpace: 'nowrap' }}>Retry</button>
        </div>
      )}

      {/* Page heading */}
      <div style={{ padding: '12px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--tx-100)', letterSpacing: '-0.025em' }}>Batches</h2>
        <div style={{ background: 'rgba(240,68,56,0.1)', color: '#b91c1c', padding: '3px 9px', borderRadius: 10, fontSize: 12, fontWeight: 800 }}>
          {counts[activeTab] || 0} Records
        </div>
      </div>

      {/* Admin Summary row */}
      {isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, margin: '10px 16px 0' }}>
          {[
            { label: 'Batches',       value: pendingBatches.length, color: '#F04438' },
            { label: 'Pending Sales', value: sales.length,          color: '#fbbf24' },
            { label: 'Total Kgs',     value: `${totalKgs}`,         color: '#fcd34d' },
          ].map(s => (
            <div key={s.label} style={{ padding: '8px 6px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--tx-500)', marginTop: 2, fontWeight: 600, lineHeight: 1.2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab bar */}
      <div style={{ padding: '10px 16px 0' }}>
        <div style={{
          display: 'flex', background: 'rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 3, gap: 2,
        }}>
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '7px 4px',
                background: active ? 'rgba(240,68,56,0.12)' : 'none',
                border: active ? '1px solid rgba(240,68,56,0.25)' : '1px solid transparent',
                borderRadius: 11, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s', position: 'relative',
              }}>
                <Icon size={13} color={active ? '#F04438' : 'var(--tx-500)'} strokeWidth={active ? 2.5 : 2} />
                <span style={{ fontSize: 12, fontWeight: 700, color: active ? '#F04438' : 'var(--tx-500)', letterSpacing: '0.02em' }}>{label}</span>
                {counts[key] > 0 && (
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    minWidth: 15, height: 15, borderRadius: 8,
                    background: active ? '#F04438' : 'rgba(240,68,56,0.2)',
                    color: active ? '#fff' : '#F04438',
                    fontSize: 8.5, fontWeight: 900,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 3px',
                  }}>{counts[key]}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content — swipeable */}
      <div
        style={{ flex: 1, padding: '10px 16px 0' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeTab === 'pending' && (
          filteredPending.length === 0
            ? <Empty icon={Package} title="No Pending Batches" hint="Tap the + button to add your first batch" />
            : filteredPending.map((b, i) => <BatchCard key={b.id} b={b} i={i} />)
        )}

        {activeTab === 'sales' && (
          filteredSales.length === 0
            ? <Empty icon={ShoppingBag} title="No Sales Yet" hint="Tap + to create a sale from a dispatched batch" />
            : filteredSales.map((s, i) => <SaleCard key={s.id} s={s} i={i} />)
        )}

        {activeTab === 'dispatched' && (
          filteredDispatched.length === 0 ? (
            <div>
              <div style={{
                padding: '14px 16px', marginBottom: 8,
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20,
                textAlign: 'center',
              }}>
                <div style={{ width: 60, height: 60, borderRadius: 20, background: 'rgba(255,190,11,0.08)', border: '1px solid rgba(255,190,11,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <CheckCircle size={26} color="rgba(255,190,11,0.55)" strokeWidth={1.5} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx-500)', marginBottom: 6 }}>Dispatched Records</div>
                <div style={{ fontSize: 13, color: 'var(--tx-700)', lineHeight: 1.6 }}>All dispatched items are permanently logged to the database.</div>
                <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,190,11,0.07)', border: '1px solid rgba(255,190,11,0.15)', borderRadius: 99, padding: '7px 16px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFBE0B', boxShadow: '0 0 8px rgba(255,190,11,0.6)' }} />
                  <span style={{ fontSize: 12, color: '#FFBE0B', fontWeight: 600 }}>Tap + to dispatch a pending batch</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredDispatched.map((d, i) => <DispatchedCard key={d.id} d={d} i={i} />)}
            </div>
          )
        )}
      </div>

      {/* FAB */}
      <button
        onClick={openModal}
        style={{
          position: 'fixed', bottom: 76, right: 18,
          width: 58, height: 58, borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFBE0B, #f59e0b)',
          border: '1px solid rgba(255,255,255,0.4)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(245,158,11,0.35)',
          zIndex: 55,
          transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(245,158,11,0.45)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,158,11,0.35)'; }}
        onMouseDown={e => { e.currentTarget.style.transform = 'translateY(1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(245,158,11,0.2)'; }}
        onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(245,158,11,0.45)'; }}
      >
        <Plus size={28} color="#1a0a00" strokeWidth={2.5} />
      </button>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 148, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.1)', borderRadius: 16,
          padding: '12px 22px',
          display: 'flex', alignItems: 'center', gap: 9,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          zIndex: 200, whiteSpace: 'nowrap',
          animation: 'fadeInUp 0.3s ease',
        }}>
          <CheckCircle size={15} color="#F04438" />
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--tx-100)' }}>{toast}</span>
        </div>
      )}

      {/* Modal bottom sheet */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{
            width: '100%', maxWidth: 430,
            background: '#ffffff',
            backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
            borderRadius: '28px 28px 0 0',
            border: '1px solid rgba(0,0,0,0.09)', borderBottom: 'none',
            padding: '0 20px 44px',
            animation: 'slideUp 0.32s cubic-bezier(0.22,1,0.36,1)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 20px' }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(240,68,56,0.25)' }} />
            </div>

            <button onClick={closeModal} style={{
              position: 'absolute', top: 18, right: 18,
              background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(240,68,56,0.15)',
              borderRadius: 10, padding: 7, cursor: 'pointer', color: 'var(--tx-500)',
              display: 'flex', alignItems: 'center',
            }}>
              <X size={16} />
            </button>

            {activeTab === 'pending'    && <PendingForm   form={form} setForm={setForm} onSubmit={handleSubmit} brands={brands} grades={grades} />}
            {activeTab === 'dispatched' && <DispatchForm  form={form} setForm={setForm} pendingBatches={pendingBatches} onSubmit={handleSubmit} onClose={closeModal} locations={locations} agents={agents} />}
            {activeTab === 'sales'      && <SalesForm     form={form} setForm={setForm} dispatched={dispatched} onSubmit={handleSubmit} onClose={closeModal} locations={locations} agents={agents} />}
          </div>
        </div>
      )}
    </div>
  );
}
