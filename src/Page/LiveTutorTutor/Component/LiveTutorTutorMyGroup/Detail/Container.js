import React, { Component } from "react";
import * as request from "../../../../../Common/Util/HTTPRequest";
import View from "./View.js";
import { connect } from "react-redux";
import moment from "moment";
import { generatePIDForWizLive } from "../../../../../Common/Util/PIDGenerator";
import { URL } from "../../../../../Common/Util/Constant";

class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lectureGroup: undefined,
      completeReservations: [],
      upcomingReservations: [],
    };
  }

  componentDidMount() {
    const { lectureGroupId } = this.props;

    this.getReservations(lectureGroupId);
  }

  // 수업 입장
  onEnterLecture = (reservation) => {
    const { lectureGroup } = this.state;
    const { roomId, date } = reservation;

    if (lectureGroup.lecture === "js_1v4") {
      const url = URL.WIZSCHOOL_LIVE_1V4 + `${generatePIDForWizLive(this.props.email, date, null, roomId)}-${roomId}`;
      window.open(url, "_blank");
    } else {
      const url = URL.WIZSCHOOL_PYTHON_1v4_TUTOR + roomId;
      window.open(url, "_blank");
    }
  };

  // 수업 입장 가능 여부 체크 (수업시작 기준 10분 전 입장가능)
  isCanLectureEnter = (date, time, minute) => {
    const lectureStartAt = moment(`${date} ${time}:${minute}`);
    const canLectureStartAt = lectureStartAt.subtract(10, "m");
    return moment().isSameOrAfter(canLectureStartAt);
  };

  getReservations = (lectureGroupId) => {
    request
      .getLectureGroupReservations({ lectureGroupId })
      .then((res) => res.json())
      .then((json) => {
        const { lectureGroup } = json;

        let completeReservations = [];
        let upcomingReservations = [];

        completeReservations = lectureGroup.reservations
          .filter((element) => element.isComplete)
          .sort((first, second) => {
            return first.date > second.date ? -1 : first.date < second.date ? 1 : 0;
          });

        upcomingReservations = lectureGroup.reservations
          .filter((element) => !element.isComplete)
          .sort((first, second) => {
            return first.date < second.date ? -1 : first.date < second.date ? 1 : 0;
          });

        // DB에는 한 그룹 수업에 각각의 데이터가 있어서 하나의 그룹 데이터로 변환하는 작업.
        completeReservations = Array.from(this.convertLectureGroupsDataFormat(completeReservations).values()).flat();
        upcomingReservations = Array.from(this.convertLectureGroupsDataFormat(upcomingReservations).values()).flat();

        this.setState({
          lectureGroup,
          completeReservations,
          upcomingReservations,
        });
      });
  };

  convertLectureGroupsDataFormat = (reservations) => {
    let students = [];
    let _roomIds = [];
    const _reservations = reservations.reduce((acc, cur, index) => {
      if (index === 0) {
        _roomIds.push(cur.roomId);
      }
      if (_roomIds.includes(cur.roomId)) {
        students.push({
          reservationId: cur.id,
          studentEmail: cur.student.email,
          studentGrade: cur.student.grade,
          studentIcon: cur.student.icon,
          studentName: cur.student.name,
          studentEntranceTime: cur.studentEntranceTime,
        });
      } else {
        _roomIds.push(cur.roomId);
        students = [];
        students.push({
          reservationId: cur.id,
          studentEmail: cur.student.email,
          studentGrade: cur.student.grade,
          studentIcon: cur.student.icon,
          studentName: cur.student.name,
          studentEntranceTime: cur.studentEntranceTime,
        });
      }

      return acc.set(cur.roomId, {
        roomId: cur.roomId,
        date: cur.date,
        time: cur.time,
        minute: cur.minute,
        lecture: {
          id: cur.myLecture.lectureId,
          title: cur.myLecture.lecture.title,
          level: cur.myLecture.lecture.level,
          curriculumTotalCount: cur.myLecture.lecture.curriculum.count,
          feedback: cur.myLecture.feedback,
        },
        students,
      });
    }, new Map());

    return _reservations;
  };

  render() {
    const { isCanLectureEnter, onEnterLecture } = this;
    return <View {...this.state} onEnterLecture={onEnterLecture} isCanLectureEnter={isCanLectureEnter} />;
  }
}

export default connect((state) => ({
  email: state.userinfo.email,
  tutorType: state.userinfo.tutorType,
}))(Container);
