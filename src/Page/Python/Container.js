import React, { Component } from "react";
import { connect } from "react-redux";
import * as request from "../../Common/Util/HTTPRequest";
import * as socketUtil from "./Component/util/pythonSocket";
import * as TrackingUtil from "../../Common/Util/TrackingUtil";
import View from "./View";
import DefaultEmptyBoardImg from "../../Image/python/board_empty_img.png";
import { AGORA_UID } from "../../Common/Util/Constant";

class Container extends Component {
  constructor(props) {
    super(props);
    document.body.id = "report"; // for hiding gitple
    let _fluidFont = 12;
    if (window.innerWidth > 1920) {
      _fluidFont = 18;
    } else if (window.innerWidth > 1080) {
      _fluidFont = 14;
    }
    this.userType = props.match.params.userType; // userType (tutor or student)
    this.reservationId = props.match.params.reservationId;
    this.state = {
      title: "WP",
      fluidFontSize: _fluidFont,
      screenWidth: 0,
      screenHeight: 0,
      currentCode: `#코드 창에 아래의 코드를 입력해 보세요.\n#print("안녕하세요")\n\n`,
      storyData: {},
      isOpenBoard: false,
      isOpenThumbnail: false,
      thumbnail: null || DefaultEmptyBoardImg,
      trainingScriptList: undefined,
      trainingScript: undefined,
      isShowSavePopup: false,
      isShowRatingPopup: false,
      isShowRatingCompletePopup: false,
      isShowLessonFeedbackPopup: false,
      isShowLessonEndPopup: false,
      isShowFullStoryPopup: false,
      isShowFullVideoPopup: false,
      isShowFullPopup: false,
      lectureTime: { status: false, min: 0, sec: 0 },
      tutorEmail: "",
      studentEmail: "",
      uploading: false,
    };

    this.lectureInterval = undefined;
    this.studentEnterrance = false;
    this.tutorEnterrance = false;
    if (this.userType === "tutor") {
      this.tutorEnterrance = true;
    } else if (this.userType === "student") {
      this.studentEnterrance = true;
    }
  }

  componentWillMount = async () => {
    if (this.userType === "tutorTraining" || this.userType === "pySpring") {
      const ScriptList = await request.getLectureListPython({}).then((res) => res.json());

      // freeTrials : 동아사이언스 무료체험, 일반 무료체험
      ScriptList.freeTrials.forEach((freeTrial) => {
        ScriptList.regular.rows.unshift(freeTrial);
      });

      this.setState({
        trainingScriptList: ScriptList.regular.rows,
      });
    }
  };

  componentDidMount = async () => {
    this.setState({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });
    this.setUpSocket(); // socket server settinglectureTime

    this.dragElement(document.querySelector("#TabWidthBarButton"), this.handleFontSize); // dragEvent create

    window.addEventListener("resize", this.handleResizing);

    // socketUtil.sendSocket("enteranceLecture", this.userType); // enterance check
    await socketUtil.socket.on("enteranceLecture", (data) => {
      if (data === "tutor") {
        this.tutorEnterrance = true;
      } else if (data === "student") {
        this.studentEnterrance = true;
      }
      if (this.studentEnterrance && this.tutorEnterrance) {
        socketUtil.sendSocket("startLecture", this.userType); // enterance complete
      }
    });

    socketUtil.socket.on("syncUserBoard", ({ message: { type, isOpenBoard, isOpenThumbnail } }) => {
      if (type === "openBoard") {
        this.setState({ isOpenBoard });
      } else if (type === "openThumbnail") {
        this.setState({ isOpenThumbnail });
      }
    });

    socketUtil.socket.on("startLecture", (data) => {
      if (!this.lectureInterval) {
        this.lectureInterval = setInterval(this.checkTimer, 1000);
      }
      const today = new Date();
      TrackingUtil.sendAPEventDirect("freetrial_start", {
        class_fix_date: `${today.getFullYear()}-${
          today.getMonth() + 1
        }-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`,
        freetrial_subject: "py",
        freetrial_subject_title: this.props.subjectTitle,
        tutor: this.props.tutorEmail,
        user_id: this.props.userEmail,
      });
    });

    socketUtil.socket.on("syncLectureEnd", (data) => {
      const today = new Date();

      if (data.message) {
        if (this.userType === "tutor") {
          // this.setState({ isShowLessonEndPopup: true });
        } else {
          this.handlePopupShow("tutorfeedBack");
        }
        TrackingUtil.sendAPEventDirect("freetrial_end", {
          class_fix_date: `${today.getFullYear()}-${
            today.getMonth() + 1
          }-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`,
          freetrial_subject: "py",
          freetrial_subject_title: this.props.subjectTitle,
          tutor: this.props.tutorEmail,
          user_id: this.props.userEmail,
        });
      }
    });
  };

