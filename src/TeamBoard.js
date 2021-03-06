import React, { PropTypes, Component } from "react";
import _ from "lodash";
import "./TeamBoard.css";
import TeamCard from "./TeamCard.js";
import ScoreBoard from "./ScoreBoard.js";

class TeamBoard extends Component {
  constructor() {
    super();
    this.renderTeamScore = this.renderTeamScore.bind(this);
  }

  renderTeamScore(team, isActive) {
    return <TeamCard team={team} isActive={isActive} />;
  }

  render() {
    const { teams, currentQuestion, questions, currentTeamIndex } = this.props;
    return (
      <div className="cp-team-board">
        <TeamCard team={teams[0]} isActive={0 === currentTeamIndex} />
        <ScoreBoard currentQuestion={currentQuestion} questions={questions} />
        <TeamCard team={teams[1]} isActive={1 === currentTeamIndex} />
      </div>
    );
  }
}

export default TeamBoard;

TeamBoard.propTypes = {
  currentTeamIndex: PropTypes.number.isRequired,
  currentQuestion: PropTypes.number.isRequired,
  questions: PropTypes.arrayOf(PropTypes.object),
  count: PropTypes.number.isRequired,
  teams: PropTypes.arrayOf(PropTypes.object)
};
