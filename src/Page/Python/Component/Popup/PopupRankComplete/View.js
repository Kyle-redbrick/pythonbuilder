import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

export default function (props) {
  return (
    <div className="PopupRankComplete">
      <div className="PopupRankCompleteHeader">
        <div className="HeaderText">학습 만족도 평가 완료</div>
      </div>
      <div className="PopupRankCompleteContent">
        <div className="PopupRankCompleteInfo">
          <p>학습 만족도 평가를 완료하였습니다.</p>
          <p>24시간 이내에 학습평가를 확인할 수 있습니다.</p>
        </div>
        <Link to="/student">
          <button className="PopupRankCompleteButtonsOk">확인</button>
        </Link>
      </div>
    </div>
  );
}
