import React from "react";
import "./index.scss";

export default function (props) {
  const { lectureTime, handlePopupShow, handleLectureTimer, handleCompleteReservation } = props;
  return (
    <div className="PopupLessonEnd">
      <div className="PopupLessonEndHeader">
        <div className="HeaderText">수업 종료</div>
      </div>
      <div className="PopupLessonEndContent">
        <div className="PopupLessonEndInfo">
          <p>
            오늘의 수업시간은 {lectureTime.min}분 {lectureTime.sec}초 입니다.
          </p>
          <p>수업을 종료하시겠습니까?</p>
        </div>
        <div className="PopupLessonEndButtons">
          <div
            className="PopupLessonEndButton1"
            onClick={() => {
              handlePopupShow("endLectureConfirm", true);
              handleCompleteReservation();
            }}
          >
            <button className="PopupLessonEndButton end">종료</button>
          </div>
          <div
            className="PopupLessonEndButton2"
            onClick={() => {
              handlePopupShow("endLectureConfirm", false);
              handleLectureTimer(true);
            }}
          >
            <button className="PopupLessonEndButton cancle">취소</button>
          </div>
        </div>
      </div>
    </div>
  );
}
