import React from "react";
const BASE_URL = "https://wizschool-python.s3.ap-northeast-2.amazonaws.com/images/lectures";
const hintBoard = `${BASE_URL}/p_board_a.png`;
const okButton = `${BASE_URL}/p_button_a.png`;
const success = `${BASE_URL}/success.png`;
const answerFail = `${BASE_URL}/fail.png`;

export default function (props) {
  const { handleMissionHint, ShowResultPopupValue } = props;
  let showImg;

  if (ShowResultPopupValue) {
    showImg = success;
  } else {
    showImg = answerFail;
  }
  return (
    <div className="resultBox">
      <img className="resultBoxBoard" src={hintBoard} alt="hintBoard" />
      <img className="resultImage" src={showImg} alt="" />
      <div className="resultBoxBtn">
        <img
          src={okButton}
          alt=""
          onClick={() => {
            handleMissionHint("");
          }}
        />
      </div>
    </div>
  );
}
