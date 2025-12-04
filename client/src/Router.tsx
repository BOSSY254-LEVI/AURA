import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Removed Navigate
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import Companion from './pages/Companion';
import Emergency from './pages/Emergency';
import Insights from './pages/Insights';
import Learn from './pages/Learn';
import Vault from './pages/Vault';
import NotFound from './pages/not-found';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/community" element={<Community />} />
        <Route path="/companion" element={<Companion />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;