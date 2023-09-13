import React, { Component } from "react";
import * as request from "../../../Util/HTTPRequest";
import * as TrackingUtil from "../../../Util/TrackingUtil";
import { getScore } from "../../../Util/WizLiveQuiz";
import { showPopUp, OneButtonPopUp } from "../";
import "./index.scss";

import checkImg from "../../../../Image/wizlivequiz_check.svg";
import correctImg from "../../../../Image/wizlivequiz_correct.svg";
import incorrectImg from "../../../../Image/wizlivequiz_incorrect.svg";

class WizliveQuizPopUp extends Component {
  constructor(props) {
    super(props);

    this.completed = !!props.answer;
    this.state = {
      quizTemplate: this.completed ? props.answer : props.template,
      currentQuizNum: 0,
    };
    if (this.completed) {
      this.score = getScore(this.props.answer);
    }
  }

  updateMyQuiz = (callback) => {
    const { email, quizId, type, level } = this.props;
    request
      .updateMyQuiz({
        email,
        quizId,
        quizAnswer: JSON.stringify(this.state.quizTemplate),
        type,
      })
      .then((res) => res.json())
      .then((json) => {
        TrackingUtil.sendActiveCampaignEvent(email, "lectureTest_completed", {
          type,
          level,
          createdAt: new Date().toLocaleString(),
        });
        callback();
      });
  };

  onClickChoice = (num) => {
    this.setState((prev) => {
      const next = prev;
      next.quizTemplate.quizes[prev.currentQuizNum].choiceNum =
        next.quizTemplate.quizes[prev.currentQuizNum].choiceNum === num ? null : num;
      return next;
    });
  };
  onClickPrev = () => {
    const prevNum = this.state.currentQuizNum - 1;
    if (prevNum >= 0) {
      this.setState({ currentQuizNum: prevNum });
    }
  };
  onClickNext = () => {
    const nextNum = this.state.currentQuizNum + 1;
    if (nextNum < this.state.quizTemplate.quizes.length) {
      this.setState({ currentQuizNum: nextNum });
    }
  };
  onClickSubmit = () => {
    this.updateMyQuiz(() => {
      showPopUp(<OneButtonPopUp title="제출했습니다" subtitle="정답을 확인해보세요" buttonName="확인" />, () => {
        this.props.dismiss();
      });
    });
  };

  render() {
    const { level, type } = this.props;
    const { quizTemplate, currentQuizNum } = this.state;
    const { completed, onClickChoice, onClickPrev, onClickNext, onClickSubmit } = this;

    const quizes = quizTemplate.quizes;
    const quiz = quizTemplate.quizes[currentQuizNum];
    const correct = quiz.choiceNum === quiz.answerNum;

    const title = `${level}단계 테스트${completed ? " 결과" : ""}`;
    let subtitles = [];
    if (completed) {
      subtitles =
        type === "python"
          ? [
              <span>
                총점 100점 중 <strong>{this.score.concept}점</strong>을 획득하였습니다.
              </span>,
            ]
          : [
              <span>
                총점 100점 중 <strong>{(this.score.api + this.score.concept) / 2}점</strong>을 획득하였습니다.
              </span>,
              <span>
                그 중 명령어 사용과 관련된 점수는 {this.score.apiTotal}점 중 <strong>{this.score.api}점</strong>,
              </span>,
              <span>
                개념 이해와 관련된 점수는 {this.score.conceptTotal}점 중 <strong>{this.score.concept}점</strong>을
                획득하였습니다.
              </span>,
            ];
    } else {
      subtitles = [
        `• ${level}-1차시~${level}-4차시 수업에서 배운 내용을 복습하며 퀴즈를 풀어봅시다.`,
        "• 질문에 해당하는 답을 직접 입력 혹은 보기에서 선택해주세요.",
        "• 모든 질문에 답한 후 '제출하기'버튼을 클릭하여 테스트를 제출해주세요.",
      ];
    }

    return (
      <div className="wizlivequiz">
        <div className="popup_header popup_header-wizlivequiz">{title}</div>
        <div className="wizlivequiz_subtitles">
          {subtitles.map((subtitle, index) => (
            <div key={index} className="wizlivequiz_subtitle">
              {subtitle}
            </div>
          ))}
        </div>
        <div className="wizlivequiz_progress">
          <div className="wizlivequiz_progress_back">
            <div
              className="wizlivequiz_progress_front"
              style={{
                width: `${((currentQuizNum + (quiz.choiceNum !== null ? 1 : 0)) / quizes.length) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="wizlivequiz_quiz">
          <div className="wizlivequiz_quiz_title">
            문제 {currentQuizNum + 1}
            {completed && (
              <div
                className={`wizlivequiz_quiz_result ${
                  correct ? "wizlivequiz_quiz_result-correct" : "wizlivequiz_quiz_result-incorrect"
                }`}
              >
                {correct ? "아주 멋져요!" : "조금만 더 생각해 볼까요?"}
              </div>
            )}
          </div>
          <div className="wizlivequiz_quiz_subtitle">{quiz.text}</div>
          {quiz.imgSrc && <img className="wizlivequiz_quiz_image" src={quiz.imgSrc} alt={currentQuizNum + 1} />}
          <div className="wizlivequiz_quiz_divider" />
          <div className="wizlivequiz_quiz_choices">
            {quiz.choices.map((choice, index) => {
              if (completed) {
                return (
                  <button
                    key={index}
                    className={`wizlivequiz_quiz_choice ${
                      quiz.answerNum === index + 1
                        ? "wizlivequiz_quiz_choice-correct"
                        : quiz.choiceNum === index + 1
                        ? "wizlivequiz_quiz_choice-incorrect"
                        : "wizlivequiz_quiz_choice-disable"
                    }`}
                  >
                    {choice}
                    {quiz.answerNum === index + 1 ? (
                      <img className="wizlivequiz_quiz_choice_img" src={correctImg} alt="correctImg" />
                    ) : (
                      quiz.choiceNum === index + 1 && (
                        <img className="wizlivequiz_quiz_choice_img" src={incorrectImg} alt="incorrectImg" />
                      )
                    )}
                  </button>
                );
              } else {
                const selected = quiz.choiceNum === index + 1;
                return (
                  <button
                    key={index}
                    className={`wizlivequiz_quiz_choice ${
                      selected ? "wizlivequiz_quiz_choice-selected" : "wizlivequiz_quiz_choice-normal"
                    }`}
                    onClick={() => {
                      onClickChoice(index + 1);
                    }}
                  >
                    {choice}
                    {selected && <img className="wizlivequiz_quiz_choice_img" src={checkImg} alt="checkImg" />}
                  </button>
                );
              }
            })}
          </div>
        </div>
        <div className="wizlivequiz_footer">
          {currentQuizNum !== 0 && (
            <button className="popup_button popup_button-cancel" onClick={onClickPrev}>
              이전
            </button>
          )}
          <button
            className={`popup_button ${quiz.choiceNum === null && !completed && "popup_button-disable"}`}
            onClick={() => {
              if (quiz.choiceNum === null && !completed) return;
              if (currentQuizNum + 1 === quizes.length) {
                if (completed) {
                  this.props.dismiss();
                } else {
                  onClickSubmit();
                }
              } else {
                onClickNext();
              }
            }}
          >
            {currentQuizNum + 1 === quizes.length ? (completed ? "닫기" : "제출하기") : "다음"}
          </button>
        </div>
      </div>
    );
  }
}

export default WizliveQuizPopUp;
