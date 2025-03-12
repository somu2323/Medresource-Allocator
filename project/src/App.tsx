import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import BedManagement from './pages/BedManagement';
import EquipmentManagement from './pages/EquipmentManagement';
import StaffManagement from './pages/StaffManagement';
import StaffScheduling from './pages/StaffScheduling';
import BedOptimizer from './pages/BedOptimizer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="beds" element={<BedManagement />} />
          <Route path="bed-optimizer" element={<BedOptimizer />} />
          <Route path="equipment" element={<EquipmentManagement />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="scheduling" element={<StaffScheduling />} />
          <Route path="settings" element={<div className="p-4">Settings Page (Coming Soon)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;