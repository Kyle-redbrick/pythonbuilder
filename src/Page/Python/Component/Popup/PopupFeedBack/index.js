import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./index.scss";

class Container extends Component {
  render() {
    return (
      <div className="PopupLessonFeedback">
        <div className="PopupLessonFeedbackHeader">
          <div className="HeaderText">학습 평가</div>
        </div>
        <div className="PopupLessonFeedbackContent">
          <div className="PopupLessonFeedbackInfo">
            <p>수업이 종료되어 학생과의 연결을 종료하였습니다.</p>
            <p>24시간 내에 학습 평가를 진행해주세요.</p>
          </div>
          <div className="PopupLessonFeedbackButtons">
            <Link to="/tutor" className="PopupLessonFeedbackButton1">
              <button className="PopupLessonFeedbackButton next">다음에 하기</button>
            </Link>
            <Link to="/tutor/reservationList/complete" className="PopupLessonFeedbackButton2">
              <button className="PopupLessonFeedbackButton rate">평가하기</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Container;
