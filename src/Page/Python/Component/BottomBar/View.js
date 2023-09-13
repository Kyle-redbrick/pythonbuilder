import React from "react";
import "./index.scss";
import run_btn from "../../../../Image/python/run_btn.svg";
import Reset from "../../../../Image/python/reset_terminal.svg";
import Unfold from "../../../../Image/python/unfold.svg";
import fold from "../../../../Image/python/fold.svg";

import {
  NotificationContainer,
  // NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

export default function (props) {
  const { foldFlag, execFlag, terminalText, handleBottomButton, handleBottomFold } = props;

  return (
    <div className="Python__Bottombar" id="Python__Bottombar">
      <div className="Bottombar_MenuList">
        <div className="Menu_Title">
          <span className="Title_Text">실행결과</span>
        </div>
        <div>
          <NotificationContainer />
        </div>
        <div
          className="Menu_Execute"
          onClick={() => {
            handleBottomButton("exec");
          }}
        >
          <img className="Execute_img" src={run_btn} alt="img" />
          실행
        </div>
        <div
          className="Menu_Reset"
          onClick={() => {
            handleBottomButton("reset");
          }}
        >
          <img className="Reset_img" src={Reset} alt="reset" />
          초기화
        </div>
        <div className="Menu_Resize" id="Menu_Resize">
          {!foldFlag ? <span style={{ fontSize: "1.5em" }}>||</span> : null}
        </div>
        <div className="Menu_Fold">
          <img
            // src={Unfold}
            src={!foldFlag ? Unfold : fold}
            alt="fold"
            onClick={() => {
              handleBottomFold();
            }}
          />
        </div>
      </div>
      <div className="Bottombar_Result" id="Bottombar_Result">
        <pre className={execFlag ? "Result" : "Result_Default"}>{terminalText}</pre>
      </div>
    </div>
  );
}
