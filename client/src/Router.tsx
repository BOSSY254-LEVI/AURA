import React from 'react';
import { Router, Switch, Route } from 'wouter';
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
    <Router>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/community" component={Community} />
        <Route path="/companion" component={Companion} />
        <Route path="/emergency" component={Emergency} />
        <Route path="/insights" component={Insights} />
        <Route path="/learn" component={Learn} />
        <Route path="/vault" component={Vault} />
        {/* Add more routes as needed */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default AppRouter;