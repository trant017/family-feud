import React, {PropTypes, Component} from 'react';
import './StrikeCount.css';
import Strike from './Strike.jsx';
import _ from 'lodash';
class StrikeCount extends Component {
  static propTypes() {
    return {
      name: PropTypes.string
    };
  }
  renderStrikes(count) {
    console.info('rendering Strike');
    const strikes = []
    _.times(count, () => {
      strikes.push(<Strike/>);
    })
    return strikes;
  }
  render() {
    const { count } = this.props;
    return (
      <div className="cp-strike-count">
        {this.renderStrikes(count)}
      </div>
    );
  }
}

export default StrikeCount;
