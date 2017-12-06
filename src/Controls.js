import React, { PropTypes, Component } from "react";
import _ from "lodash";
import firebase from "firebase";
import "./admin.css";

const config = {
  apiKey: "AIzaSyD4vT03R82XYAYaGrUN7NqMvQmrEveubUc",
  authDomain: "bibliofamilyfeud-2017.firebaseapp.com",
  databaseURL: "https://bibliofamilyfeud-2017.firebaseio.com",
  projectId: "bibliofamilyfeud-2017",
  storageBucket: "",
  messagingSenderId: "142220609476"
};

class Controls extends Component {
  static propTypes() {
    return {
      name: PropTypes.string
    };
  }
  constructor() {
    super();
    firebase.initializeApp(config);
    this.db = firebase.database();

    this.state = {
      showStrike: false,
      scorePool: 0,
      currentQuestion: 0,
      strikeCount: 0,
      currentTeam: 0,
      questions: [
        {
          question: "question1",
          answers: [
            { hidden: true, text: "10", value: 10 },
            { hidden: true, text: "5", value: 15 }
          ]
        }
      ],
      teams: [{ name: "team 1", score: 0 }]
    };
    this.addStrike = this.addStrike.bind(this);
    this.changeTeams = this.changeTeams.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.revealAnswer = this.revealAnswer.bind(this);
    this.renderAnswer = this.renderAnswer.bind(this);
    this.assignPool = this.assignPool.bind(this);
    this.hideStrike = this.hideStrike.bind(this);
    this.unlockBuzzer = this.unlockBuzzer.bind(this);
    this.currentPool = this.currentPool.bind(this);
  }

  componentDidMount() {
    const dbRef = this.db.ref("/");
    dbRef.on("value", snap => {
      this.setState(snap.val());
    });
    dbRef.once("value");
  }

  unlockBuzzer() {
    _.set(this.state, "buzzerLocked", false);
    const dbRef = this.db.ref("/");
    dbRef.set(this.state);
  }

  revealAnswer(idx) {
    const dbRef = this.db.ref("/");
    const currentAnswer = _.get(
      this.state,
      `questions[${this.state.currentQuestion}].answers[${idx}]`
    );
    if (currentAnswer.hidden) {
      _.set(
        this.state,
        `questions[${this.state.currentQuestion}].answers[${idx}].hidden`,
        false
      );
      _.set(this.state, "playCorrectAudio", true);
    } else {
      _.set(
        this.state,
        `questions[${this.state.currentQuestion}].answers[${idx}].hidden`,
        true
      );
    }
    dbRef.set(this.state);
  }
  assignPool() {
    const dbRef = this.db.ref("/");
    const currentQuestion = _.get(
      this.state,
      `questions[${this.state.currentQuestion}]`
    );
    const currentTeamScore = _.get(
      this.state,
      `teams[${this.state.currentTeam}].score`
    );

    const newScore = _.reduce(
      currentQuestion.answers,
      (sum, n) => {
        return sum + (n.hidden ? 0 : n.value);
      },
      currentTeamScore
    );

    _.set(this.state, `teams[${this.state.currentTeam}].score`, newScore);
    dbRef.set(this.state);
    this.nextQuestion();
  }

  nextQuestion() {
    const maxIndex = this.state.questions.length - 1;
    const nextQuestion = this.state.currentQuestion + 1;
    const currentQuestion = maxIndex >= nextQuestion ? nextQuestion : 0;
    const dbRef = this.db.ref("/");
    dbRef.set({
      ...this.state,
      currentQuestion
    });
  }
  currentPool() {
    const currentQuestion = _.get(
      this.state,
      `questions[${this.state.currentQuestion}]`
    );
    const newScore = _.reduce(
      currentQuestion.answers,
      (sum, n) => {
        return sum + (n.hidden ? 0 : n.value);
      },
      0
    );
    return newScore;
  }
  addStrike() {
    const strikeCount = this.state.strikeCount + 1;
    const dbRef = this.db.ref("/");
    if (strikeCount <= 3) {
      dbRef.set({
        ...this.state,
        strikeCount,
        showStrike: true
      });
    }
    window.setTimeout(this.hideStrike, 2000);
  }
  hideStrike() {
    const dbRef = this.db.ref("/");

    dbRef.set({
      ...this.state,
      showStrike: false
    });
  }

  changeTeams() {
    const currentTeam = this.state.currentTeam;
    const dbRef = this.db.ref("/");

    dbRef.set({
      ...this.state,
      currentTeam: currentTeam === 0 ? 1 : 0,
      strikeCount: 0
    });
  }
  renderAnswer(answer, idx) {
    return (
      <tr>
        <td className="text">{answer.text}</td>
        <td className="score">{answer.value}</td>
        <td>
          <button
            className={`btn btn-${answer.hidden ? "primary" : "danger"}`}
            onClick={this.revealAnswer.bind(this, idx)}
          >
            {answer.hidden ? "Show" : "Hide"}
          </button>
        </td>
      </tr>
    );
  }

  render() {
    const {
      buzzerLocked,
      teams,
      strikeCount,
      questions,
      currentQuestion,
      currentTeam
    } = this.state;

    return (
      <div className="container-fluid">
        <div className="cp-admin-panel row">
          <section className="col-xs-12">
            <div className="btn-toolbar">
              <div
                className="btn-group btn-group-lg"
                styles={{ marginBottom: "10px" }}
              >
                <button
                  className="btn btn-info"
                  type="button"
                  onClick={this.changeTeams}
                >
                  Change Teams
                </button>
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={this.assignPool}
                >
                  Assign Pool {this.currentPool()}
                </button>
              </div>
              <div className="btn-group btn-group-lg">
                <button
                  type="button"
                  className="btn btn-danger"
                  key="2"
                  onClick={this.addStrike}
                >
                  Add Strike
                </button>
                <button
                  type="button"
                  onClick={this.unlockBuzzer}
                  className="btn btn-danger"
                  disabled={!buzzerLocked}
                >
                  Unlock Buzzer
                </button>
              </div>
            </div>
          </section>
          <div className="current-question col-sm-12">
            <h2>{questions[currentQuestion].text}</h2>
            <h3>Answers</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Answer</th>
                  <th>Score</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {_.chain(questions[currentQuestion].answers)
                  .map(this.renderAnswer)
                  .value()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Controls;
