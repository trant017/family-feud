import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import './TeamBoard.css';

class TeamBoard extends Component {
  static propTypes() {
    return {
      name: PropTypes.string
    };
  }

  constructor() {
    super();
    this.renderTeamScore = this.renderTeamScore.bind(this);
  }

  renderTeamScore(team, index) {
    const isActive = index === this.props.currentTeamIndex;
    return (
      <div key={index} className={`team${isActive ? ' active' : ''}`}>
        <div className="name">{team.name}</div>
        <div className="score">
          {team.score}
        </div>
      </div>
    )
  }
  render() {
    const {teams} = this.props;
    return (
      <div className="cp-team-board">
        {_.map(teams, this.renderTeamScore)}
      </div>
    );
  }
}

export default TeamBoard;
