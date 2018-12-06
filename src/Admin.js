import React, { Component } from 'react';
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
  }

  componentDidMount() {
    this.db.ref('/').once('value').then(function(snapshot) {
      console.info(snapshot.val());
    })

  }

  deleteQuestion(id) {

  }

  addQuestion(questionText) {
    const id = 0;
    return id;
  }

  deleteAnswer(questionId, answerId) {

  }

  editQuestion(questionId) {

  }

  addAnswer(questionId, answerText, answerValue) {

  }

  render() {
    return (
      <div>hi</div>
    )
  }

};

export default Admin;
