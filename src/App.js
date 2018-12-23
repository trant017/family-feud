import React, { Component } from "react";
import ReactAudioPlayer from "react-audio-player";
import _ from "lodash";
import "./App.css";
import * as firebase from "firebase";
import CurrentQuestion from "./CurrentQuestion.js";
import TeamBoard from "./TeamBoard.js";
import BigStrike from "./BigStrike.js";

const config = {
  apiKey: "AIzaSyBhaTercJfWxpqtvNzRpPNTlX2bB8Klzls",
  authDomain: "testtony-b24db.firebaseapp.com",
  databaseURL: "https://testtony-b24db.firebaseio.com",
  projectId: "testtony-b24db",
  storageBucket: "testtony-b24db.appspot.com",
  messagingSenderId: "903324127900"
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
      questions: [
        {
          question: null,
          answers: []
        }
      ],
      teams: [{ name: "test1", score: 0 }, { name: "test2", score: 0 }]
    };
    this.showStrike = this.showStrike.bind(this);
    this.finishCorrectAudio = this.finishCorrectAudio.bind(this);
    this.finishStrikeAudio = this.finishStrikeAudio.bind(this);
    this.finishIntroAudio = this.finishIntroAudio.bind(this);
  }

  componentDidMount() {
    firebase.initializeApp(config);
    const db = firebase.database().ref("/");
    db.on("value", snap => {
      this.setState(snap.val());
    });
    db.once("value");
  }
  componentWillUpdate(nextProps, nextState) {
    if (!this.state.playCorrectAudio && nextState.playCorrectAudio) {
      this.correctPlayer.audioEl.play();
    }

    if (!this.state.playIntro && nextState.playIntro) {
      this.introPlayer.audioEl.play();
    }

    if (!this.state.showStrike && nextState.showStrike) {
      this.strikePlayer.audioEl.play();
    }
  }
  showStrike(show) {
    if (show) {
      return <BigStrike count={this.state.strikeCount} />;
    }
    return <noop />;
  }

  finishCorrectAudio() {
    const dbRef = firebase.database().ref("/");
    _.set(this.state, "playCorrectAudio", false);
    dbRef.set(this.state);
  }

  finishStrikeAudio() {
    const dbRef = firebase.database().ref("/");
    _.set(this.state, "showStrike", false);
    dbRef.set(this.state);
  }

  finishIntroAudio() {
    const dbRef = firebase.database().ref("/");
    _.set(this.state, "playIntro", false);
    dbRef.set(this.state);
  }

  render() {
    const {
      showStrike,
      teams,
      questions,
      strikeCount,
      currentTeam,
      currentQuestion
    } = this.state;

    return (
      <div className="App">
        <TeamBoard
          currentQuestion={currentQuestion}
          questions={questions}
          count={strikeCount}
          currentTeamIndex={currentTeam}
          teams={teams}
        />
        <CurrentQuestion question={questions[currentQuestion]} />
        {this.showStrike(showStrike)}
        <ReactAudioPlayer
          ref={el => {
            this.strikePlayer = el;
          }}
          controls={false}
          src="./ff-strike.wav"
          preload="auto"
          onEnded={this.finishStrikeAudio}
        />
        <ReactAudioPlayer
          ref={el => {
            this.correctPlayer = el;
          }}
          controls={false}
          preload="auto"
          src="./ff-clang.wav"
          onEnded={this.finishCorrectAudio}
        />
        <ReactAudioPlayer
          ref={el => {
            this.introPlayer = el;
          }}
          controls={false}
          preload="auto"
          src="./ff-intro.wav"
          onEnded={this.finishIntroAudio}
        />
      </div>
    );
  }
}

export default App;
