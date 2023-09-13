import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import * as TrackingUtil from "../../../../Common/Util/TrackingUtil";
import * as request from "../../../../Common/Util/HTTPRequest";
import { generatePIDForWizLive } from "../../../../Common/Util/PIDGenerator";
import { showAlert, showTwoBtnAlertWithTextarea } from "../../../../Common/Util/AlertManager";
import { showPopUp, EnvTestPopUp, OneButtonPopUp } from "../../../../Common/Component/PopUp";
import { URL } from "../../../../Common/Util/Constant";
import View from "./View.js";
import moment from "moment";

const reservationLimit = 20;

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reservationEnum: this.props.reservationEnum,
      didEnumUpdate: true,
      reservations: [],
      totalReservationCount: 0,
      reservationToFeedback: null,
      isReadonly: false,
    };
  }
  componentDidMount() {
    TrackingUtil.sendPageEvent("/tutor/reservationList", this.props.email);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.commonUpdate();
  }
  componentDidUpdate() {
    this.commonUpdate();
  }
  commonUpdate() {
    if (this.state.didEnumUpdate) {
      this.getReservationsByType(this.props.email, this.props.reservationEnum, 0, reservationLimit);
    }
  }

  getReservationsByType = (email, reservationEnum, offset, limit) => {
    const param = {
      email: email,
      type: reservationEnum.key,
      offset: offset,
      limit: limit,
    };
    // console.log("getReservationsByType",param);
    this.setState({
      reservationEnum: reservationEnum,
      didEnumUpdate: false,
    });
    request
      .getTutorReservationsByType(param)
      .then((res) => res.json())
      .then((json) => {
        this.setState((prev) => ({
          reservations: prev.reservations.concat(json.reservations),
          totalReservationCount: json.reservationsCnt,
        }));
      })
      .catch((e) => {
        console.error(e);
      });
  };
  postReservationCancel = (reservationId) => {
    request
      .putReservationCancel({ id: reservationId })
      .then((res) => res.json())
      .then((json) => {
        this.showCancelResult(json.success, reservationId);
      })
      .catch((e) => {
        this.showCancelResult(false);
        console.error(e);
      });
  };
  postSendStudentMessage = (tutorEmail, reservation, message) => {
    const param = {
      tutorEmail: tutorEmail,
      studentEmail: reservation.studentEmail,
      message: message,
    };
    // console.log("postSendStudentMessage",param);
    request
      .postSendStudentMessage(param)
      .then((res) => res.json())
      .then((json) => {
        this.showSendMessageResult(json.success);
      })
      .catch((e) => {
        this.showSendMessageResult(false);
        console.error(e);
      });
  };

  showSendMessage = (reservation) => {
    // console.log("showSendMessage", reservation);
    const titleId = "ID_LIVETUTOR_TUTOR_MESSAGE_HEADER";
    const titleValues = { name: reservation.student.name };
    const placeholderId = "ID_LIVETUTOR_TUTOR_MESSAGE_PLACEHOLDER";
    const placeholderValues = { name: reservation.student.name };
    const okButtonId = "ID_LIVETUTOR_TUTOR_SEND";
    const cancelButtonId = "ID_LIVETUTOR_TUTOR_CANCEL";
    showTwoBtnAlertWithTextarea(
      titleId,
      titleValues,
      placeholderId,
      placeholderValues,
      okButtonId,
      cancelButtonId,
      (message) => {
        this.postSendStudentMessage(this.props.email, reservation, message);
      },
    );
  };
  showSendMessageResult = (success) => {
    // console.log("showSendMessageResult", success);
    const titleId = success ? "ID_LIVETUTOR_TUTOR_MESSAGE_SUCCESS" : "ID_LIVETUTOR_TUTOR_MESSAGE_FAIL";
    const subtitleId = success ? null : "ID_LIVETUTOR_TUTOR_ADMIN";
    showAlert(titleId, subtitleId, "ID_LIVETUTOR_TUTOR_CONFIRM", () => {});
  };

  showCancel = (reservation) => {
    const reservationDate = moment(`${reservation.date} ${reservation.time}:00`, "YYYY-MM-DD HH:mm");
    const current = moment();
    const isReservationCanCancel = current.format("DD") !== reservationDate.format("DD");

    if (isReservationCanCancel) {
      // showTwoBtnAlertWithValues(
      //   titleId,
      //   titleValues,
      //   msgId,
      //   okButtonId,
      //   cancelButtonId,
      //   () => {
      //     this.postReservationCancel(reservation.id);
      //   },
      //   true
      // );
      showAlert(
        "ID_RESERVATION_CANNOTCANCELED_TITLE",
        "ID_RESERVATION_CANNOTCANCELED_MESSAGE",
        "ID_RESERVATION_CANNOTCANCELED_OK",
      );
    } else {
      showAlert(
        "ID_RESERVATION_CANNOTCANCELED_TITLE",
        "ID_RESERVATION_CANNOTCANCELED_MESSAGE",
        "ID_RESERVATION_CANNOTCANCELED_OK",
      );
    }
  };

  showCancelResult = (success, reservationId) => {
    // console.log("showCancelAlert", success);
    const titleId = success
      ? "ID_LIVETUTOR_TUTOR_RESERVATION_CANCEL_SUCCESS"
      : "ID_LIVETUTOR_TUTOR_RESERVATION_CANCEL_FAIL";
    const subtitleId = success ? null : "ID_LIVETUTOR_TUTOR_ADMIN";
    showAlert(titleId, subtitleId, "ID_LIVETUTOR_TUTOR_CONFIRM", () => {
      if (success) {
        this.setState((prev) => {
          const reservations = prev.reservations;
          let totalReservationCount = prev.totalReservationCount;
          for (let i = 0; i < reservations.length; i++) {
            if (reservations[i].id === reservationId || true) {
              reservations.splice(i, 1);
              totalReservationCount -= 1;
              break;
            }
          }
          return {
            reservations: reservations,
            totalReservationCount: totalReservationCount,
          };
        });
      }
    });
  };

  onClickTab = () => {
    // console.log("onClickTab");
    this.setState({
      reservations: [],
      totalReservationCount: 0,
      didEnumUpdate: true,
    });
  };
  onClickMessage = (reservation) => {
    // console.log("onClickMessage", reservation);
    this.showSendMessage(reservation);
  };
  onClickStart = (reservation) => {
    if (!window.liveTutorTabs) {
      window.liveTutorTabs = [];
    }
    while (window.liveTutorTabs.length > 0) {
      let tab = window.liveTutorTabs.pop();
      tab.close();
    }
    const { type, date, time, roomId } = reservation;
    const pId = generatePIDForWizLive(this.props.email, date, time, roomId);
    if (type === "js") {
      const url = URL.WIZSCHOOL_LIVE + pId;
      const newTab = window.open(url, "_blank");
      window.liveTutorTabs.push(newTab);
    } else if (type === "js_1v4") {
      const url = URL.WIZSCHOOL_LIVE_1V4 + `${generatePIDForWizLive(this.props.email, date, null, roomId)}-${roomId}`;
      const newTab = window.open(url, "_blank");
      window.liveTutorTabs.push(newTab);
    } else if (type === "python_1v4") {
      const url = URL.WIZSCHOOL_PYTHON_1v4_TUTOR + roomId;
      const newTab = window.open(url, "_blank");
      window.liveTutorTabs.push(newTab);
    } else {
      const url = URL.WIZSCHOOL_PYTHON_TUTOR + roomId;
      const newTab = window.open(url, "_blank");
      window.liveTutorTabs.push(newTab);
    }
  };
  onClickCancel = (reservation) => {
    // console.log("onClickCancel", reservation);
    this.showCancel(reservation);
  };
  onClickFeedback = (reservation) => {
    // console.log("onClickFeedback", reservation);
    this.setState({ reservationToFeedback: reservation, isReadonly: false });
  };

  onClickPastReview = (reservation) => {
    this.setState({ reservationToFeedback: reservation, isReadonly: true });
  };

  onClickMore = () => {
    // console.log("onClickMore");
    const { reservations, totalReservationCount } = this.state;
    const currentCount = reservations.length;
    if (currentCount >= totalReservationCount) {
      return;
    }
    this.getReservationsByType(this.props.email, this.props.reservationEnum, currentCount, reservationLimit);
  };

  handleEnvTest = () => {
    if (window.chrome) {
      showPopUp(<EnvTestPopUp />, undefined, false, false);
    } else {
      showPopUp(
        <OneButtonPopUp title="환경 테스트 실패" subtitle="수업은 크롬 브라우저에서만 지원됩니다" buttonName="확인" />,
      );
    }
  };

  render() {
    const { reservationEnum, reservations, totalReservationCount, reservationToFeedback, isReadonly } = this.state;
    if (reservationToFeedback) {
      return (
        <Redirect
          push
          to={`/tutor/feedback/${reservationToFeedback.studentEmail}/${reservationToFeedback.id}/${isReadonly}/${reservationToFeedback.type}`}
        />
      );
    } else {
      return (
        <View
          reservationEnum={reservationEnum}
          reservations={reservations}
          totalReservationCount={totalReservationCount}
          onClickTab={this.onClickTab}
          onClickMessage={this.onClickMessage}
          onClickStart={this.onClickStart}
          onClickCancel={this.onClickCancel}
          onClickFeedback={this.onClickFeedback}
          onClickPastReview={this.onClickPastReview}
          onClickMore={this.onClickMore}
          handleEnvTest={this.handleEnvTest}
        />
      );
    }
  }
}

export default Container;
