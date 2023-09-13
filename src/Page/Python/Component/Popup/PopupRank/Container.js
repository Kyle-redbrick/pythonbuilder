import React, { Component } from "react";
import View from "./View";
import * as request from "../../../../../Common/Util/HTTPRequest";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starPoint: 0,
      commentForTutor: "",
      commentForWizLive: "",
      completeBtn: false,
    };
  }

  addSelectedClass(repeat_num, parent) {
    for (let i = 0; i < repeat_num; i++) {
      parent.children[i].classList.add("selected");
    }
  }

  removeSelectedClass(repeat_num, parent) {
    for (let i = 0; i < repeat_num; i++) {
      parent.children[i].classList.remove("selected");
    }
  }

  changeRateTutor = (e) => {
    const parent = e.target.parentNode;
    const clickListIndex = [].indexOf.call(parent.children, e.target);
    const starPointValue = this.state.starPoint;
    this.setState({ starPoint: clickListIndex + 1, completeBtn: true });

    if (clickListIndex + 1 > starPointValue) {
      this.addSelectedClass(starPointValue, parent);
    } else {
      this.removeSelectedClass(starPointValue, parent);
      this.addSelectedClass(clickListIndex, parent);
    }
  };

  hoverRateTutor = (e) => {
    const parent = e.target.parentNode;
    const clickListIndex = [].indexOf.call(parent.children, e.target);

    this.addSelectedClass(clickListIndex, parent);
  };

  hoverOutRateTutor = (e) => {
    const parent = e.target.parentNode;
    const starLength = parent.children.length;
    const starPointValue = this.state.starPoint;

    this.removeSelectedClass(starLength, parent);
    this.addSelectedClass(starPointValue, parent);
  };

  handleComments = (type, value = "") => {
    if (this.state.starPoint && this.state.commentForTutor) {
      this.setState({ completeBtn: true });
    }

    switch (type) {
      case "tutor":
        this.setState({ commentForTutor: value });
        if (!value) {
          this.setState({ completeBtn: false });
        }
        break;
      case "wizlive":
        this.setState({ commentForWizLive: value });
        break;
      default:
        break;
    }
  };

  handleSubmit = () => {
    if (this.state.starPoint && this.state.commentForTutor) {
      const params = {
        rating: {
          score: this.state.starPoint,
          comment: this.state.commentForTutor,
          wizliveComment: this.state.commentForWizLive,
        },
        id: this.props.reservationId,
        tutor: this.props.tutorEmail,
      };

      request
        .postFeedbackFromStudent(params)
        .then(this.props.handlePopupShow("completeRate", true))
        .catch((err) => console.error(err));

      this.props.handlePopupShow("saveRate", true);
    }
  };

  render() {
    const { starPoint, errorMessage, completeBtn } = this.state;
    const { changeRateTutor, hoverRateTutor, hoverOutRateTutor, handleComments, handleSubmit } = this;

    return (
      <View
        changeRateTutor={changeRateTutor}
        starPoint={starPoint}
        completeBtn={completeBtn}
        errorMessage={errorMessage}
        hoverRateTutor={hoverRateTutor}
        hoverOutRateTutor={hoverOutRateTutor}
        handleComments={handleComments}
        handleSubmit={handleSubmit}
        handlePopupShow={this.props.handlePopupShow}
      />
    );
  }
}

export default Container;
