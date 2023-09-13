import React, { Component } from "react";
import { connect } from "react-redux";
import View from "./View";
import * as socketUtil from "../util/pythonSocket";
import * as request from "../../../../Common/Util/HTTPRequest";
import * as userInfoAction from "../../../../Common/Store/Reducer/UserInfo";
class Container extends Component {
  constructor(props) {
    super(props);

    this.userType = props.userType; // userType (student or tutor)
    this.documentBase = ""; // study document image base url
    this.backgroundBase = ""; // slide background image base url
    this.hintBase = ""; // slide hint base url
    this.muteMusicNo = undefined;
    this.hintFlag = false;
    this._tempState = undefined;
    this.sendState = true;
    this.state = {
      musicMuteFlag: false,
      endMissions: false, // flag of mission summary
      tabMenu: "document", // left Tab  Menu (document or history)
      startImg: "", // default start Img
      missionStart: false, // mission auto start is false
      scriptInfo: null, // mission script list
      nowMission: 0, // now mission Id
      nowScriptId: 0, // now mission id
      missionList: [], // all mission list
      studyImages: [], // mission's study document
      convHistory: [], // mission's conversation history
      inputAnswer: "", // mission anser (user input)
      inputAnswerMulti: [], // mission anser is mulit (user input)
      currentState: {},
      loginTry: false,
      loginResult: true,
      demoId: "",
      demoPwd: "",
      ShowResultPopup: false,
      ShowResultPopupValue: false,
    };
  }

  componentWillUpdate() {}

  async componentWillMount() {
    if (this.props.userType === "tutorTraining" || this.props.userType === "pySpring") {
      // tempScripts[this.props.reservationId]
      //   ? (this.Scripts = tempScripts[this.props.reservationId])
      //   : alert("유효하지 않은 url입니다.");
    } else {
      const liveTutorRoom = await request
        .getLiveTutorRoomId({ email: this.props.email })
        .then((res) => res.json())
        .then((json) => {
          this.props.updateUserInfo({
            userEmail: json.studentEmail,
            tutorEmail: json.tutorEmail,
            subjectTitle: json.myLecture.lecture.title,
          });

          return json;
        });
      if (liveTutorRoom && liveTutorRoom.roomId) {
        this.Scripts = JSON.parse(liveTutorRoom.myLecture.lecture.state);
      }
    }

    if (!this.Scripts) return;

    const { documentBaseUrl, backgroundBaseUrl, hintBaseUrl, startImg, missions } = this.Scripts;

    this.documentBase = documentBaseUrl;
    this.backgroundBase = backgroundBaseUrl;
    this.hintBase = hintBaseUrl;
    this.setState({
      startImg: startImg,
      missionList: missions,
      studyImages: missions[0].docs,
      convHistory: missions[0].scripts,
    });
  }

