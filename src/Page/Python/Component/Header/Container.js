import React, { Component } from "react";
// import * as socketUtil from "../../Component/util/pythonSocket";
import View from "./View";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ScriptList: undefined,
      lectureTime: { status: false, min: 0, sec: 0 },
      lectureEnd: false,
    };
  }

  componentDidUpdate() {
    if (this.props.userType === "tutorTraining" || this.props.userType === "pySpring") {
      !this.state.ScriptList &&
        this.props.trainingScriptList &&
        this.setState({ ScriptList: this.props.trainingScriptList });
    }
  }

  changeScripts = (e) => {
    if (e.target.value !== "-1") {
      if (this.state.ScriptList[e.target.value].state !== "") {
        this.props.handleTestChangeScript(this.state.ScriptList[e.target.value].state);
      } else {
        alert("준비중입니다.");
      }
    }
  };

  render() {
    const { ScriptList, lectureEnd } = this.state;
    const { changeScripts } = this;
    const { title, userType, lectureTime, handlePopupShow, handleLectureTimer } = this.props;

    return (
      <View
        title={title}
        clientType={userType}
        lectureTime={lectureTime}
        handlePopupShow={handlePopupShow}
        handleLectureTimer={handleLectureTimer}
        ScriptList={ScriptList}
        lectureEnd={lectureEnd}
        changeScripts={changeScripts}
      />
    );
  }
}

export default Container;
