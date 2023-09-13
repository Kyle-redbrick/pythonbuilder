import React from "react";
import "./index.scss";
import ConvPointer from "../../../../Image/python/conv-pointer.svg";
import StudyPointer from "../../../../Image/python/study-pointer.svg";
import arrowLeft from "../../../../Image/arrow-left.png";
import arrowRight from "../../../../Image/arrow-right.png";

export default function (props) {
  const { userType, tabMenu, studyIdx, studyList, handleLeftTabMenu, handleStudyIdx } = props;

  return (
    <div className="Python__Leftbar" id="Python__Leftbar">
      <div className="Leftbar_Story">
        <span className="Leftbar_Story_Text">미션 해결</span>
      </div>
      <div className="leftbar_Slider" id="leftbar_Slider">
        <div className="review_Content">
          {studyList.map((item, i) => {
            if (i === studyIdx) {
              return (
                <div key={i} className="review_TextArea">
                  <div key={i} dangerouslySetInnerHTML={{ __html: item.content }}></div>
                </div>
              );
            } else {
              return <></>;
            }
          })}
          <div className="review_ArrowArea">
            {studyIdx !== 0 && (
              <img
                className="review_leftArrow"
                src={arrowLeft}
                onClick={() => {
                  handleStudyIdx("down");
                }}
                alt="down"
              />
            )}
            <span className="review_StudyPosition">
              {studyIdx + 1}/{studyList.length}
            </span>
            {studyIdx !== studyList.length - 1 && (
              <img
                className="review_rightArrow"
                src={arrowRight}
                onClick={() => {
                  handleStudyIdx("up");
                }}
                alt="up"
              />
            )}
          </div>
        </div>
      </div>
      <div className="leftbar_Tabmenu">
        <div
          className={tabMenu === "hints" ? "TabMenu1 active" : "TabMenu1"}
          onClick={() => {
            handleLeftTabMenu("hints", userType);
          }}
        >
          <img className="review_hintButton" src={StudyPointer} alt="" />
          힌트
        </div>
        <div
          className={tabMenu === "answer" ? "TabMenu2 active" : "TabMenu2"}
          onClick={() => {
            handleLeftTabMenu("answer", userType);
          }}
        >
          <img className="review_answerButton" src={ConvPointer} alt="" />
          모범답안
        </div>
      </div>
      <div className="TabTextBox" id="TabTextBox">
        <div className="TabText">
          {tabMenu === "hints" &&
            studyList.map((item, i) => {
              if (i === studyIdx) {
                return (
                  // <pre key={i} className="review_HintText">
                  //   {item.hint}
                  // </pre>
                  <div key={i} className="review_HintText" dangerouslySetInnerHTML={{ __html: item.hint }}></div>
                );
              } else {
                return <></>;
              }
            })}
          {tabMenu === "answer" &&
            studyList.map((item, i) => {
              if (i === studyIdx) {
                return (
                  // <pre key={i} className="review_AnswerText">
                  //   {item.answer}
                  // </pre>
                  <div key={i} className="review_AnswerText" dangerouslySetInnerHTML={{ __html: item.answer }}></div>
                );
              } else {
                return <></>;
              }
            })}
        </div>
      </div>
    </div>
  );
}
