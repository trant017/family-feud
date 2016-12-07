import _ from 'lodash';
import React, {PropTypes, Component} from 'react';
import './CurrentQuestion.css';
class CurrentQuestion extends Component {
  static propTypes() {
    return {
      question: PropTypes.object.isRequired
    };
  }
  static defaultProps() {
    return {
      question: {
        text: "",
        answers: []
      }
    }
  }
  renderAnswers(answer, index) {
    return (
      <div className={`flip-container vertical ${answer.hidden ? '' : 'flip'}`} key={index}>
        <div className="flipper">
          <div className="front">
            <div className="answer answer_hidden">
              <span className="number">{index + 1}</span>
            </div>
          </div>
          <div className="back">
            <div className="answer" >
              {answer.text}
              <span className="score">{answer.value}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    const { question } = this.props;
    console.log(question);
    const height = Math.round(question.answers.length/2) * 115;
    return (
      <div className="cp-current-question">
        <h1 className="question">{question.text}</h1>
        <div className="answerList" style={{height}}>
          {_.chain(question.answers).sortBy('value').reverse().map(this.renderAnswers).value()}
        </div>
      </div>
    );
  }
}

export default CurrentQuestion;
