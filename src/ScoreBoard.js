import React, {PropTypes, Component} from 'react';

class ScoreBoard extends Component {
  static propTypes() {
    return {
      score: PropTypes.number.isRequired
    };
  }
  render() {
    const styles = {
      color: 'white',
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'center',
      alignContent: 'center',
      fontSize: '16vmin',
      flex: '2',
      border: '1px solid white',
      backgroundColor: '#333',
      fontFamily: 'monospace'
    };
    return (
      <div style={styles} className="cp-scoreboard">
        {this.props.score}
      </div>
    );
  }
}

export default ScoreBoard;
