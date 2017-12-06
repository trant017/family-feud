// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';

import App from './App.js';
import Controls from './Controls.js';
import Admin from './Admin.js';
import Backend from './Backend.js';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route component={Backend}>
      <Route path="controls" component={Controls} />
      <Route path="admin" component={Admin} />
    </Route>
  </Router>
);

export default Routes;
