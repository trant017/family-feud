import React, {Component} from 'react';
import Strike from './Strike.jsx';
import _ from 'lodash';
import './BigStrike.css';

class BigStrike extends Component {
  render() {
    return (
      <div className="cp-big-strike">
        <Strike width={300} height={300} color="#AC4400"/>
        <audio autoPlay>
          <source src="./ff-strike.wav" type="audio/wav"/>
        </audio>
      </div>
    );
  }
}

export default BigStrike;
