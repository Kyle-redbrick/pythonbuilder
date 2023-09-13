import React from "react";
import "./index.scss";

export default function (props) {
  const { changeRateTutor, hoverRateTutor, hoverOutRateTutor, handleComments, handleSubmit, completeBtn } = props;

  return (
    <div className="RatingLessonPopup">
      <div className="RatingLessonPopupHeader">
        <div className="HeaderText">학습 만족도 평가</div>
      </div>
      <div className="RatingLessonPopupQuestions">
        <div className="QuestionOne">
          <div className="QuestionTitle requiredQuestion">오늘 함께한 튜터는 어땠나요?</div>
          <div className="RatingTutor">
            <span className="RateArea">
              {[1, 2, 3, 4, 5].map((item, index) => {
                return (
                  <span
                    key={index}
                    className="star normal"
                    onClick={(e) => changeRateTutor(e)}
                    onMouseOver={(e) => {
                      hoverRateTutor(e);
                    }}
                    onMouseOut={(e) => {
                      hoverOutRateTutor(e);
                    }}
                    value={item}
                  />
                );
              })}
            </span>
          </div>
        </div>
        <div className="QuestionTwo">
          <div className="QuestionTitle requiredQuestion">튜터에게 전하고 싶은 말을 작성해주세요.</div>
          <div>
            <textarea
              className="RatingLessonPopupInput reviewForTutor noresize"
              placeholder="ex) 오늘 수업 재미있었어요! &#13;&#10;다음에 또 같이 수업하고 싶어요!"
              onChange={(e) => handleComments("tutor", e.target.value)}
            />
          </div>
        </div>
        <div className="QuestionThree">
          <div className="QuestionTitle">위즈라이브에 남기고 싶은 말을 작성해주세요.</div>
          <div>
            <textarea
              className="RatingLessonPopupInput reviewForWizlive noresize"
              placeholder="작성한 내용은 튜터에게 공개되지 않습니다."
              onChange={(e) => handleComments("wizlive", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div
        className="RatingLessonPopupButton"
        onClick={() => {
          handleSubmit();
        }}
      >
        <button className={completeBtn ? "RatingLessonPopupButtonSubmitComplete" : "RatingLessonPopupButtonSubmit"}>
          제출하기
        </button>
      </div>
    </div>
  );
}