  componentDidMount() {
    // Slide Sync Socket
    socketUtil.socket.on("syncSlider", (data) => {
      if (data.demoLogin) {
        this.handleDemoLogin(false);
      } else {
        if (!data.hintFlag) {
          this.setState({
            missionStart: data.missionStart,
            scriptInfo: this.Scripts.missions[data.missionIdx].scripts[data.scriptIdx],
            nowScriptId: data.scriptIdx,
          });
        } else {
          this.setState({
            missionStart: data.missionStart,
            scriptInfo: this.Scripts.missions[data.missionIdx].hints[0],
            nowScriptId: data.scriptIdx,
          });
        }
      }
    });

    // Slide Mission Hint Sync
    socketUtil.socket.on("syncHandleMissionHint", (data) => {
      if (data.includes("|||")) {
        this.handleMissionHint(data.split("|||")[0], false, parseInt(data.split("|||")[1]));
      } else {
        this.handleMissionHint(data, false);
      }
    });

    // Slide Mission Answer Sync
    socketUtil.socket.on("syncHandleMissionAnswer", (data) => {
      const { idx, value } = data;
      if (idx !== "") {
        const { missions } = this.Scripts;
        const { inputAnswerMulti, nowMission } = this.state;
        if (missions[nowMission].isAnswerMulti) {
          // let inputValue = [];
          let inputValue = inputAnswerMulti;

          if (inputAnswerMulti.length === 0) {
            inputValue.push({ value: value, status: false, retry: false });
          } else {
            if (inputValue[idx]) {
              inputValue[idx].value = value;
            } else {
              inputValue.push({ value: value, status: false });
            }
          }
          this.setState({ inputAnswerMulti: inputValue });
        } else {
          this.setState({ inputAnswer: value });
        }
      } else {
        this.setState({ inputAnswer: value });
      }

      // this.setState({ inputAnswer: data });
    });

    // Mission Template Select Sync
    socketUtil.socket.on("syncMissionTemplate", (data) => {
      this.handleMissionList(data, false);
    });

    // Left Tab Menu Select Sync
    socketUtil.socket.on("syncLeftTabMenu", (data) => {
      this.handleLeftTabMenu(data, "tutor", false);
    });

    // ConvList Active Sync
    socketUtil.socket.on("syncConvList", (data) => {
      this.handleHistoryList(data, false);
    });

    socketUtil.socket.on("startVideoRecord", (data) => {
      if (window.location.hostname === "wizlive.com" || window.location.hostname === "dev.wizlive.com") {
        if (this.sendState) {
          socketUtil.sendJanusSocket({
            reservationId: this.props.reservationId,
            state: { nowState: this.Scripts },
          });
          this.sendState = false;
        }

        // if (this.userType === "student") {
        setInterval(async () => {
          let newTempState = {
            missionStart: this.state.missionStart,
            nowMission: this.state.nowMission,
            nowScriptId: this.state.nowScriptId,
            endMissions: this.state.endMissions,
            tabMenu: this.state.tabMenu,
            hintFlag: this.hintFlag,
            code: window.ace.edit("Python__Editor").getValue(),
            scriptInfo: this.state.scriptInfo,
          };

          let sendFlag = false;
          if (this._tempState === undefined) {
            sendFlag = true;
            this._tempState = newTempState;
          } else {
            if (JSON.stringify(this._tempState) !== JSON.stringify(newTempState)) {
              sendFlag = true;
              this._tempState = newTempState;
            }
          }

          if (sendFlag) {
            socketUtil.sendJanusSocket({
              reservationId: this.props.reservationId,
              state: newTempState,
            });
          }
        }, 5000);
        // }
      }
    });
  }

  componentDidUpdate() {
    if (this.props.trainingScript) this.changeTrainingScript();
    if (this.state.musicMuteFlag) return;
    if (this.state.scriptInfo === null) return;

    let engineering = document.getElementById("bgm_engineering");
    let brainteaser = document.getElementById("bgm_brainteaser");
    let upbeatcorporation = document.getElementById("bgm_upbeatcorporation");

    if (this.state.endMissions) {
      muteBgm("ALL");
    } else if (this.state.scriptInfo.speaker === "answer_input") {
      muteBgm("ALL");
    } else {
      muteBgm(this.state.scriptInfo.bgm);
      if (this.state.scriptInfo.answer_result || this.state.scriptInfo.endBgm) {
        if (this.state.scriptInfo.endBgm) {
          brainteaser.play();
        }
      } else {
        if (this.state.scriptInfo.bgm === "Engineering") {
          engineering.play();
        } else if (this.state.scriptInfo.bgm === "brainTeaser") {
          brainteaser.play();
        } else if (this.state.scriptInfo.bgm === "upbeatcorporation") {
          upbeatcorporation.play();
        }
      }
    }

    function muteBgm(muteType) {
      switch (muteType) {
        case "ALL":
          if (engineering.duration > 0 && !engineering.paused) {
            engineering.pause();
            engineering.currentTime = 0;
          }
          if (brainteaser.duration > 0 && !brainteaser.paused) {
            brainteaser.pause();
            brainteaser.currentTime = 0;
          }

          if (upbeatcorporation.duration > 0 && !upbeatcorporation.paused) {
            upbeatcorporation.pause();
            upbeatcorporation.currentTime = 0;
          }
          break;
        case "Engineering":
          if (brainteaser.duration > 0 && !brainteaser.paused) {
            brainteaser.pause();
            brainteaser.currentTime = 0;
          }

          if (upbeatcorporation.duration > 0 && !upbeatcorporation.paused) {
            upbeatcorporation.pause();
            upbeatcorporation.currentTime = 0;
          }
          break;
        case "brainTeaser":
          if (engineering.duration > 0 && !engineering.paused) {
            engineering.pause();
            engineering.currentTime = 0;
          }

          if (upbeatcorporation.duration > 0 && !upbeatcorporation.paused) {
            upbeatcorporation.pause();
            upbeatcorporation.currentTime = 0;
          }
          break;
        case "upbeatcorporation":
          if (engineering.duration > 0 && !engineering.paused) {
            engineering.pause();
            engineering.currentTime = 0;
          }

          if (brainteaser.duration > 0 && !brainteaser.paused) {
            brainteaser.pause();
            brainteaser.currentTime = 0;
          }
          break;
        default:
          break;
      }
    }
  }

