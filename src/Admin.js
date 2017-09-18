
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
firebase.initializeApp(config);

class Admin extends Component {
  static propTypes() {
    return {
      name: PropTypes.string
    };
  }
  constructor() {
    super();
    this.db = firebase.database();

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
    const dbRef = this.db.ref('/');
    dbRef.on('value', snap => {
      this.setState(snap.val());
    });
    dbRef.once('value');
  }

  unlockBuzzer() {
    _.set(this.state, 'buzzerLocked', false);
    const dbRef = this.db.ref('/');
    dbRef.set(this.state);
  }

  revealAnswer(idx) {
    const dbRef = this.db.ref('/');
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
    const dbRef = this.db.ref('/');
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
    const dbRef = this.db.ref('/');
    dbRef.set({
      ...this.state,
      currentQuestion
    });
  }
  addStrike() {
    const strikeCount = this.state.strikeCount + 1;
    const dbRef = this.db.ref('/');
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
    const dbRef = this.db.ref('/');

    dbRef.set({
      ...this.state,
      showStrike: false
    });
  }

  changeTeams() {
    const currentTeam = this.state.currentTeam;
    const dbRef = this.db.ref('/');

    dbRef.set({
      ...this.state,
      currentTeam: (currentTeam === 0 ? 1 : 0),
      strikeCount: 0
    });
  }
  renderAnswer(answer, idx) {
    return (
      <tr>
        <td className="text">{answer.text}</td>
        <td className="score">{answer.value}</td>
        <td>
          <button className="btn btn-primary" disabled={!answer.hidden}onClick={this.revealAnswer.bind(this, idx)}>Reveal</button>
        </td>
      </tr>
    )
  }

  render() {
    const { buzzerLocked, teams, strikeCount, questions, currentQuestion, currentTeam, scorePool} = this.state;

    return (
      <div className="container-fluid">
        <div className="cp-admin-panel row">
          <aside className="col-sm-4">
            <p>
              Current Team: { teams[currentTeam].name }
              &nbsp;<button className="btn btn-info btn-sm" onClick={this.changeTeams}>Change Teams</button>
            </p>
            <p>Current Question&nbsp;<button className="btn btn-info btn-sm" onClick={this.nextQuestion}>Next Question</button></p>

            <p>
              Assign score pool {scorePool}&nbsp;
              <button className="btn btn-info btn-sm" onClick={this.assignPool}>Assign Pool</button>
            </p>

            <p>Strike Count: { strikeCount } &nbsp; <button className="btn btn-danger btn-sm" key="2" onClick={this.addStrike}>Add Strike</button></p>
            <p><button onClick={this.unlockBuzzer} className="btn btn-danger btn-sm" disabled={!buzzerLocked}>Unlock Buzzer</button></p>
          </aside>
          <div className="current-question col-sm-8">
            <h2>{ questions[currentQuestion].text}</h2>
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
                {_.chain(questions[currentQuestion].answers).map(this.renderAnswer).value()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
