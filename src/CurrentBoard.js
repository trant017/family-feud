import _ from 'lodash';
import React, {PropTypes, Component} from 'react';
import './CurrentBoard.css';
class CurrentQuestion extends Component {
  static propTypes() {
    return {
      board: PropTypes.object.isRequired
    };
  }
  static defaultProps() {
    return {
      board: {
        categories: [],
      }
    }
  }

  renderCategories(category, index) {
    return (
      <div className={`o-category`} key={index}>
        <div className="c-category__box">
          <span>{category.text}</span>
        </div>
        {_.chain(category.questions).map(function(question){
          console.log(question);
          return (
            <div className={`c-category__box vertical flip'}`} key={question.value}>
              <span className="number">${question.value}</span>
            </div>
          );
        }).value() }
      </div>
    );
  }

  render() {
    const { board } = this.props;
    const height = 150;
      console.log(board.categories);
      console.log(this);
    return (
      <div className="cp-current-question">
        {/*<h1 className="question">{question.text}</h1>*/}
        {_.chain(board.categories).map(this.renderCategories).value() }
      </div>
    );
  }
}

export default CurrentQuestion;