  // Misstion Template Select Handler
  handleMissionList = (targetIdx, syncFlag = true) => {
    if (targetIdx === this.Scripts.missions.length - 1) {
      this.setState({
        endMissions: true,
        tabMenu: "document",
        nowMission: targetIdx,
        studyImages: this.Scripts.missions[targetIdx].docs,
        convHistory: this.Scripts.missions[targetIdx].scripts,
        inputAnswer: "",
      });
    } else {
      this.setState({
        endMissions: false,
        tabMenu: "document",
        nowMission: targetIdx,
        missionStart: true,
        nowScriptId: 0,
        studyImages: this.Scripts.missions[targetIdx].docs,
        convHistory: this.Scripts.missions[targetIdx].scripts,
        scriptInfo: this.Scripts.missions[targetIdx].scripts[0],
        inputAnswer: "",
      });
    }

    if (syncFlag) socketUtil.sendSocket("syncMissionTemplate", targetIdx);
  };

  // Mission Slide Handler (next Script)
  startMissionScript = async () => {
    const { endMissions, missionStart, nowScriptId, nowMission } = this.state;
    if (!this.Scripts) return;
    if (endMissions) return;

    let nextId = 0;
    this.hintFlag = false;

    if (missionStart) {
      nextId = nowScriptId + 1;

      if (this.Scripts.missions[nowMission].scripts[nowScriptId].hintIcon) return;

      if (nextId < this.Scripts.missions[nowMission].scripts.length) {
        if (this.Scripts.missions[nowMission].scripts[nextId].hintIcon) {
          this.handlePlaySound("showHintObj");
        }

        this.setState({
          missionStart: true,
          scriptInfo: this.Scripts.missions[nowMission].scripts[nextId],
          nowScriptId: nextId,
        });
      } else {
        this.hintFlag = true;
        this.setState({
          scriptInfo: this.Scripts.missions[nowMission].hints[0],
        });
      }
    } else {
      if (nowMission === 0 && this.userType === "student") return;
      this.setState({
        missionStart: true,
        scriptInfo: this.Scripts.missions[nowMission].scripts[nowScriptId],
      });
    }

    socketUtil.sendSocket("syncSlider", {
      missionStart: true,
      hintFlag: this.hintFlag,
      missionIdx: nowMission,
      scriptIdx: nextId,
    });
  };

