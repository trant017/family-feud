import React, { PropTypes, Component } from "react";
import _ from "lodash";

class ScoreBoard extends Component {
  static propTypes() {
    return {
      currentQuestion: PropTypes.number.isRequired,
      questions: PropTypes.arrayOf(PropTypes.object)
    };
  }
  render() {
    const styles = {
      color: "white",
      display: "flex",
      flexFlow: "row",
      justifyContent: "center",
      alignContent: "center",
      fontSize: "16vmin",
      flex: "3",
      border: "1px solid white",
      backgroundColor: "#333",
      fontFamily: "monospace"
    };
    const currentPool = _.reduce(
      this.props.questions[this.props.currentQuestion].answers,
      (sum, obj) => {
        return sum + (!obj.hidden ? obj.value : 0);
      },
      0
    );

    return (
      <div style={styles} className="cp-scoreboard">
        {currentPool}
      </div>
    );
  }
}

export default ScoreBoard;
