import React, { Component } from "react";
import moment from "moment";
import { TUTOR_SCHEDULE } from "../../../../Page/LiveTutorTutor/Component/LiveTutorTutorSchedule/Container";
import dropdownIcon from "../../../../Image/ic_dropdown.svg";
import "./index.scss";

const days = ["일", "월", "화", "수", "목", "금", "토"];
const times = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const weeks = Array.from(Array(57).keys()).map((i) => 4 + i);

export default class TutorFixedSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment().add(1, "day").format("YYYY-MM-DD"),
      time: 10,
      week: 4,
      isClickWeek: false,
    };
  }

  onClickValue = (name, value) => {
    this.setState({ [name]: value });
    if (name === "week") {
      this.setState({ isClickWeek: false });
    }
  };

  makeFixedSchedules = () => {
    const { date, time, week } = this.state;
    return Array.from({ length: week }, (_, i) => ({
      date: this.makeDateEveryWeek(date, i),
      time,
      memo: TUTOR_SCHEDULE.FIXED,
    }));
  };

  makeDateEveryWeek = (date, index) => {
    let DAYS = 7;
    return moment(date, "YYYY-MM-DD")
      .add(index * DAYS, "day")
      .format("YYYY-MM-DD");
  };

  onClickWeek = () => {
    this.setState({ isClickWeek: !this.state.isClickWeek });
  };

  render() {
    const { confirmAction, dismiss } = this.props;
    const { date, time, week, isClickWeek } = this.state;
    const { onClickWeek, onClickValue } = this;
    return (
      <div className="fix-schedule">
        <div className="popup_title">스케줄 고정 예약</div>
        <div className="popup_content">
          <div className="popup_content__row week">
            <label htmlFor="week">반복</label>
            <div>
              <input
                type="date"
                name="date"
                min={moment().add(1, "day").format("YYYY-MM-DD")}
                onChange={(e) => onClickValue("date", e.target.value)}
                value={date}
              />{" "}
              부터
            </div>
            <div>
              <div className="week">
                <p onClick={onClickWeek}>
                  {week}
                  <img src={dropdownIcon} alt="" className={isClickWeek ? "rotate" : ""} />
                </p>
                <ul className={isClickWeek ? "open" : ""}>
                  {weeks.map((_week, i) => (
                    <li
                      key={i}
                      onClick={() => onClickValue("week", _week)}
                      className={`${week === _week ? "active" : ""}`}
                    >
                      {_week}
                    </li>
                  ))}
                </ul>
              </div>
              주 동안
            </div>
          </div>
          <div className="popup_content__row day">
            <label htmlFor="day">요일</label>
            <ul>
              {days.map((_day, i) => (
                <li key={i} className={moment(date).day() === i ? "active" : ""}>
                  {_day}
                </li>
              ))}
            </ul>
          </div>
          <div className="popup_content__row time">
            <label htmlFor="time">시간</label>
            <ul>
              {times.map((_time, i) => (
                <li key={i} className={time === _time ? "active" : ""} onClick={() => onClickValue("time", _time)}>
                  {_time}시
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="popup_buttons">
          <button
            className="popup_button popup_button-cancel"
            onClick={() => {
              if (dismiss) dismiss();
            }}
          >
            취소
          </button>
          <button
            className="popup_button popup_button-save"
            onClick={() => {
              if (dismiss) dismiss();
              if (confirmAction) confirmAction(this.makeFixedSchedules());
            }}
          >
            저장
          </button>
        </div>
      </div>
    );
  }
}