  handleToggleBoard = () => {
    this.setState({ isOpenBoard: !this.state.isOpenBoard }, () =>
      socketUtil.sendSocket("syncUserBoard", {
        type: "openBoard",
        isOpenBoard: this.state.isOpenBoard,
      }),
    );
  };

  handleCloseTab = () => {
    window.open("", "_self", "");
    window.close();
  };

  handlePopupShow = (type, value) => {
    switch (type) {
      case "endLecture":
        if (this.state.lectureTime.status) this.setState({ isShowLessonEndPopup: true });
        break;
      case "endLectureConfirm":
        if (value) {
          this.handleLectureTimer(false);
          socketUtil.sendSocket("syncLectureEnd", true);
          this.setState(
            {
              isShowLessonFeedbackPopup: true,
              isShowLessonEndPopup: false,
            },
            () => this.stopRecording(),
          );
        } else {
          this.setState({
            isShowLessonEndPopup: false,
          });
        }
        break;
      case "tutorfeedBack":
        this.setState({
          isShowLessonFeedbackPopup: false,
          isShowRatingPopup: true,
        });
        break;
      case "saveRate":
        this.setState({
          isShowRatingPopup: false,
          isShowRatingCompletePopup: value,
        });
        break;
      default:
        break;
    }
  };

  stopRecording = async () => {
    this.setState({ uploading: true });
    const params = {
      channel: this.reservationId,
      uid: AGORA_UID.TUTOR,
    };
    try {
      const stop = await request.stopRecording(params).then((res) => res.json());
      console.log("recording stop:", stop);
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ uploading: false });
    }
  };

  checkTimer = () => {
    let _min = this.state.lectureTime.min;
    let _sec = this.state.lectureTime.sec + 1;

    if (_sec >= 60) {
      _min += 1;
      _sec = 0;
    }

    if (_sec >= 60) {
      _min += 1;
      _sec = 0;
    }

    this.setState({ lectureTime: { status: true, min: _min, sec: _sec } });
  };

  handleLectureTimer = (value) => {
    if (value) {
      this.lectureInterval = setInterval(this.checkTimer, 1000);
    } else {
      clearInterval(this.lectureInterval);
      this.setState({
        lectureTime: {
          status: false,
          min: this.state.lectureTime.min,
          sec: this.state.lectureTime.sec,
        },
      });
    }
  };

  handleToggleThumbnail = () => {
    this.setState({ isOpenThumbnail: !this.state.isOpenThumbnail }, () =>
      socketUtil.sendSocket("syncUserBoard", {
        type: "openThumbnail",
        isOpenThumbnail: this.state.isOpenThumbnail,
      }),
    );
  };

  getBoardThumbnail = (thumbnail) => {
    this.setState({ thumbnail });
  };

  handleFontSize = (fontSize) => {
    this.setState({ fluidFontSize: fontSize });
  };

  handleResizing = (e) => {
    let pythonLeftbar = document.getElementById("Python__Leftbar");
    let pythonEditor = document.getElementById("Python__Editor");
    let pythonBottom = document.getElementById("Python__Bottombar");
    let leftWidthBar = document.getElementById("TabWidthBarButton");
    let pythonRight = document.getElementById("Python__Rightbar");
    let pythonRight2 = document.getElementById("Python__Rightbar2");

    // ------------ 너비 변경에 따른 처리 ------------
    // pythonEditor 가로길이
    let result = window.innerWidth - pythonLeftbar.offsetWidth - 25;
    pythonEditor.style.width = result + "px";

    // pythonBottom 가로길이
    let result2 = window.innerWidth - pythonLeftbar.offsetWidth - 1;
    pythonBottom.style.width = result2 + "px";

    // ------------ 높이 변경에 따른 처리 ------------
    // 변경해야할 값 들
    function change(calc) {
      pythonEditor.style.height = calc - 32 + "px";
      leftWidthBar.style.height = calc + "px";
      pythonRight.style.height = calc - 32 + "px";
      pythonRight2.style.marginTop =
        pythonBottom.clientHeight <= 56 ? calc - 88 - 200 + "px" : calc - 88 - pythonBottom.clientHeight + "px";
    }

    // 화면을 줄일 때, 처음 화면 높이보다 지금 화면 높이가 작으면 실행
    if (window.innerHeight < this.state.screenHeight) {
      // 근데 만약 결과창 높이가 최대값보다 크면 일정한 값으로 고정하여 처리
      if (pythonBottom.clientHeight >= window.innerHeight * 0.3592) {
        change(window.innerHeight - 200);
      } else {
        change(window.innerHeight - pythonBottom.clientHeight);
      }
      // 화면을 늘릴 때, 처음 화면 높이보다 지금 화면 높이가 높으면 실행
    } else if (window.innerHeight > this.state.screenHeight) {
      change(window.innerHeight - 200);
    }

    // 화면의 높이값보다 작으면 빼줘야 함
    if (window.innerHeight <= window.screen.height * 0.5) {
      pythonEditor.style.width = result - 21 + "px";
    }

    let fluidFont = 12;
    if (window.innerWidth > 1920) {
      fluidFont = 18;
    } else if (window.innerWidth > 1080) {
      fluidFont = 14;
    }

    if (this.state.screenWidth !== window.innerWidth || this.state.screenHeight !== window.innerHeight) {
      let widthChange = this.state.fluidFontSize - (this.state.screenWidth - window.innerWidth) / 100;
      let heightChange = this.state.fluidFontSize - (this.state.screenHeight - window.innerHeight) / 100;

      this.state.screenWidth !== window.innerWidth || fluidFont >= widthChange || fluidFont >= heightChange
        ? this.handleFontSize(widthChange)
        : this.handleFontSize(heightChange);
    }

    // 마지막 리사이징 끝날 시 높이값 저장하기
    this.setState({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });
  };

  // socket setup function
  setUpSocket = async () => {
    let lectureInfo;
    try {
      lectureInfo = await socketUtil.setUpSocket(this.props);
    } catch (e) {}
    if (
      this.userType === "tutorTraining" ||
      this.userType === "pySpring" || //fixme: temp type
      this.userType === "review"
    )
      return;

    if (!lectureInfo) {
      window.location.href = "/";
      return;
    }
    // this.setState({ title: lectureInfo.lecture.title });
    this.setState({
      tutorEmail: lectureInfo.tutorEmail,
      studentEmail: lectureInfo.studentEmail,
    });
    socketUtil.setUpJanusSocket();
  };

  // dragEvent setup funtion
  dragElement = (elmnt, handleFontSize) => {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    if (document.getElementById(elmnt.id)) {
      document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();

      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();

      // console.log(e.clientX , e.screenX);
      if ((e.clientX / window.innerWidth) * 100 < 20 || (e.clientX / window.innerWidth) * 100 > 40) return;

      let SliderHeight = (e.clientX / 3) * 2;
      let editorWidth = window.innerWidth - e.clientX - 24;
      let bottomWidth = window.innerWidth - e.clientX;

      let leftTextBox = document.getElementById("TabTextBox");

      let leftBar = document.getElementById("Python__Leftbar");
      let leftSlider = document.getElementById("leftbar_Slider");
      let pythonEditor = document.getElementById("Python__Editor");
      let pythonBottom = document.getElementById("Python__Bottombar");

      let editorWidthOfpercent = (editorWidth / window.innerWidth) * 100;
      let bottomWidthOfpercent = (bottomWidth / window.innerWidth) * 100;

      leftBar.style.width = e.clientX + "px";
      leftSlider.style.height = SliderHeight + "px";
      pythonEditor.style.width = editorWidthOfpercent + "%";
      pythonBottom.style.width = bottomWidthOfpercent + "%";
      // leftTextBox.style.height = window.outerHeight - SliderHeight - 240 + "px";
      leftTextBox.style.height = `calc(100% - 44px - ${SliderHeight}px - 54px)`;
      handleFontSize(SliderHeight / 27);
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };

  handleSaveLocalStorage = (storyData) => {
    localStorage.setItem("storyData", JSON.stringify(storyData));
    localStorage.setItem("codeData", JSON.stringify(this.state.currentCode));

    alert("저장되었습니다!");
  };

  handleRestoreLocalStorage = (cb) => {
    let jsonStoryData = JSON.parse(localStorage.getItem("storyData"));
    let jsonCodeData = JSON.parse(localStorage.getItem("codeData"));

    this.setState({ storyData: jsonStoryData });

    if (jsonStoryData) {
      cb(jsonStoryData);
      alert("복구되었습니다!");
    } else {
      alert("복구할 데이터가 없습니다.");
    }

    if (jsonCodeData !== this.state.currentCode) {
      window.ace.edit("Python__Editor").setValue(jsonCodeData);
      this.setState({ currentCode: jsonCodeData });
    }
  };

  // codeData 얻어온 뒤 저장
  handleGetCodeData = (data) => {
    this.setState({ currentCode: data });
  };

  handleTestChangeScript = (info) => {
    this.setState({ trainingScript: JSON.parse(info) });
  };

  render() {
    const {
      title,
      fluidFontSize,
      currentCode,
      trainingScriptList,
      trainingScript,
      isOpenBoard,
      isOpenThumbnail,
      thumbnail,
      isShowRatingPopup,
      isShowRatingCompletePopup,
      isShowLessonFeedbackPopup,
      isShowLessonEndPopup,
      lectureTime,
      tutorEmail,
      studentEmail,
      uploading,
    } = this.state;

    const {
      userType,
      reservationId,
      handleSaveLocalStorage,
      handleRestoreLocalStorage,
      handleGetCodeData,
      handleToggleBoard,
      handleToggleThumbnail,
      handleTestChangeScript,
      getBoardThumbnail,
      handlePopupShow,
      handleLectureTimer,
      handleCloseTab,
    } = this;
    return (
      <View
        title={title}
        userType={userType}
        tutorEmail={tutorEmail}
        studentEmail={studentEmail}
        reservationId={reservationId}
        fluidFontSize={fluidFontSize}
        lectureTime={lectureTime}
        currentCode={currentCode}
        isShowRatingPopup={isShowRatingPopup}
        isShowRatingCompletePopup={isShowRatingCompletePopup}
        isShowLessonFeedbackPopup={isShowLessonFeedbackPopup}
        isShowLessonEndPopup={isShowLessonEndPopup}
        trainingScriptList={trainingScriptList}
        trainingScript={trainingScript}
        handleSaveLocalStorage={handleSaveLocalStorage}
        handleRestoreLocalStorage={handleRestoreLocalStorage}
        handleGetCodeData={handleGetCodeData}
        isOpenBoard={isOpenBoard}
        isOpenThumbnail={isOpenThumbnail}
        handleToggleBoard={handleToggleBoard}
        handleToggleThumbnail={handleToggleThumbnail}
        handleTestChangeScript={handleTestChangeScript}
        thumbnail={thumbnail}
        getBoardThumbnail={getBoardThumbnail}
        handlePopupShow={handlePopupShow}
        handleLectureTimer={handleLectureTimer}
        handleCloseTab={handleCloseTab}
        uploading={uploading}
      />
    );
  }
}

export default connect((state) => ({
  email: state.userinfo.email,
  userEmail: state.userinfo.userEmail,
  tutorEmail: state.userinfo.tutorEmail,
  subjectTitle: state.userinfo.subjectTitle,
  name: state.userinfo.name,
  isTutor: state.userinfo.isTutor,
}))(Container);
