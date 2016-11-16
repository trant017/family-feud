// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';

import App from './App.js';
import Admin from './Admin.js';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="/controls" component={Admin} />
  </Router>
);

export default Routes;
