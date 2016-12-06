import React, {PropTypes, Component} from 'react';
import './StrikeCount.css';
import Strike from './Strike.jsx';
import _ from 'lodash';
class StrikeCount extends Component {
  static propTypes() {
    return {
      count: PropTypes.number
    };
  }
  renderStrikes() {
    const strikes = []

    return strikes;
  }
  render() {
    return (
      <div className="cp-strike-count">
        {_.times(this.props.count, (i) => {
          return <Strike key={i} width={55} height={55} color="#AC4400"/>
        })}
        {_.times(3 - this.props.count, (i) => {
          return <Strike key={3 - i} width={55} height={55} color="#555"/>
        })}
      </div>
    );
  }
}

export default StrikeCount;
