import React from "react";
const BASE_URL = "https://wizschool-python.s3.ap-northeast-2.amazonaws.com/images/lectures";
const announceBox = `${BASE_URL}/p_script_b.png`;
const commentBox = `${BASE_URL}/p_script_a_c.png`;
const caractorInfo = `${BASE_URL}/p_script_a_a.png`;
const hintBoard = `${BASE_URL}/p_board_a.png`;
const answerBoard = `${BASE_URL}/p_board_a.png`;
// const insertButton = `${BASE_URL}/button_input.png`;
// const insertButtonClick = `${BASE_URL}/button_input_click.png`;
const okButton = `${BASE_URL}/p_button_a.png`;
// const okButtonClick = `${BASE_URL}/p_button_a_click.png`;
const cancelButton = `${BASE_URL}/p_button_b.png`;
// const cancelButtonClick = `${BASE_URL}/p_button_b_click.png`;
const retryButton = `${BASE_URL}/p_button_c.png`;
// const retryButtonClick = `${BASE_URL}/p_button_c_click.png`;
const answerClear = `${BASE_URL}/clear.png`;
const success = `${BASE_URL}/success.png`;
const answerFail = `${BASE_URL}/fail.png`;
// const buttonFail = "https://wizschool-python.s3.ap-northeast-2.amazonaws.com/images/freeTrial/items/p_button_b.png";

const multiSuccess = `${BASE_URL}/button_complete_01.png`;

const handleAnnouncer = (startMissionScript, comment, fluidFontSize) => {
  if (comment === "") {
    return null;
  } else {
    return (
      <React.Fragment>
        <div
          className="AnnouncerBox"
          onClick={() => {
            startMissionScript();
          }}
        >
          <img src={announceBox} className="AnnouncerComment" alt="" />
          <div className="AnnouncerCommentText">
            <p className="text" style={{ fontSize: fluidFontSize - 1 }}>
              {" "}
              {comment}{" "}
            </p>
          </div>
        </div>
      </React.Fragment>
    );
  }
};

