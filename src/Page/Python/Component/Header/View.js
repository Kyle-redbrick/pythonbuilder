import React from "react";
import LogoWizLive from "../../../../Image/python/logo.svg";
import helpImg from "../../../../Image/python/builder_header_tutorial.svg";
import darkModeImg from "../../../../Image/python/dark-mode.svg";
import timeIcon from "../../../../Image/python/time_icon.svg";
import timeIconWhite from "../../../../Image/python/time_icon_white.svg";

import "./index.scss";

export default function (props) {
  const { title, clientType, lectureTime, ScriptList, changeScripts, handlePopupShow, handleLectureTimer } = props;

  return (
    <div className="Header">
      {/* left */}
      <div className="HeaderLeft">
        <div className="HeaderProjectItems">
          <div className="HeaderProjectItem HeaderProjectName">
            <img style={{ marginRight: "13px" }} src={LogoWizLive} alt="logo" /> {title}
            {["tutorTraining", "pySpring"].includes(clientType) && ScriptList && (
              <select onChange={changeScripts} className="HeaderTrainingList">
                <option value="-1">연습차시를 선택하세요</option>
                {ScriptList.map(function (item, i) {
                  return (
                    <option key={i} value={i}>
                      {item.title}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* right */}
      <div className="HeaderRight">
        <div className="HeaderProjectItems">
          {clientType === "tutor" && (
            <div className="HeaderProjectTimeWrapper">
              <img src={timeIconWhite} alt="time" />

              <span>
                수업 시간&nbsp;
                {lectureTime.min < 10 ? `0${lectureTime.min}` : lectureTime.min}:
                {lectureTime.sec < 10 ? `0${lectureTime.sec}` : lectureTime.sec}
              </span>
            </div>
          )}

          <div className="HeaderProjectButtons">
            {clientType === "tutor" ? (
              <div
                className={lectureTime.status ? "HeaderProjectEndLesson" : "HeaderProjectEndLessonEnd"}
                onClick={() => {
                  lectureTime.status && handlePopupShow("endLecture");
                  lectureTime.status && handleLectureTimer(false);
                }}
              >
                수업 종료
              </div>
            ) : (
              <div className="HeaderProjectItemSave" style={{ display: "none" }}>
                <img src={timeIcon} alt="saved log" /> 저장 기록
              </div>
            )}
          </div>
          <div className="HeaderProjectItemSeperate" style={{ display: "none" }}>
            |
          </div>
          <div className="HeaderProjectItem" style={{ display: "none" }}>
            <img className="ThemeSwitch" src={darkModeImg} alt="theme change" />
          </div>
          <div className="HeaderProjectItem" style={{ display: "none" }}>
            <img className="HelpBUtton" src={helpImg} alt="helpImg" />
          </div>
          {/* {<div className="HeaderProjectItem" />} */}
        </div>
      </div>
    </div>
  );
}