  // Mission Hint Handler
  handleMissionHint = (type, syncFlag = true, answerIndex) => {
    const { scriptInfo, nowMission, inputAnswer, inputAnswerMulti } = this.state;
    let _script = scriptInfo;
    let _showResultPopup = false;
    let _showResultPopupValue = false;
    let _userInputAnswer = inputAnswerMulti;

    if (type === "showHint") {
      const { missions } = this.Scripts;
      this.handlePlaySound(type);

      _script = this.Scripts.missions[nowMission].hints[0];
      // if (missions[nowMission].isAnswerMulti)
      //   _script.answerMulti = missions[nowMission].answer;

      if (missions[nowMission].isAnswerMulti) {
        _script.answerMulti = missions[nowMission].answer;
        if (_userInputAnswer.length === 0) {
          for (let i = 0; i < _script.answerMulti.length; i++) {
            _userInputAnswer.push({
              value: "",
              answer: _script.answerMulti[i].answer,
              message: _script.answerMulti[i].message,
              status: false,
              retry: false,
            });
          }
        }
      }
      // inputAnswerMulti
    } else if (type === "showAnswerInput") {
      // this.handlePlaySound(type);
      _script.speaker = "answer_input";
    } else if (type === "cancelAnswer") {
      this.handlePlaySound(type);
      _script.speaker = "hint";
    } else if (type === "checkAnswer") {
      type += `|||${answerIndex}`;
      let answerFlag;
      this.handlePlaySound("clickButton");
      // _script.speaker = "answer_result";

      const { missions } = this.Scripts;

      if (missions[nowMission].isAnswerMulti) {
        const { value, answer } = inputAnswerMulti[answerIndex];

        let _answer = answer.replaceAll("{", "").replaceAll("}", "").replaceAll(" ", "").split(",").sort().join();

        let _value = value.replaceAll("{", "").replaceAll("}", "").replaceAll(" ", "").split(",").sort().join();

        // console.log(_answer);
        // console.log(_value);

        if (_value === _answer) {
          inputAnswerMulti[answerIndex].status = true;
        } else {
          inputAnswerMulti[answerIndex].retry = true;
        }
        _showResultPopupValue = inputAnswerMulti[answerIndex].status;

        let multiSuccess = true;
        if (inputAnswerMulti.length === missions[nowMission].answer.length) {
          inputAnswerMulti.map((inputAnswer) => {
            if (!inputAnswer.status) {
              multiSuccess = false;
            }
          });
        } else {
          multiSuccess = false;
        }

        if (multiSuccess) {
          _script.speaker = "answer_result";
          _script.answer_result = true;
        }
        _showResultPopup = true;
      } else {
        _script.speaker = "answer_result";
        if (Array.isArray(this.Scripts.missions[nowMission].answer)) {
          let _answer = this.Scripts.missions[nowMission].answer.map((item) => {
            return item.toLowerCase();
          });

          answerFlag = _answer.includes(inputAnswer.toLowerCase());
        } else {
          answerFlag = inputAnswer.toLowerCase() === this.Scripts.missions[nowMission].answer.toLowerCase();
        }

        if (answerFlag) {
          this.handlePlaySound("success");
          _script.answer_result = true;
        } else {
          this.handlePlaySound("fail");
          _script.answer_result = false;
        }
      }
    } else if (type === "retry") {
      this.handlePlaySound("clickButton");
      _script.speaker = "hint";
    } else if (type === "closePopup") {
      // default is colose
    }

    if (syncFlag) socketUtil.sendSocket("syncHandleMissionHint", type);

    this.setState({
      scriptInfo: _script,
      ShowResultPopup: _showResultPopup,
      ShowResultPopupValue: _showResultPopupValue,
      inputAnswerMulti: _userInputAnswer,
    });
  };

  // Mission Answer Input Handler
  handleInputAnswer = (e, idx) => {
    const { missions } = this.Scripts;
    const { inputAnswerMulti, nowMission } = this.state;
    if (missions[nowMission].isAnswerMulti) {
      let _userInputAnswer = [];
      if (inputAnswerMulti.length === 0) {
        _userInputAnswer.push({
          value: e.target.value,
          status: false,
          retry: false,
        });
      } else {
        _userInputAnswer = inputAnswerMulti;
        _userInputAnswer[idx].value = e.target.value;
        // if (_userInputAnswer[idx]) {
        //   _userInputAnswer[idx].value = e.target.value;
        // } else {
        //   _userInputAnswer.push({ value: e.target.value, status: false });
        // }
      }

      this.setState({ inputAnswerMulti: _userInputAnswer });
    } else {
      this.setState({ inputAnswer: e.target.value });
    }
    socketUtil.sendSocket("syncHandleMissionAnswer", {
      idx: idx,
      value: e.target.value,
    });
  };

  // Mission Study Document Copy
  handleMissionData = (idx) => {
    const { studyImages } = this.state;
    const textarea = document.createElement("textarea");
    textarea.value = studyImages[idx].data;

    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 9999); // 추가

