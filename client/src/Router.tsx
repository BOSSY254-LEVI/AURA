import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import Companion from './pages/Companion';
import Emergency from './pages/Emergency';
import Insights from './pages/Insights';
import Learn from './pages/Learn';
import Vault from './pages/Vault';
import NotFound from './pages/not-found';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/community" element={<Community />} />
        <Route path="/companion" element={<Companion />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/vault" element={<Vault />} />
        {/* Add a catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;