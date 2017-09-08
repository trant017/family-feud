import React, {Component} from 'react';
import Strike from './Strike.jsx';
import _ from 'lodash';
import './BigStrike.css';

class BigStrike extends Component {
  renderStrike() {
    return (
      <Strike width={300} height={300} color="#AC4400"/>
    );
  }
  render() {
    return (
      <div className="cp-big-strike">
        {_.times(this.props.count, this.renderStrike)}
        <audio autoPlay>
          <source src="./ff-strike.wav" type="audio/wav"/>
        </audio>
      </div>
    );
  }
}

export default BigStrike;
