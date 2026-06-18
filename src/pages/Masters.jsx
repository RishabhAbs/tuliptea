import React, { useState } from 'react';
import { Plus, Trash2, Tag, UserCheck, AlertCircle, BookOpen, Pencil, Check, X, Star, MapPin, ChevronRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MASTERS = [
  { key: 'brand',    label: 'Mark Master',     icon: Tag,       desc: 'Manage marks' },
  { key: 'agent',    label: 'Agent Master',    icon: UserCheck, desc: 'Manage agents' },
  { key: 'grade',    label: 'Grade Master',    icon: Star,      desc: 'Manage tea grades' },
  { key: 'location', label: 'Location Master', icon: MapPin,    desc: 'Manage locations' },
];

function MasterSection({ title, icon: Icon, items, onAdd, onUpdate, onDelete, placeholder }) {
  const [input, setInput]     = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [editId, setEditId]   = useState(null);
  const [editVal, setEditVal] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const handleAdd = async () => {
    if (!input.trim()) return setError(`${title} name is required`);
    setLoading(true);
    setError('');
    try {
      await onAdd(input.trim());
      setInput('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => { setEditId(item.id); setEditVal(item.name); };
  const cancelEdit = () => { setEditId(null); setEditVal(''); };

  const handleUpdate = async (id) => {
    if (!editVal.trim()) return;
    setEditLoading(true);
    try {
      await onUpdate(id, editVal.trim());
      setEditId(null);
    } catch (err) {
      // keep edit open on error
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div>
      {/* Compact add row */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 10 }}>
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder={placeholder}
          style={{
            flex: 1, background: '#f5f5f5',
            border: `1.5px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(240,68,56,0.22)'}`,
            borderRadius: 11, padding: '9px 12px',
            color: 'var(--tx-100)', fontSize: 13, fontFamily: 'inherit', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(240,68,56,0.55)'}
          onBlur={e  => e.target.style.borderColor = error ? 'rgba(248,113,113,0.5)' : 'rgba(240,68,56,0.22)'}
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            background: 'linear-gradient(135deg, #F04438, #dc2626)',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(240,68,56,0.28)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Plus size={17} color="white" strokeWidth={2.5} />
        </button>
      </div>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <AlertCircle size={11} color="#f87171" />
          <span style={{ fontSize: 11.5, color: '#f87171' }}>{error}</span>
        </div>
      )}

      {/* Count label */}
      <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--tx-500)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 7 }}>
        {items.length} {title}{items.length !== 1 ? 's' : ''} Added
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '22px 16px', textAlign: 'center', background: '#f9f9f9', border: '1px dashed rgba(0,0,0,0.12)', borderRadius: 13 }}>
          <Icon size={22} color="rgba(240,68,56,0.25)" strokeWidth={1.5} style={{ marginBottom: 6 }} />
          <div style={{ fontSize: 12.5, color: 'var(--tx-700)' }}>No {title.toLowerCase()}s added yet</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((item, i) => {
            const isEditing = editId === item.id;
            return (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center',
                padding: '8px 10px',
                background: '#ffffff',
                border: `1px solid ${isEditing ? 'rgba(240,68,56,0.35)' : 'rgba(240,68,56,0.1)'}`,
                borderRadius: 11,
                animation: `fadeInUp 0.22s ${i * 0.04}s both`,
                gap: 8,
              }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, background: 'rgba(240,68,56,0.08)', border: '1px solid rgba(240,68,56,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={12} color="#F04438" />
                </div>

                {isEditing ? (
                  <input
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleUpdate(item.id); if (e.key === 'Escape') cancelEdit(); }}
                    autoFocus
                    style={{
                      flex: 1, background: '#f5f5f5',
                      border: '1.5px solid rgba(240,68,56,0.4)',
                      borderRadius: 7, padding: '4px 9px',
                      color: 'var(--tx-100)', fontSize: 13, fontFamily: 'inherit', outline: 'none',
                    }}
                  />
                ) : (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--tx-100)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--tx-700)', fontFamily: 'monospace' }}>{item.id}</div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  {isEditing ? (
                    <>
                      <button onClick={() => handleUpdate(item.id)} disabled={editLoading} style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(240,68,56,0.07)', border: '1px solid rgba(240,68,56,0.18)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={12} color="#F04438" />
                      </button>
                      <button onClick={cancelEdit} style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={12} color="var(--tx-500)" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(item)} style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(240,68,56,0.07)', border: '1px solid rgba(240,68,56,0.18)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Pencil size={12} color="#F04438" />
                      </button>
                      <button onClick={() => { if (window.confirm(`Delete "${item.name}"? This cannot be undone.`)) onDelete(item.id); }} style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={12} color="#f87171" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const MASTER_CONFIG = {
  brand:    { title: 'Mark',     icon: Tag,       placeholder: 'e.g. Darjeeling Gold', itemsKey: 'brands',    add: 'addBrand',    update: 'updateBrand',    del: 'deleteBrand'    },
  agent:    { title: 'Agent',    icon: UserCheck, placeholder: 'e.g. Sharma Traders',  itemsKey: 'agents',    add: 'addAgent',    update: 'updateAgent',    del: 'deleteAgent'    },
  grade:    { title: 'Grade',    icon: Star,      placeholder: 'e.g. A+',              itemsKey: 'grades',    add: 'addGrade',    update: 'updateGrade',    del: 'deleteGrade'    },
  location: { title: 'Location', icon: MapPin,    placeholder: 'e.g. Warehouse B',     itemsKey: 'locations', add: 'addLocation', update: 'updateLocation', del: 'deleteLocation' },
};

export default function Masters() {
  const ctx = useApp();
  const [selected, setSelected] = useState(null);

  if (selected) {
    const cfg = MASTER_CONFIG[selected];
    const master = MASTERS.find(m => m.key === selected);
    const Icon = cfg.icon;
    return (
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <button
            onClick={() => setSelected(null)}
            style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(240,68,56,0.08)', border: '1px solid rgba(240,68,56,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <ArrowLeft size={15} color="#F04438" />
          </button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--tx-100)', letterSpacing: '-0.02em' }}>{master.label}</div>
            <div style={{ fontSize: 11, color: 'var(--tx-500)' }}>{master.desc}</div>
          </div>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 18, padding: '14px 14px' }}>
          <MasterSection
            title={cfg.title} icon={cfg.icon}
            items={ctx[cfg.itemsKey]}
            onAdd={ctx[cfg.add]} onUpdate={ctx[cfg.update]} onDelete={ctx[cfg.del]}
            placeholder={cfg.placeholder}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(240,68,56,0.1)', border: '1px solid rgba(240,68,56,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={15} color="#F04438" />
        </div>
        <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--tx-100)', letterSpacing: '-0.02em' }}>Masters</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MASTERS.map(({ key, label, icon: Icon, desc }) => {
          const count = ctx[MASTER_CONFIG[key].itemsKey]?.length ?? 0;
          return (
            <div
              key={key}
              className="glass-panel glass-card-hover"
              onClick={() => setSelected(key)}
              style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, background: 'rgba(240,68,56,0.09)', border: '1px solid rgba(240,68,56,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color="#F04438" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx-100)' }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--tx-500)', marginTop: 2 }}>{desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ background: 'rgba(240,68,56,0.1)', color: '#F04438', padding: '3px 10px', borderRadius: 10, fontSize: 13, fontWeight: 800 }}>
                  {count}
                </div>
                <ChevronRight size={16} color="var(--tx-500)" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
