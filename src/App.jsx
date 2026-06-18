import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Login       from './pages/Login';
import EmpBatches  from './pages/employee/EmpBatches';
import EmpLayout   from './components/employee/EmpLayout';
import AdminLayout from './components/Layout';
import Dashboard   from './pages/Dashboard';
import Batches     from './pages/Batches';
import Users       from './pages/Users';
import Masters     from './pages/Masters';
import Brands      from './pages/Brands';
import BrandDetail from './pages/BrandDetail';
import BrandReport from './pages/BrandReport';
import AgentReport from './pages/AgentReport';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/"           element={<Login />} />
        <Route path="/login"      element={<Login />} />

        {/* Admin */}
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard"        element={<Dashboard />} />
          <Route path="batches"          element={<Batches />} />
          <Route path="users"            element={<Users />} />
          <Route path="masters"          element={<Masters />} />
          <Route path="brands"           element={<Brands />} />
          <Route path="brands/:id"       element={<BrandDetail />} />
          <Route path="brand-report"     element={<BrandReport />} />
          <Route path="agent-report"     element={<AgentReport />} />
        </Route>

        {/* Employee */}
        <Route path="/employee" element={<EmpLayout />}>
          <Route path="batches" element={<EmpBatches />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}
