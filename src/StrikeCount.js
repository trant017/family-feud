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
        {_.times(this.props.count, () => {
          return <Strike width={55} height={55} fill="#AC4400"/>
        })}
        {_.times(3 - this.props.count, () => {
          return <Strike width={55} height={55} fill="#555"/>
        })}
      </div>
    );
  }
}

export default StrikeCount;
