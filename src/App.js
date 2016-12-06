import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import ScoreBoard from './ScoreBoard.js';
import CurrentQuestion from './CurrentQuestion.js';
import StrikeCount from './StrikeCount.js';
import TeamBoard from './TeamBoard.js';
import BigStrike from './BigStrike.js';
const config = {
  apiKey: "AIzaSyBJfKnj7rUnJBauLz2X8dMywh6sLI2fTAE",
  authDomain: "family-feud-d96a0.firebaseapp.com",
  databaseURL: "https://family-feud-d96a0.firebaseio.com",
  storageBucket: "family-feud-d96a0.appspot.com",
  messagingSenderId: "437442788117"
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      showStrike: true,
      scorePool: 0,
      strikeCount: 0,
      currentQuestion: 0,
      currentTeam: 0,
      questions: [{
        question: null,
        answers: []
      }],
      teams: []
    };
  }

  componentDidMount() {
    firebase.initializeApp(config);
    const db = firebase.database().ref('/');
    db.on('value', snap => {
      this.setState(snap.val());
    });
    db.once('value');
  }
  showStrike(show) {
    if (show) {
      return (
        <BigStrike />
      );
    }
    return <noop  />
  }
  render() {
    const { showStrike,
      teams,
      questions,
      scorePool,
      strikeCount,
      currentTeam,
      currentQuestion } = this.state;

    return (
      <div className="App">
        <div className="scoreboard">
          <TeamBoard currentTeamIndex={currentTeam} teams={teams}/>
          <ScoreBoard score={scorePool}/>
          <StrikeCount count={strikeCount}/>
        </div>
        <CurrentQuestion question={questions[currentQuestion]}/>
        {this.showStrike(showStrike)}
      </div>
    );
  }
}

export default App;