    const result = document.execCommand("copy");
    if (result) alert("복사되었습니다.");
    document.body.removeChild(textarea);
  };

  // Left Tab Menu Click Handler
  handleLeftTabMenu = (type, userType, syncFlag = true) => {
    if (userType !== "tutor" && userType !== "tutorTraining" && userType !== "pySpring") return;
    this.setState({ tabMenu: type });
    if (syncFlag) socketUtil.sendSocket("syncLeftTabMenu", type);
  };

  // History List Click Handler
  handleHistoryList = (idx, syncFlag = true) => {
    const { nowMission } = this.state;

    this.setState({
      missionStart: true,
      scriptInfo: this.Scripts.missions[nowMission].scripts[idx],
      nowScriptId: idx,
    });

    if (syncFlag) socketUtil.sendSocket("syncConvList", idx);
  };

  handleDemoLogin = (syncFlag = true) => {
    if (!syncFlag) {
      this.setState({ loginTry: true, loginResult: true });
      document.getElementById("loginVideo").onended = (event) => {
        this.startMissionScript();
      };

      return;
    }
    if (this.state.demoId === this.Scripts.demoId && this.state.demoPwd === this.Scripts.demoPwd) {
      if (syncFlag)
        socketUtil.sendSocket("syncSlider", {
          demoLogin: true,
        });

      this.setState({ loginTry: true, loginResult: true });
      document.getElementById("loginVideo").onended = (event) => {
        this.startMissionScript();
      };
    } else {
      this.setState({ loginTry: true, loginResult: false });

      setTimeout(() => {
        this.setState({ loginResult: true, loginTry: false });
      }, 2000);
    }
  };

  handleLoginInfo = (e, type) => {
    if (type === "id") {
      this.setState({ demoId: e.target.value });
    } else if (type === "pwd") {
      this.setState({ demoPwd: e.target.value });
    }
  };

  // play sound
  handlePlaySound = (type) => {
    let effect = undefined;
    let engineering = document.getElementById("bgm_engineering");
    let brainteaser = document.getElementById("bgm_brainteaser");
    let upbeatcorporation = document.getElementById("bgm_upbeatcorporation");
    switch (type) {
      case "showHintObj":
        // hint obj를 보여줄때
        effect = new Audio("https://wizschool-python.s3.ap-northeast-2.amazonaws.com/sounds/futuristicbutton_a_2.mp3");
        break;
      case "showHint":
        // hint 삽화 보여줄때
        effect = new Audio("https://wizschool-python.s3.ap-northeast-2.amazonaws.com/sounds/sweepnext_2.mp3");
        break;
      case "cancelAnswer":
        // hint 삽화 보여줄때
        effect = new Audio("https://wizschool-python.s3.ap-northeast-2.amazonaws.com/sounds/sweepnext_2.mp3");
        break;
      case "success":
        // 정답 성공
        effect = new Audio("https://wizschool-python.s3.ap-northeast-2.amazonaws.com/sounds/futuristicelectro_2.mp3");
        break;
      case "fail":
        // 정답실패
        effect = new Audio("https://wizschool-python.s3.ap-northeast-2.amazonaws.com/sounds/magneticair_2.mp3");
        break;
      case "clickButton":
        // 버튼 클릭 default
        effect = new Audio("https://wizschool-python.s3.ap-northeast-2.amazonaws.com/sounds/futuristicbutton_b_2.mp3");
        break;
      case "mute":
        // mute music
        if (engineering.duration > 0 && !engineering.paused) {
          engineering.pause();
          this.muteMusicNo = "engineering";
        }

        if (brainteaser.duration > 0 && !brainteaser.paused) {
          brainteaser.pause();
          this.muteMusicNo = "brainteaser";
        }

        if (upbeatcorporation.duration > 0 && !upbeatcorporation.paused) {
          upbeatcorporation.pause();
          this.muteMusicNo = "upbeatcorporation";
        }
        this.setState({ musicMuteFlag: true });
        break;
      case "restart":
        // restart music
        if (this.muteMusicNo === "engineering") {
          engineering.play();
        } else if (this.muteMusicNo === "brainteaser") {
          brainteaser.play();
        } else if (this.muteMusicNo === "upbeatcorporation") {
          upbeatcorporation.play();
        }
        this.setState({ musicMuteFlag: false });
        break;
      default:
        break;
    }

    if (effect) {
      effect.pause();
      effect.currentTime = 0;
      effect.play();
    }
  };

  handleStoryRestore = (storyData) => {
    if (storyData) {
      this.setState({
        musicMuteFlag: storyData.musicMuteFlag,
        endMissions: storyData.endMissions,
        tabMenu: storyData.tabMenu,
        startImg: storyData.startImg,
        missionStart: storyData.missionStart,
        scriptInfo: storyData.scriptInfo,
        nowMission: storyData.nowMission,
        nowScriptId: storyData.nowScriptId,
        missionList: storyData.missionList,
        studyImages: storyData.studyImages,
        convHistory: storyData.convHistory,
        inputAnswer: storyData.inputAnswer,
      });
    }
  };

  changeTrainingScript = () => {
    if (!this.props.trainingScript) return;

    if (JSON.stringify(this.props.trainingScript) === JSON.stringify(this.Scripts)) return;

    this.Scripts = this.props.trainingScript;
    this.documentBase = this.Scripts.documentBaseUrl;
    this.backgroundBase = this.Scripts.backgroundBaseUrl;
    this.hintBase = this.Scripts.hintBaseUrl;

    this.setState({
      musicMuteFlag: false,
      endMissions: false, // flag of mission summary
      tabMenu: "document", // left Tab  Menu (document or history)
      startImg: this.Scripts.startImg, // default start Img
      missionStart: false, // mission auto start is false
      scriptInfo: null, // mission script list
      nowMission: 0, // now mission Id
      nowScriptId: 0, // now mission id
      missionList: this.Scripts.missions, // all mission list
      studyImages: this.Scripts.missions[0].docs, // mission's study document
      convHistory: this.Scripts.missions[0].scripts, // mission's conversation history
      inputAnswer: "", // mission anser (user input)
      inputAnswerMulti: [],
      currentState: {},
      loginTry: false,
      loginResult: true,
      demoId: "",
      demoPwd: "",
    });
  };

  render() {
    const { fluidFontSize, handleSaveLocalStorage, handleRestoreLocalStorage } = this.props;
    const {
      startImg,
      missionStart,
      endMissions,
      nowMission,
      nowScriptId,
      missionList,
      scriptInfo,
      studyImages,
      convHistory,
      inputAnswer,
      inputAnswerMulti,
      tabMenu,
      musicMuteFlag,
      loginTry,
      loginResult,
      ShowResultPopup,
      ShowResultPopupValue,
    } = this.state;
    const {
      documentBase,
      backgroundBase,
      hintBase,
      handleMissionList,
      startMissionScript,
      handleMissionData,
      handleMissionHint,
      handleInputAnswer,
      handleLeftTabMenu,
      handleHistoryList,
      handlePlaySound,
      handleStoryRestore,
      handleDemoLogin,
      handleLoginInfo,
    } = this;
    return (
      <View
        userType={this.props.userType}
        startImg={startImg}
        missionStart={missionStart}
        endMissions={endMissions}
        nowMission={nowMission}
        nowScriptId={nowScriptId}
        missionList={missionList}
        documentBase={documentBase}
        backgroundBase={backgroundBase}
        hintBase={hintBase}
        scriptInfo={scriptInfo}
        studyImages={studyImages}
        convHistory={convHistory}
        inputAnswer={inputAnswer}
        inputAnswerMulti={inputAnswerMulti}
        tabMenu={tabMenu}
        musicMuteFlag={musicMuteFlag}
        fluidFontSize={fluidFontSize}
        handleMissionList={handleMissionList}
        startMissionScript={startMissionScript}
        handleMissionData={handleMissionData}
        handleMissionHint={handleMissionHint}
        handleInputAnswer={handleInputAnswer}
        handleLeftTabMenu={handleLeftTabMenu}
        handleHistoryList={handleHistoryList}
        handlePlaySound={handlePlaySound}
        handleSaveLocalStorage={handleSaveLocalStorage}
        handleRestoreLocalStorage={handleRestoreLocalStorage}
        handleStoryRestore={handleStoryRestore}
        loginTry={loginTry}
        loginResult={loginResult}
        handleDemoLogin={handleDemoLogin}
        handleLoginInfo={handleLoginInfo}
        ShowResultPopup={ShowResultPopup}
        ShowResultPopupValue={ShowResultPopupValue}
      />
    );
  }
}

export default connect(
  (state) => ({
    email: state.userinfo.email,
  }),
  {
    updateUserInfo: userInfoAction.updateUserInfo,
  },
)(Container);
