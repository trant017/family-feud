
import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import firebase from 'firebase';
const config = {
  apiKey: "AIzaSyBJfKnj7rUnJBauLz2X8dMywh6sLI2fTAE",
  authDomain: "family-feud-d96a0.firebaseapp.com",
  databaseURL: "https://family-feud-d96a0.firebaseio.com",
  storageBucket: "family-feud-d96a0.appspot.com",
  messagingSenderId: "437442788117"
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
  }
  componentDidMount() {
    const db = firebase.database().ref('/');
    db.on('value', snap => {
      this.setState(snap.val());
    });
    db.once('value');
  }
  renderAnswer(answer, idx) {
    return (
      <li>{answer.text}&mdash;{answer.value}<button onClick={this.revealAnswer.bind(this, idx)}>reveal</button></li>
    )
  }
  revealAnswer(idx) {

    const dbRef = firebase.database().ref('/');
    const currentAnswer = _.get(this.state, `questions[${this.state.currentQuestion}].answers[${idx}]`);
    if (currentAnswer.hidden) {
      const scorePool = _.get(this.state, 'scorePool')
      _.set(this.state, `scorePool`, scorePool + currentAnswer.value);
      _.set(this.state, `questions[${this.state.currentQuestion}].answers[${idx}].hidden`, false);

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
  render() {
    const { teams, strikeCount, questions, currentQuestion, currentTeam} = this.state;

    return (
      <div>
        <p key="1">
          <label>Current Questions:</label> { questions[currentQuestion].question}<br/>
          <button onClick={this.nextQuestion}>Next Question</button><br/>
          <label>Answers:</label>

          <ul>
            {_.chain(questions[currentQuestion].answers).map(this.renderAnswer).value()}
          </ul>

        </p>
        <p key="2">Current Team: { teams[currentTeam].name }<br/>
          <button key="1" onClick={this.changeTeams}>Change Teams</button></p>
        <p key="3">Strike Count: { strikeCount }<br/>
          <button key="2" onClick={this.addStrike}>Add Strike</button></p>
        <label>Assign score pool</label><br/>
        <button onClick={this.assignPool}>Assign Pool</button><br/>
      </div>


    );
  }
}

export default Admin;
