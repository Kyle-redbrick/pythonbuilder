import React, { Component } from "react";
import View from "./View";
import * as request from "../../../../../Common/Util/HTTPRequest";
import * as TrackingUtil from "../../../../../Common/Util/TrackingUtil";

class Container extends Component {
  handleCompleteReservation = async () => {
    await request
      .setCompleteReservation({
        reservationId: this.props.reservationId,
      })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          TrackingUtil.sendActiveCampaignEvent(this.props.studentEmail, "lecture_completed", {
            type: "python",
            reservationId: this.props.reservationId,
            tutorEmail: this.props.tutorEmail,
            createdAt: new Date().toLocaleString(),
          });
        }
      });
  };

  render() {
    return (
      <>
        <View
          handlePopupShow={this.props.handlePopupShow}
          lectureTime={this.props.lectureTime}
          handleLectureTimer={this.props.handleLectureTimer}
          handleCompleteReservation={this.handleCompleteReservation}
        />
      </>
    );
  }
}

export default Container;
