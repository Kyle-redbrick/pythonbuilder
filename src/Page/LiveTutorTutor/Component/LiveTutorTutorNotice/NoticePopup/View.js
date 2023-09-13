import React from "react";
import "./index.scss";

export default function View(props) {
  const {
    handleApplyButton,
    handleInputChange,
    handleDismissButton,
    level,
    time,
    applyPopupFlag,

    isValid,
  } = props;

  const validContent = !isValid ? <p className="NoticePopup--warning--message">정보를 빠짐없이 입력해주세요</p> : <p />;

  const content = applyPopupFlag ? (
    <div className="NoticePopupWrapper__inner">
      <p className="NoticePopup--Title">정규수업 실습 신청하기</p>

      <p className="NoticePopup--Subtitle">실습차시</p>
      <div className={`NoticePopup--inputWrapper`}>
        <input
          className="NoticePopup--input"
          type="text"
          placeholder="예) 1-1"
          value={level}
          name="level"
          onChange={handleInputChange}
        />
      </div>

      <p className="NoticePopup--Subtitle">희망일자 및 시간</p>
      <div className={`NoticePopup--inputWrapper`}>
        <input
          className="NoticePopup--input"
          type="text"
          placeholder="날짜와 시간대를 자유롭게 입력하세요"
          value={time}
          name="time"
          onChange={handleInputChange}
        />
      </div>

      {validContent}

      <div className="ApplyButtonWrapper">
        <button className="ApplyButton" onClick={handleApplyButton}>
          신청하기
        </button>
      </div>
    </div>
  ) : (
    <div className="NoticePopupWrapper__inner">
      <p className="NoticePopup--Title">신청이 완료되었습니다.</p>
      <div className="ApplyButtonWrapper">
        <button className="ApplyButton" onClick={handleDismissButton}>
          확인
        </button>
      </div>
    </div>
  );

  return (
    <div className="NoticePopup">
      <div className="NoticePopupWrapper">{content}</div>
    </div>
  );
}
