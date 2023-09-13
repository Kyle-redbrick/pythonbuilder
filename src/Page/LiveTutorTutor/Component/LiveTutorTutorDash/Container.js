import React, { Component } from "react";
import moment from "moment";
import * as TrackingUtil from "../../../../Common/Util/TrackingUtil";
import * as request from "../../../../Common/Util/HTTPRequest";
import View from "./View.js";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tutorActivity: {
        ratingSum: 0,
        ratingCount: 0,
        studentsCount: 0,
        studentsRecent: [],
      },
      tutorReservations: {
        upcomingReservations: [],
        completeReservations: [],
        canceledReservations: [],
      },
      currentMonth: moment(),
      didUpdateMonth: true,
      monthlyReservations: null,
    };
  }
  componentDidMount() {
    TrackingUtil.sendPageEvent("/tutor", this.props.email);
    this.getTutorActivity();
    this.getTutorReservationsSummary();
    this.commonUpdate();
  }
  componentDidUpdate() {
    this.commonUpdate();
  }
  commonUpdate() {
    if (this.state.didUpdateMonth) {
      let year = this.state.currentMonth.year();
      let month = this.state.currentMonth.month() + 1;
      this.getTutorMonthlyReservations(year, month);
    }
  }

  getTutorActivity = () => {
    // console.log("getTutorActivity");
    request
      .getTutorActivity({ email: this.props.email })
      .then((res) => res.json())
      .then((json) => {
        let tutorActivity = json;
        const maxRecentStudents = 5;
        if (tutorActivity.studentsRecent.length > maxRecentStudents) {
          tutorActivity.studentsRecent = tutorActivity.studentsRecent.slice(0, maxRecentStudents);
        }
        this.setState({ tutorActivity: tutorActivity });
      })
      .catch((e) => console.error(e));
  };
  getTutorMonthlyReservations = (year, month) => {
    // console.log("getTutorMonthlyReservations", year, month);
    const param = {
      type: "calendar",
      email: this.props.email,
      year: year,
      month: month,
      tutorType: this.props.tutorType,
    };
    this.setState({ didUpdateMonth: false });
    request
      .getTutorMonthlyReservations(param)
      .then((res) => res.json())
      .then((json) => {
        const monthlyReservations = json.map((element) => ({
          date: moment(element.date).date(),
          time: element.time,
          name: element.student.name,
        }));
        this.setState({
          monthlyReservations: monthlyReservations,
        });
      })
      .catch((e) => console.error(e));
  };
  getTutorReservationsSummary = () => {
    // console.log("getReservationsSummary");
    request
      .getTutorReservationsSummary({ email: this.props.email })
      .then((res) => res.json())
      .then((json) => {
        this.setState({ tutorReservations: json });
      })
      .catch((e) => console.error(e));
  };

  onClickReservation = (reservation) => {
    // console.log("onClickReservation", reservation);
  };
  onClickRating = (rating) => {
    // console.log("onClickRating", rating);
  };
  onClickNextMonth = (bool) => {
    // console.log("onClickNextMonth", bool);
    const nextMonth = moment(this.state.currentMonth).add(bool ? 1 : -1, "M");
    this.setState({
      monthlyReservations: null,
      currentMonth: nextMonth,
      didUpdateMonth: true,
    });
  };

  render() {
    const { tutorActivity, tutorReservations, currentMonth, monthlyReservations } = this.state;

    return (
      <View
        tutorActivity={tutorActivity}
        tutorReservations={tutorReservations}
        currentMonth={currentMonth}
        monthlyReservations={monthlyReservations}
        onClickReservation={this.onClickReservation}
        onClickRating={this.onClickRating}
        onClickNextMonth={this.onClickNextMonth}
      />
    );
  }
}

export default Container;