const handleCarracter = (
  startMissionScript,
  caracterName,
  comment,
  speaker,
  facial_Man,
  facial_Woman,
  fluidFontSize,
) => {
  return (
    <React.Fragment>
      <div
        className="characterBox"
        onClick={() => {
          startMissionScript();
        }}
      >
        <div className="characterCommentWrapper">
          <div className="characterCommentBox">
            <img className="characterInfo" src={caractorInfo} alt="" />
            {caracterName === "이선" && (
              <div className="Man">
                <p className="characterMan" style={{ backgroundPosition: facial_Man }} />
              </div>
            )}
            {caracterName === "파이" && (
              <div className="Woman">
                <p className="characterWoman" style={{ backgroundPosition: facial_Woman }} />
              </div>
            )}
            <span className="characterName" style={{ fontSize: fluidFontSize }}>
              {caracterName}
            </span>
            <img className="commentBox" src={commentBox} alt="" />
            <span className="characterComment" style={{ fontSize: fluidFontSize }}>
              {comment}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const handleHintObject = (
  hintBase,
  hintImg,
  hintText,
  handleMissionHint,
  fluidFontSize,
  handleInputAnswer,
  inputAnswer,
  fullScreenFlag,
  loopHint,
  answerMulti,
  inputAnswerMulti,
) => {
  return (
    <React.Fragment>
      <div className={fullScreenFlag ? "hintBoxFullScreen" : "hintBox"}>
        {!fullScreenFlag && (
          // <img className="hintBoard" src={hintBoard} alt="hintBoard" />
          <img className={answerMulti ? "hintBoardMulit" : "hintBoard"} src={hintBoard} alt="hintBoard" />
        )}
        {hintImg.includes(".mp4") ? (
          <video
            className={fullScreenFlag ? "hintImgFull" : answerMulti ? "himtImgMulti" : "hintImg"}
            src={hintBase + hintImg}
            alt="hintImg"
            autoPlay={true}
            loop={loopHint ? true : loopHint === undefined ? true : false}
          />
        ) : (
          <img
            className={fullScreenFlag ? "hintImgFull" : answerMulti ? "himtImgMulti" : "hintImg"}
            src={hintBase + hintImg}
            alt="hintImg"
          />
        )}
        <pre
          // className="hintText"
          className={answerMulti ? "hintTextMulti" : "hintText"}
          style={{ fontSize: fluidFontSize, margin: 0 }}
        >
          {hintText}
        </pre>
        {answerMulti ? (
          <div className="multiAnswerBox">
            {answerMulti.map((item, index) => {
              return (
                <div className="multiAnswerBoxInputList" key={index}>
                  <div className="multiAnswerBoxInput">
                    <input
                      placeholder={item.message}
                      // onChange={handleInputAnswer}
                      onChange={(e) => {
                        handleInputAnswer(e, index);
                      }}
                      style={{ fontSize: fluidFontSize - 2 }}
                      value={inputAnswerMulti[index] ? inputAnswerMulti[index].value : ""}
                      readOnly={inputAnswerMulti[index] ? inputAnswerMulti[index].status : false}
                    />
                  </div>
                  <div
                    className="multiAnswerBoxButton"
                    onClick={() => {
                      if (inputAnswerMulti[index]) {
                        if (!inputAnswerMulti[index].status && inputAnswerMulti[index].value !== "") {
                          handleMissionHint("checkAnswer", true, index);
                        }
                      }
                    }}
                  >
                    {inputAnswerMulti[index] ? (
                      inputAnswerMulti[index].status ? (
                        <img src={multiSuccess} alt="" />
                      ) : inputAnswerMulti[index].retry ? (
                        <img src={retryButton} alt="" />
                      ) : (
                        <img src={okButton} alt="" />
                      )
                    ) : (
                      <img src={okButton} alt="" />
                    )}

                    {/* <img src={okButton} style={{ border: "none" }} alt="" /> */}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="hintButtonBox">
            <div className="hintAnswerInput">
              <input
                placeholder="입력하세요"
                onChange={handleInputAnswer}
                style={{ fontSize: fluidFontSize - 2 }}
                value={inputAnswer}
              />
            </div>
            <div
              className="hintConfirmBtn"
              onClick={() => {
                handleMissionHint("checkAnswer");
              }}
            >
              <img src={okButton} style={{ border: "none" }} alt="" />
            </div>
          </div>
        )}
        {/* <div className="hintButtonBox">
          <div className="hintAnswerInput">
            <input
              placeholder="입력하세요"
              onChange={handleInputAnswer}
              style={{ fontSize: fluidFontSize - 2 }}
              value={inputAnswer}
            />
          </div>
          <div
            className="hintConfirmBtn"
            onClick={() => {
              handleMissionHint("checkAnswer");
            }}
          >
            <img src={okButton} style={{ border: "none" }} alt="" />
          </div>
        </div> */}
      </div>
    </React.Fragment>
  );
};

const handleAnswerInput = (inputMsg, handleInputAnswer, inputAnswer, handleMissionHint, fluidFontSize) => {
  return (
    <React.Fragment>
      <div className="answerBoardBox">
        <img src={answerBoard} alt="" />
        <p className="hintQuestionText" style={{ fontSize: fluidFontSize }}>
          "{inputMsg}"
        </p>
        <div className="hintAnswerInput">
          <input
            placeholder="입력하세요"
            onChange={handleInputAnswer}
            style={{ fontSize: fluidFontSize - 2 }}
            value={inputAnswer}
          />
        </div>
        <div
          className="hintCancleBtn"
          onClick={() => {
            handleMissionHint("cancelAnswer");
          }}
        >
          <img src={cancelButton} alt="" />
        </div>
        <div
          className="hintConfirmBtn"
          onClick={() => {
            handleMissionHint("checkAnswer");
          }}
        >
          <img src={okButton} style={{ border: "none" }} alt="" />
        </div>
      </div>
    </React.Fragment>
  );
};

const handleAnswerResult = (result, handleMissionHint, resultImg, showSuccess, fluidFontSize, nowMission) => {
  if (result) {
    if (!resultImg) {
      return (
        <React.Fragment>
          <div className="clearBox">
            <img className="clearImg" src={answerClear} alt="" />
          </div>
        </React.Fragment>
      );
    } else {
      if (resultImg.includes(".mp4")) {
        return (
          <React.Fragment>
            <div className="clearBox">
              <video className="clearImg" src={BASE_URL + "/" + resultImg} alt="" autoPlay={true} loop={false} />
              {showSuccess && (
                <div className="clearBox">
                  <img className="clearImg" src={success} alt="" />
                </div>
              )}
            </div>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <div className="clearBox">
              <img className="clearImg" src={BASE_URL + "/" + resultImg} alt="" />
              {showSuccess && (
                <div className="clearBox">
                  <img className="clearImg" src={success} alt="" />
                </div>
              )}
            </div>
          </React.Fragment>
        );
      }
    }
  } else {
    return (
      <React.Fragment>
        <div className="failBox">
          <img className="failImg" src={answerFail} alt="" />
          <div
            className="buttonFailBox"
            onClick={() => {
              handleMissionHint("retry");
            }}
          >
            <img className="buttonFail" src={retryButton} alt="" />
            {/* <span className="text" style={{ fontSize: fluidFontSize + 4 }}>
              RETRY
            </span> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
};

let timeOut = undefined;
const handleInterValHint = (startMissionScript, hintBase, hintImg, interValTime) => {
  if (!timeOut) timeOut = setTimeout(restartScript, interValTime);

  function restartScript() {
    timeOut = undefined;
    startMissionScript();
  }

  return (
    <React.Fragment>
      <div className="hintBox">
        <img className="hintBoard" src={hintBoard} alt="hintBoard" />
        <img className="hintImg" src={hintBase + hintImg} alt="hintImg" />
        <div className="hintButtonBox" />
      </div>
    </React.Fragment>
  );
};

const playBGM = (endMission, type) => {
  // let suspense = document.getElementById("bgm_suspense");
  // let mysterious = document.getElementById("bgm_misterious");
  // if (endMission) {
  //   mysterious.pause();
  //   mysterious.currentTime = 0;
  //   suspense.pause();
  //   suspense.currentTime = 0;
  // } else {
  //   if (type === "suspense") {
  //     if (mysterious.duration > 0 && !mysterious.paused) {
  //       mysterious.pause();
  //       mysterious.currentTime = 0;
  //     }
  //     if (suspense.duration > 0 && !suspense.paused) {
  //     } else {
  //       suspense.play();
  //     }
  //   } else if (type === "misterious") {
  //     if (suspense.duration > 0 && !suspense.paused) {
  //       suspense.pause();
  //       suspense.currentTime = 0;
  //     }
  //     if (mysterious.duration > 0 && !mysterious.paused) {
  //     } else {
  //       mysterious.play();
  //     }
  //   }
  // }
};

export default function (props) {
  const { fluidFontSize, nowMission, musicMuteFlag } = props;
  if (props.scriptInfo.speaker === "announcer") {
    if (!musicMuteFlag) playBGM(props.endMissions, "suspense");

    return handleAnnouncer(props.startMissionScript, props.scriptInfo.msg, fluidFontSize);
  } else if (props.scriptInfo.speaker === "caracter") {
    if (!musicMuteFlag) playBGM(props.endMissions, "suspense");
    return handleCarracter(
      props.startMissionScript,
      props.scriptInfo.speakerName,
      props.scriptInfo.msg,
      props.scriptInfo.speaker,
      props.scriptInfo.facial_Man,
      props.scriptInfo.facial_Woman,
      fluidFontSize,
    );
  } else if (props.scriptInfo.speaker === "hint") {
    if (!musicMuteFlag) playBGM(props.endMissions, "misterious");
    return handleHintObject(
      props.hintBase,
      props.scriptInfo.img,
      props.scriptInfo.msg,
      props.handleMissionHint,
      fluidFontSize,
      props.handleInputAnswer,
      props.inputAnswer,
      props.scriptInfo.fullScreen,
      props.scriptInfo.loopHint,
      props.scriptInfo.answerMulti,
      props.inputAnswerMulti,
    );
  } else if (props.scriptInfo.speaker === "answer_input") {
    if (!musicMuteFlag) playBGM(props.endMissions, "misterious");
    return handleAnswerInput(
      props.scriptInfo.inputMsg,
      props.handleInputAnswer,
      props.inputAnswer,
      props.handleMissionHint,
      fluidFontSize,
    );
  } else if (props.scriptInfo.speaker === "answer_result") {
    if (!musicMuteFlag) playBGM(props.endMissions, "misterious");
    return handleAnswerResult(
      props.scriptInfo.answer_result,
      props.handleMissionHint,
      props.scriptInfo.resultImg,
      props.scriptInfo.showSuccess,
      fluidFontSize,
      nowMission,
    );
  } else if (props.scriptInfo.speaker === "interValHint") {
    return handleInterValHint(
      props.startMissionScript,
      props.hintBase,
      props.scriptInfo.hint,
      props.scriptInfo.interValTime,
    );
  }
}
