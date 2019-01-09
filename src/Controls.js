import React, { PropTypes, Component } from "react";
import _ from "lodash";
import firebase from "firebase";
import "./admin.css";

const config = {
  apiKey: "AIzaSyBhaTercJfWxpqtvNzRpPNTlX2bB8Klzls",
  authDomain: "testtony-b24db.firebaseapp.com",
  databaseURL: "https://testtony-b24db.firebaseio.com",
  projectId: "testtony-b24db",
  storageBucket: "testtony-b24db.appspot.com",
  messagingSenderId: "903324127900"
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
        currentBoard: 0,
        boards: [
            {
                board: null,
                categories: []
            }
        ],
        teams: [{ name: "test1", score: 0 }, { name: "test2", score: 0 }, { name: "test3", score: 0 }]
    };
    this.addStrike = this.addStrike.bind(this);
    this.changeTeams = this.changeTeams.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
    this.revealClue = this.revealClue.bind(this);
    this.renderBoard = this.renderBoard.bind(this);
    this.assignPool = this.assignPool.bind(this);
    this.hideStrike = this.hideStrike.bind(this);
    this.showOneStrike = this.showOneStrike.bind(this);
    this.showTwoStrike = this.showTwoStrike.bind(this);
    this.showThreeStrike = this.showThreeStrike.bind(this);
    this.playIntro = this.playIntro.bind(this);
    this.currentPool = this.currentPool.bind(this);
  }

  componentDidMount() {
    const dbRef = this.db.ref("/");
    dbRef.on("value", snap => {
      this.setState(snap.val());
    });
    dbRef.once("value");
  }

  revealClue(something ,idx) {
    console.log(something);
    console.log(idx);
    // const dbRef = this.db.ref("/");
    // const currentAnswer = _.get(
    //   this.state,
    //   `questions[${this.state.currentQuestion}].answers[${idx}]`
    // );
    // if (currentAnswer.hidden) {
    //   _.set(
    //     this.state,
    //     `questions[${this.state.currentQuestion}].answers[${idx}].hidden`,
    //     false
    //   );
    //   _.set(this.state, "playCorrectAudio", true);
    // } else {
    //   _.set(
    //     this.state,
    //     `questions[${this.state.currentQuestion}].answers[${idx}].hidden`,
    //     true
    //   );
    // }
    // dbRef.set(this.state);
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
  }

  nextQuestion() {
    const maxIndex = this.state.questions.length - 1;
    const nextQuestion = this.state.currentQuestion + 1;
    const currentQuestion = maxIndex >= nextQuestion ? nextQuestion : maxIndex;
    const dbRef = this.db.ref("/");
    dbRef.set({
      ...this.state,
      currentQuestion
    });
  }

  prevQuestion() {
    const minIndex = 0;
    const nextQuestion = this.state.currentQuestion - 1;
    const currentQuestion = minIndex <= nextQuestion ? nextQuestion : minIndex;
    const dbRef = this.db.ref("/");
    dbRef.set({
      ...this.state,
      currentQuestion
    });
  }

  playIntro() {
    const dbRef = this.db.ref("/");
    _.set(this.state, "playIntro", true);
    dbRef.set(this.state);
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

  showOneStrike() {
    const strikeCount = 1;
    const dbRef = this.db.ref("/");
    dbRef.set(this.state);
    dbRef.set({
      ...this.state,
      strikeCount,
      showStrike: true
    });
    window.setTimeout(this.hideStrike, 2000);
  }

  showTwoStrike() {
    const strikeCount = 2;
    const dbRef = this.db.ref("/");
    dbRef.set(this.state);
    dbRef.set({
      ...this.state,
      strikeCount,
      showStrike: true
    });
    window.setTimeout(this.hideStrike, 2000);
  }
  showThreeStrike() {
    const strikeCount = 3;
    const dbRef = this.db.ref("/");
    dbRef.set(this.state);
      dbRef.set({
      ...this.state,
      strikeCount,
      showStrike: true
      });
    window.setTimeout(this.hideStrike, 2000);
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
  renderBoard(category, idx) {
    if (category == null) {
      return
    }
    console.log(this);
    return (
      <div className="o-category">
        <div key={'category-' + idx} className="c-category__box">
            <span>{category.text}</span>
        </div>
          {_.chain(category.questions).map(function(question, index){
              // console.log('got here 2');
              // console.log(question.text);
              console.log(this);
              return (
                  <button className={`c-category__box vertical flip'}`} key={question.text} onClick={this.revealClue.bind(this, idx)}>
                      <span className="number">{question.text}</span>
                  </button>
              );
          }).value() }
        {/*<td className="score">{answer.value}</td>*/}
        {/*<td>*/}
          {/*<button*/}
            {/*className={`btn btn-${answer.hidden ? "primary" : "danger"}`}*/}
            {/*onClick={this.revealAnswer.bind(this, idx)}*/}
          {/*>*/}
            {/*{answer.hidden ? "Show" : "Hide"}*/}
          {/*</button>*/}
        {/*</td>*/}
      </div>
    );
  }

  render() {
    const {
        teams,
        boards,
        currentTeam,
        currentBoard
    } = this.state;
    console.log(boards);
    return (
      <div className="container-fluid">
        <div className="cp-admin-panel row">
          <div className="current-question col-sm-12">
            <h2>
              {/*{currentQuestion + 1}.&nbsp;{questions[currentQuestion].text}*/}
            </h2>
            <h3>Answers</h3>
            <div className="o-answers">
                {_.chain(boards[currentBoard].categories)
                  .map(this.renderBoard)
                  .value()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Controls;
