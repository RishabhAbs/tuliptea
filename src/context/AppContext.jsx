import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = '/api';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

function genId(prefix) {
  return `${prefix}-${String(Date.now()).slice(-5)}`;
}

/* ── Database structure reference ─────────────────────────── */
export const DB_SCHEMA = {
  pending_batches: {
    fields: ['id', 'batchNo', 'grade', 'totalKgs', 'createdAt', 'addedBy'],
    description: 'Batches added awaiting dispatch',
  },
  dispatched: {
    fields: ['id', 'batchId', 'batchNo', 'grade', 'totalKgs', 'rate', 'remark', 'dispatchedAt', 'dispatchedBy'],
    description: 'Dispatched records created from pending batches with rate',
  },
  sales: {
    fields: ['id', 'dispatchedId', 'batchId', 'batchNo', 'grade', 'totalKgs', 'partyName', 'remark', 'createdAt', 'addedBy'],
    description: 'Sales records linking dispatched batches to buyers',
  },
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [batches, setBatches] = useState([]);
  const [sales,          setSales]          = useState([]);
  const [dispatched,     setDispatched]     = useState([]);
  const [employee, setEmployeeState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tulip_employee') || 'null'); } catch { return null; }
  });
  const setEmployee = (emp) => {
    setEmployeeState(emp);
    if (emp) localStorage.setItem('tulip_employee', JSON.stringify(emp));
    else localStorage.removeItem('tulip_employee');
  };
  const [globalFilter,   setGlobalFilter]   = useState({ grade: 'All', date: 'All' });
  const [loading,        setLoading]        = useState(true);
  const [dbError,        setDbError]        = useState(null);
  const [brands,         setBrands]         = useState([]);
  const [agents,         setAgents]         = useState([]);
  const [grades,         setGrades]         = useState([]);
  const [locations,      setLocations]      = useState([]);

  // Load all data from MySQL on mount
  const loadAll = useCallback(async () => {
    setLoading(true);
    setDbError(null);
    try {
      const [batches, salesData, dispatchedData, brandsData, agentsData, gradesData, locationsData] = await Promise.all([
        apiFetch('/batches'),
        apiFetch('/sales'),
        apiFetch('/dispatched'),
        apiFetch('/marks'),
        apiFetch('/agents'),
        apiFetch('/grades'),
        apiFetch('/locations'),
      ]);
      setBatches(batches);
      setSales(salesData);
      setDispatched(dispatchedData);
      setBrands(brandsData);
      setAgents(agentsData);
      setGrades(gradesData);
      setLocations(locationsData);
    } catch (err) {
      setDbError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const addPendingBatch = async ({ batchNo, grade, totalKgs, noOfBags, perBagWeight, mfgDate, brandId }) => {
    const record = await apiFetch('/batches', {
      method: 'POST',
      body: JSON.stringify({ batchNo, grade, totalKgs, noOfBags, perBagWeight, mfgDate, userId: employee?.id, brandId }),
    });
    setBatches(prev => [record, ...prev]);
  };

  const addSale = async ({ dispatchedId, partyName, remark, locationId, agentId, rate }) => {
    const record = await apiFetch('/sales', {
      method: 'POST',
      body: JSON.stringify({ dispatchedId, partyName, remark, locationId, agentId, rate, userId: employee?.id }),
    });
    setSales(prev => [record, ...prev]);
    setDispatched(prev => prev.filter(d => d.id !== dispatchedId));
  };

  const addBrand = async (name) => {
    const record = await apiFetch('/marks', { method: 'POST', body: JSON.stringify({ name }) });
    setBrands(prev => [...prev, record].sort((a, b) => a.name.localeCompare(b.name)));
    return record;
  };

  const updateBrand = async (id, name) => {
    const record = await apiFetch(`/marks/${id}`, { method: 'PUT', body: JSON.stringify({ name }) });
    setBrands(prev => prev.map(b => b.id === id ? record : b).sort((a, b) => a.name.localeCompare(b.name)));
  };

  const deleteBrand = async (id) => {
    await apiFetch(`/marks/${id}`, { method: 'DELETE' });
    setBrands(prev => prev.filter(b => b.id !== id));
  };

  const addAgent = async (name) => {
    const record = await apiFetch('/agents', { method: 'POST', body: JSON.stringify({ name }) });
    setAgents(prev => [...prev, record].sort((a, b) => a.name.localeCompare(b.name)));
    return record;
  };

  const updateAgent = async (id, name) => {
    const record = await apiFetch(`/agents/${id}`, { method: 'PUT', body: JSON.stringify({ name }) });
    setAgents(prev => prev.map(a => a.id === id ? record : a).sort((a, b) => a.name.localeCompare(b.name)));
  };

  const deleteAgent = async (id) => {
    await apiFetch(`/agents/${id}`, { method: 'DELETE' });
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  const addGrade = async (name) => {
    const record = await apiFetch('/grades', { method: 'POST', body: JSON.stringify({ name }) });
    setGrades(prev => [...prev, record]);
    return record;
  };

  const updateGrade = async (id, name) => {
    const record = await apiFetch(`/grades/${id}`, { method: 'PUT', body: JSON.stringify({ name }) });
    setGrades(prev => prev.map(g => g.id === id ? record : g));
  };

  const deleteGrade = async (id) => {
    await apiFetch(`/grades/${id}`, { method: 'DELETE' });
    setGrades(prev => prev.filter(g => g.id !== id));
  };

  const addLocation = async (name) => {
    const record = await apiFetch('/locations', { method: 'POST', body: JSON.stringify({ name }) });
    setLocations(prev => [...prev, record].sort((a, b) => a.name.localeCompare(b.name)));
    return record;
  };

  const updateLocation = async (id, name) => {
    const record = await apiFetch(`/locations/${id}`, { method: 'PUT', body: JSON.stringify({ name }) });
    setLocations(prev => prev.map(l => l.id === id ? record : l).sort((a, b) => a.name.localeCompare(b.name)));
  };

  const deleteLocation = async (id) => {
    await apiFetch(`/locations/${id}`, { method: 'DELETE' });
    setLocations(prev => prev.filter(l => l.id !== id));
  };

  const dispatchBatch = async (batchId, rate, remark, locationId, agentId, partyName) => {
    const record = await apiFetch('/dispatched', {
      method: 'POST',
      body: JSON.stringify({
        batchId,
        rate,
        remark,
        locationId,
        agentId,
        partyName,
        dispatchedBy: employee?.name || 'Admin',
      }),
    });
    setDispatched(prev => [record, ...prev]);
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status: 'sold' } : b));
  };

  return (
    <AppContext.Provider value={{
      batches, addPendingBatch,
      sales, addSale,
      dispatched, dispatchBatch,
      employee, setEmployee,
      globalFilter, setGlobalFilter,
      loading, dbError, reloadAll: loadAll,
      brands, addBrand, updateBrand, deleteBrand,
      agents, addAgent, updateAgent, deleteAgent,
      grades, addGrade, updateGrade, deleteGrade,
      locations, addLocation, updateLocation, deleteLocation,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
