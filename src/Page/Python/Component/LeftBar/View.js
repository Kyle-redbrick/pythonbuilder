import React from "react";
import "./index.scss";
import ConvPointer from "../../../../Image/python/conv-pointer.svg";
import StudyPointer from "../../../../Image/python/study-pointer.svg";
import BackGround from "./background";
import Caracter from "./caracter";
import Item from "./item";
import ConvList from "./convList";

import ResultPopup from "./ResultPopup";

// const startImgDefault = "https://wizschool-python.s3.ap-northeast-2.amazonaws.com/images/freeTrial/background/p_start_default.png";
const loginIdle = "https://wizschool-python.s3.ap-northeast-2.amazonaws.com/images/lectures/splash_idle.mp4";
const loginClose = "https://wizschool-python.s3.ap-northeast-2.amazonaws.com/images/lectures/splash_setdown_b.mp4";
const fail = `https://wizschool-python.s3.ap-northeast-2.amazonaws.com/images/lectures/fail.png`;
export default function (props) {
  const {
    userType,
    // startImg,
    missionStart,
    nowMission,
    endMissions,
    nowScriptId,
    missionList,
    documentBase,
    backgroundBase,
    hintBase,
    scriptInfo,
    studyImages,
    convHistory,
    inputAnswer,
    inputAnswerMulti,
    tabMenu,
    musicMuteFlag,
    handleMissionList,
    startMissionScript,
    handleMissionData,
    handleMissionHint,
    handleInputAnswer,
    handleLeftTabMenu,
    handleHistoryList,
    handlePlaySound,
    fluidFontSize,
    // handleSaveLocalStorage,
    // handleRestoreLocalStorage,
    // handleStoryRestore,
    loginTry,
    loginResult,
    handleDemoLogin,
    handleLoginInfo,
    ShowResultPopup,
    ShowResultPopupValue,
  } = props;
  return (
    <div className="Python__Leftbar" id="Python__Leftbar">
      <div className="Leftbar_Story">
        <span className="Leftbar_Story_Text">스토리</span>
        {/* <button onClick={() => handleSaveLocalStorage(
          {
            musicMuteFlag,
            endMissions,
            tabMenu,
            startImg,
            missionStart,
            scriptInfo,
            nowMission,
            nowScriptId,
            missionList,
            studyImages,
            convHistory,
            inputAnswer
          }
        )} style={{widht: '10px', heigth: '10px'}}>save</button>
        <button onClick={() => {
          handleRestoreLocalStorage(handleStoryRestore);
        }} style={{widht: '10px', heigth: '10px'}}>restore</button> */}

        <div
          style={{
            position: "relative",
            width: "200px",
            float: "right",
            margin: "10px 0px 0px 0px",
            right: "5px",
          }}
        >
          <img
            src="https://wizschool-python.s3.ap-northeast-2.amazonaws.com/images/btn_mute.png"
            alt="mute"
            style={{ width: "50%", cursor: "pointer" }}
            onClick={() => handlePlaySound("mute")}
          />
          <img
            src="https://wizschool-python.s3.ap-northeast-2.amazonaws.com/images/btn_replay.png"
            alt="replay"
            style={{ width: "50%", cursor: "pointer" }}
            onClick={() => handlePlaySound("restart")}
          />
        </div>
        {userType !== "student" && missionList.length > 0 && (
          <React.Fragment>
            <div
              className="LeftBarSelectBox"
              onClick={(e) => {
                e.target.parentElement.classList.toggle("on");
              }}
            >
              {missionList &&
                missionList.map(function (item, i) {
                  return (
                    i === nowMission && (
                      <p className="selectedCategory" key={i}>
                        {i + 1}. {item.title}
                      </p>
                    )
                  );
                })}
              <span className="dropdownImg" />
              <ul className="categoryList">
                {missionList &&
                  missionList.map(function (item, i) {
                    return (
                      <li
                        key={i}
                        className={i === nowMission ? "category selected" : "category"}
                        onClick={(e) => {
                          document.getElementsByClassName("LeftBarSelectBox")[0].className = "LeftBarSelectBox";
                          handleMissionList(i);
                        }}
                      >
                        {i + 1}. {item.title}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </React.Fragment>
        )}
      </div>
      <div className="leftbar_Slider" id="leftbar_Slider">
        {missionStart ? (
          <React.Fragment>
            <BackGround scriptInfo={scriptInfo} backgroundBase={backgroundBase} />
            <Caracter
              userType={userType}
              hintBase={hintBase}
              startMissionScript={startMissionScript}
              scriptInfo={scriptInfo}
              inputAnswer={inputAnswer}
              inputAnswerMulti={inputAnswerMulti}
              handleMissionHint={handleMissionHint}
              handleInputAnswer={handleInputAnswer}
              fluidFontSize={fluidFontSize}
              nowMission={nowMission}
              endMissions={endMissions}
              musicMuteFlag={musicMuteFlag}
            />
            <Item scriptInfo={scriptInfo} handleMissionHint={handleMissionHint} />
            {ShowResultPopup && (
              <ResultPopup handleMissionHint={handleMissionHint} ShowResultPopupValue={ShowResultPopupValue} />
            )}
          </React.Fragment>
        ) : (
          <div className="videoBox">
            {!loginResult && <img className="loginFail" src={fail} alt="" />}
            {loginResult && (
              <video id="loginVideo" src={loginTry ? loginClose : loginIdle} autoPlay={true} loop={!loginTry} />
            )}
            {!loginTry && (
              <React.Fragment>
                <input
                  className="loginId"
                  type="text"
                  placeholder="ID"
                  onChange={(e) => {
                    handleLoginInfo(e, "id");
                  }}
                />
                <input
                  className="loginPw"
                  type="text"
                  placeholder="PWD"
                  onChange={(e) => {
                    handleLoginInfo(e, "pwd");
                  }}
                />
                <input type="button" className="loginBtn" onClick={() => handleDemoLogin()} />
              </React.Fragment>
            )}
          </div>
        )}
      </div>
      <div className="leftbar_Tabmenu">
        <div
          className={tabMenu === "document" ? "TabMenu1 active" : "TabMenu1"}
          onClick={() => {
            handleLeftTabMenu("document", userType);
          }}
        >
          <img style={{ marginRight: "9px", verticalAlign: "middle" }} src={StudyPointer} alt="" />
          학습자료
        </div>
        <div
          className={tabMenu === "history" ? "TabMenu2 active" : "TabMenu2"}
          onClick={() => {
            handleLeftTabMenu("history", userType);
          }}
        >
          <img style={{ marginRight: "9px", verticalAlign: "middle" }} src={ConvPointer} alt="" />
          대화기록
        </div>
      </div>
      <div className="TabTextBox" id="TabTextBox">
        <div className="TabText">
          {tabMenu === "document" &&
            studyImages.map(function (item, i) {
              return (
                <img
                  key={i}
                  src={documentBase + item.src}
                  alt=""
                  className={item.type === "data" ? "TabTextData" : "TabText"}
                  onClick={() => {
                    if (item.type === "data") handleMissionData(i);
                  }}
                />
              );
            })}
          {
            tabMenu === "history" && (
              <ConvList
                missionStart={missionStart}
                nowScriptId={nowScriptId}
                convHistory={convHistory}
                handleHistoryList={handleHistoryList}
                fluidFontSize={fluidFontSize}
              />
            )
            // convHistory.map(function(item, i) {
            //   return (
            //     <React.Fragment key={i}>
            //       <p
            //         onClick={() => {
            //           handleHIstoryList(i);
            //         }}
            //       >
            //         {item.msg}
            //       </p>
            //       {seperateLine()}
            //     </React.Fragment>
            //   );
            // })
          }
        </div>
      </div>
    </div>
  );
}
