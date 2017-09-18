
import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import firebase from 'firebase';
import './admin.css';

const config = {
  apiKey: "AIzaSyD4vT03R82XYAYaGrUN7NqMvQmrEveubUc",
  authDomain: "bibliofamilyfeud-2017.firebaseapp.com",
  databaseURL: "https://bibliofamilyfeud-2017.firebaseio.com",
  projectId: "bibliofamilyfeud-2017",
  storageBucket: "",
  messagingSenderId: "142220609476"
};


class Admin extends Component {
  static propTypes() {
    return {
      name: PropTypes.string
    };
  }
  constructor() {
    super();
    firebase.initializeApp(config);
    this.state = {
      showStrike: false,
      scorePool: 0,
      currentQuestion: 0,
      strikeCount: 0,
      currentTeam: 0,
      questions: [
        {
          question: 'question1',
          answers: [
            { hidden: true, text: '10', value: 10 },
            { hidden: true, text: '5',  value: 15 }
          ]
        }
      ],
      teams: [
        {name: 'team 1', score: 0}
      ]
    };
    this.addStrike = this.addStrike.bind(this);
    this.changeTeams = this.changeTeams.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.revealAnswer = this.revealAnswer.bind(this);
    this.renderAnswer = this.renderAnswer.bind(this);
    this.assignPool = this.assignPool.bind(this);
    this.hideStrike = this.hideStrike.bind(this);
    this.unlockBuzzer = this.unlockBuzzer.bind(this);
  }
  
  componentDidMount() {
    const db = firebase.database().ref('/');
    db.on('value', snap => {
      this.setState(snap.val());
    });
    db.once('value');
  }

  unlockBuzzer() {
    _.set(this.state, 'buzzerLocked', false);
    const dbRef = firebase.database().ref('/');
    dbRef.set(this.state);
  }

  revealAnswer(idx) {
    const dbRef = firebase.database().ref('/');
    const currentAnswer = _.get(this.state, `questions[${this.state.currentQuestion}].answers[${idx}]`);
    if (currentAnswer.hidden) {
      const scorePool = _.get(this.state, 'scorePool')
      _.set(this.state, `scorePool`, scorePool + currentAnswer.value);
      _.set(this.state, `questions[${this.state.currentQuestion}].answers[${idx}].hidden`, false);
      _.set(this.state, 'playCorrectAudio', true);

      dbRef.set(this.state);
    }
  }
  assignPool() {
    const dbRef = firebase.database().ref('/');
    const scorePool = _.get(this.state, 'scorePool');
    const currentTeamScore = _.get(this.state, `teams[${this.state.currentTeam}].score`);
    _.set(this.state, `teams[${this.state.currentTeam}].score`, currentTeamScore + scorePool);
    _.set(this.state, 'scorePool', 0);

    dbRef.set(this.state);
  }
  nextQuestion() {
    const maxIndex = this.state.questions.length - 1;
    const nextQuestion = this.state.currentQuestion + 1;
    const currentQuestion =  (maxIndex >= nextQuestion ? nextQuestion : 0);
    const dbRef = firebase.database().ref('/');
    dbRef.set({
      ...this.state,
      currentQuestion
    });
  }
  addStrike() {
    const strikeCount = this.state.strikeCount + 1;
    const dbRef = firebase.database().ref('/');
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
    const dbRef = firebase.database().ref('/');

    dbRef.set({
      ...this.state,
      showStrike: false
    });
  }

  changeTeams() {
    const currentTeam = this.state.currentTeam;
    const dbRef = firebase.database().ref('/');

    dbRef.set({
      ...this.state,
      currentTeam: (currentTeam === 0 ? 1 : 0),
      strikeCount: 0
    });
  }
  renderAnswer(answer, idx) {
    return (
      <div className="col-md-6 answer">
        <span className="text">{answer.text}</span>
        <span className="score">{answer.value}</span>
        <button className="btn btn-primary btn-lg" disabled={!answer.hidden}onClick={this.revealAnswer.bind(this, idx)}>Reveal</button>
      </div>
    )
  }

  render() {
    const { teams, strikeCount, questions, currentQuestion, currentTeam, scorePool} = this.state;

    return (
      <div className="container">
        <div className="cp-admin-panel row">
          <div className="current-question col-md-12">
            <h1 className="section-heading">Current Question&nbsp;<button className="btn btn-primary" onClick={this.nextQuestion}>Next Question</button></h1>
            <h2>{ questions[currentQuestion].text}</h2>
            <h3>Answers</h3>
            <div className="row">
              {_.chain(questions[currentQuestion].answers).map(this.renderAnswer).value()}
            </div>
          </div>
          <div className="current-team row">
            <div className="col-md-12">
              <h1>Current Team: { teams[currentTeam].name }&nbsp;<button className="btn btn-info" onClick={this.changeTeams}>Change Teams</button></h1>
              <h2>Assign score pool {scorePool}&nbsp;<button className="btn btn-info btn-sm" onClick={this.assignPool}>Assign Pool</button></h2>
              <h3>Strike Count: { strikeCount }&nbsp;<button className="btn btn-danger btn-sm" key="2" onClick={this.addStrike}>Add Strike</button></h3>
            </div>
          </div>




        </div>
      </div>
    );
  }
}

export default Admin;
