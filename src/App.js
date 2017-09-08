import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import _ from 'lodash';
import './App.css';
import * as firebase from 'firebase';
import CurrentQuestion from './CurrentQuestion.js';
import TeamBoard from './TeamBoard.js';
import BigStrike from './BigStrike.js';

const config = {
  apiKey: "AIzaSyD4vT03R82XYAYaGrUN7NqMvQmrEveubUc",
  authDomain: "bibliofamilyfeud-2017.firebaseapp.com",
  databaseURL: "https://bibliofamilyfeud-2017.firebaseio.com",
  projectId: "bibliofamilyfeud-2017",
  storageBucket: "",
  messagingSenderId: "142220609476"
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      showStrike: false,
      scorePool: 0,
      strikeCount: 0,
      currentQuestion: 0,
      currentTeam: 0,
      questions: [{
        question: null,
        answers: []
      }],
      teams: [{name: 'test1', score: 0}, {name: 'test2', score: 0}]
    };
    this.showStrike = this.showStrike.bind(this);
    this.finishCorrectAudio = this.finishCorrectAudio.bind(this);
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
        <BigStrike count={this.state.strikeCount} />
      );
    }
    return <noop  />
  }
  renderCorrectAudio() {
    if (this.state.playCorrectAudio) {
      return (
        <ReactAudioPlayer
          controls={false}
          src="./ff-clang.wav"
          onEnded={this.finishCorrectAudio}
          autoPlay />
      );
    }

    return <noop />;
  }
  finishCorrectAudio() {
    const dbRef = firebase.database().ref('/');
    _.set(this.state, 'playCorrectAudio', false);
    dbRef.set(this.state);
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
        <TeamBoard score={scorePool} count={strikeCount} currentTeamIndex={currentTeam} teams={teams}/>
        <CurrentQuestion question={questions[currentQuestion]}/>
        {this.showStrike(showStrike)}
        {this.renderCorrectAudio()}
      </div>
    );
  }
}

export default App;
