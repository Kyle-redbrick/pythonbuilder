import React, { Component } from "react";
import moment from "moment";
import { showAlert } from "../../../../Common/Util/AlertManager";
import * as request from "../../../../Common/Util/HTTPRequest";
import * as TrackingUtil from "../../../../Common/Util/TrackingUtil";
import "./index.scss";
import View from "./View";

export const TUTOR_SCHEDULE = {
  OPEN: "open",
  FIXED: "fixed",
  RESERVED: "reserved",
  EMPTY: "empty",
};

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedules: this.convertReservationsToSchedules(null),
      scheduleChanges: { add: [], delete: [] },
      startTime: 10,
      endTime: 20,
      currentMonth: moment(),
      didUpdateMonth: true,
      currentWeek: Number(moment().format("d")),
      fixedSchedules: {},
    };
  }

  get activeNum() {
    return this.state.scheduleChanges.add.length;
  }

  get isActive() {
    const { scheduleChanges } = this.state;
    return scheduleChanges.add.length > 0 || scheduleChanges.delete.length > 0;
  }

  get scheduleCount() {
    let scheduleCount = 0;
    const { schedules } = this.state;
    for (let i = 0; i < schedules.length; i++) {
      for (let j = 0; j < schedules[i].length; j++) {
        if (schedules[i][j].status === TUTOR_SCHEDULE.RESERVED) {
          scheduleCount++;
        }
      }
    }
    return scheduleCount;
  }

  componentDidMount() {
    TrackingUtil.sendPageEvent("/tutor/schedule", this.props.email);
    this.commonUpdate();
  }

  componentDidUpdate() {
    this.commonUpdate();
  }

  commonUpdate() {
    if (this.state.didUpdateMonth) {
      let year = this.state.currentMonth.year();
      let month = this.state.currentMonth.month() + 1;
      this.getTutorMonthlySchedule(year, month);
    }
  }

  getTutorMonthlySchedule = (year, month) => {
    const param = {
      tutorType: this.props.tutorType,
      type: "times",
      email: this.props.email,
      year: year,
      month: month,
    };
    this.setState({ didUpdateMonth: false });
    request
      .getTutorMonthlyReservations(param)
      .then((res) => res.json())
      .then((json) => {
        const reservations = json[0].concat(json[1]);
        const schedules = this.convertReservationsToSchedules(reservations);
        this.setState({
          schedules: schedules,
          scheduleChanges: { add: [], delete: [] },
        });
      })
      .catch((e) => console.error(e));
  };

  postTutorMonthlySchedule = (add = []) => {
    const param = {
      type: this.props.tutorType,
      email: this.props.email,
      add: add.length > 0 ? add : this.state.scheduleChanges.add,
      delete: this.state.scheduleChanges.delete,
    };

    request
      .postTutorMonthlyReservations(param)
      .then((res) => res.json())
      .then((json) => {
        this.showSaveAlert(json.success);
      })
      .catch((e) => {
        console.error(e);
        this.showSaveAlert(false);
      });
  };

  showSaveAlert = (success) => {
    const title = success ? "ID_LIVETUTOR_TUTOR_SCHEDULE_SUCCESS" : "ID_LIVETUTOR_TUTOR_SCHEDULE_FAIL";
    const subtitle = success ? null : "ID_LIVETUTOR_TUTOR_ADMIN";
    showAlert(title, subtitle, "ID_LIVETUTOR_TUTOR_CONFIRM", () => {
      if (success) {
        this.setState({
          didUpdateMonth: true,
        });
      }
    });
  };

  convertReservationsToSchedules = (reservations) => {
    var schedules = Array(31);
    for (let i = 0; i < schedules.length; i++) {
      schedules[i] = Array(24);
      for (let j = 0; j < schedules[i].length; j++) {
        schedules[i][j] = { id: null, status: TUTOR_SCHEDULE.EMPTY };
      }
    }
    if (reservations) {
      let fixedSchedules = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
      reservations.forEach((reservation) => {
        const date = moment(reservation.date).date();
        const time = reservation.time;
        const id = reservation.id;
        let status;
        if (reservation.studentEmail) {
          status = TUTOR_SCHEDULE.RESERVED;
        } else if (reservation.memo && reservation.memo === TUTOR_SCHEDULE.FIXED) {
          status = TUTOR_SCHEDULE.FIXED;
        } else {
          status = TUTOR_SCHEDULE.OPEN;
        }
        let day = moment(reservation.date).day();
        if (reservation.memo === TUTOR_SCHEDULE.FIXED) {
          fixedSchedules[day].push({ date, time });
        }

        schedules[date - 1][time] = {
          id,
          status,
        };
      });
      this.setState({ fixedSchedules });
    }
    return schedules;
  };

  onClickNextMonth = (bool) => {
    const nextMonth = moment(this.state.currentMonth).add(bool ? 1 : -1, "M");
    this.setState({
      schedules: this.convertReservationsToSchedules(null),
      currentMonth: nextMonth,
      didUpdateMonth: true,
    });
  };

  onClickDate = (date) => {
    const { currentMonth, startTime, endTime } = this.state;
    const today = moment();
    const isAfter = today.startOf("d").isSameOrAfter(moment(currentMonth).date(date).startOf("d"));
    if (isAfter) {
      return;
    }
    var bool;
    for (let i = startTime; i <= endTime; i++) {
      if (this.state.schedules[date - 1][i].isReserved) {
        continue;
      } else {
        bool = !this.state.schedules[date - 1][i].isOn;
        break;
      }
    }
    for (let i = startTime; i <= endTime; i++) {
      this.onClickTime(date, i, bool);
    }
  };

  onClickHour = (hour) => {
    const { currentMonth } = this.state;
    const today = moment();
    const daysInMonth = currentMonth.daysInMonth();
    var bool;
    for (let i = 0; i < daysInMonth; i++) {
      const isAfter = today.startOf("d").isAfter(moment(currentMonth).date(i).startOf("d"));
      if (isAfter || this.state.schedules[i][hour].isReserved) {
        continue;
      } else {
        bool = !this.state.schedules[i][hour].isOn;
        break;
      }
    }
    for (let i = 0; i < daysInMonth; i++) {
      const isAfter = today.startOf("d").isAfter(moment(currentMonth).date(i).startOf("d"));
      if (isAfter) {
        continue;
      }
      this.onClickTime(i + 1, hour, bool);
    }
  };

  onClickTime = (date, time, bool) => {
    this.setState((prev) => {
      const schedules = prev.schedules;
      if (!schedules) {
        return;
      }
      var schedule = schedules[date - 1][time];
      if (schedule.status === TUTOR_SCHEDULE.RESERVED) {
        return;
      }

      schedule.status = schedule.status === TUTOR_SCHEDULE.OPEN ? TUTOR_SCHEDULE.EMPTY : TUTOR_SCHEDULE.OPEN;

      const scheduleChanges = prev.scheduleChanges;
      if (schedule.status === TUTOR_SCHEDULE.OPEN) {
        const deleteArr = scheduleChanges.delete;
        for (let i = 0; i < deleteArr.length; i++) {
          if (deleteArr[i] === schedule.id) {
            deleteArr.splice(i, 1);
            var deleted = true;
            i--;
          }
        }
        if (!deleted) {
          scheduleChanges.add.push({
            date: prev.currentMonth.date(date).format("YYYY-MM-DD"),
            time: time,
          });
        }
      } else {
        const addArr = scheduleChanges.add;
        for (let i = 0; i < addArr.length; i++) {
          if (moment(addArr[i].date).date() === date && addArr[i].time === time) {
            addArr.splice(i, 1);
            var added = true;
            i--;
          }
        }
        if (!added && schedule.id) {
          scheduleChanges.delete.push(schedule.id);
        }
      }

      return {
        schedules: schedules,
        scheduleChanges: scheduleChanges,
      };
    });
  };

  onClickSave = () => {
    this.postTutorMonthlySchedule(this.state.scheduleChanges.add);
  };

  onClickCancel = () => {
    this.setState({
      schedules: this.convertReservationsToSchedules(null),
      didUpdateMonth: true,
    });
  };

  onClickWeek = (num) => {
    if (num === this.state.currentWeek) return;
    this.setState({ currentWeek: num });
  };

  render() {
    const { schedules, startTime, endTime, currentMonth, currentWeek, fixedSchedules } = this.state;

    const { tutorType } = this.props;
    return (
      <View
        schedules={schedules}
        startTime={startTime}
        endTime={endTime}
        currentMonth={currentMonth}
        tutorType={tutorType}
        currentWeek={currentWeek}
        onClickWeek={this.onClickWeek}
        onClickNextMonth={this.onClickNextMonth}
        onClickDate={this.onClickDate}
        onClickHour={this.onClickHour}
        onClickTime={this.onClickTime}
        onClickSave={this.onClickSave}
        onClickCancel={this.onClickCancel}
        postTutorMonthlySchedule={this.postTutorMonthlySchedule}
        activeNum={this.activeNum}
        isActive={this.isActive}
        scheduleCount={this.scheduleCount}
        fixedSchedules={fixedSchedules}
      />
    );
  }
}

export default Container;
