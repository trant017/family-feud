import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { browserHistory } from 'react-router';

import Routes from './Routes.js';

ReactDOM.render(
  <Routes history={browserHistory} />,
  document.getElementById('root')
);
