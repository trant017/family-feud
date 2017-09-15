import React, {Component} from 'react';
import Strike from './Strike.jsx';
import _ from 'lodash';
import './BigStrike.css';

class BigStrike extends Component {
  renderStrike(i) {
    return (
      <Strike key={`big-strike-${i  }`} width={300} height={300} color="#AC4400"/>
    );
  }
  render() {
    return (
      <div className="cp-big-strike">
        {_.times(this.props.count, this.renderStrike)}
      </div>
    );
  }
}

export default BigStrike;
