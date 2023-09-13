import React from "react";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import "./index.scss";

function LiveTutorTutorCalendar(props) {
  const { currentMonth, monthlyReservations, onClickNextMonth } = props;

  const today = moment();
  const endDate = moment(currentMonth).endOf("M").date();
  const lastMonthDate = moment(currentMonth).startOf("M").add(-1, "d").date();
  const startDay = moment(currentMonth).startOf("M").day();

  let weeksCount = Math.ceil((startDay + endDate) / 7);
  let weeks = Array(weeksCount);
  for (let i = 0; i < weeks.length; i++) {
    weeks[i] = Array(7);
  }
  for (let i = 0; i < weeksCount * 7; i++) {
    let w = Math.floor(i / 7);
    let d = i % 7;
    let month = currentMonth.month();
    let date = i + 1 - startDay;
    if (date <= 0) {
      month--;
      date += lastMonthDate;
    } else if (date > endDate) {
      month++;
      date -= endDate;
    }
    if (month > 11) {
      month -= 11;
    } else if (month < 0) {
      month += 12;
    }
    weeks[w][d] = moment({
      year: currentMonth.year(),
      month: month,
      date: date,
    });
  }

  let schedules = Array(endDate);
  for (let i = 0; i < endDate; i++) {
    schedules[i] = [];
  }
  if (monthlyReservations) {
    const sorted = [...monthlyReservations].reverse();
    sorted.forEach((schedule) => {
      schedules[schedule.date - 1].push(schedule);
    });
  }
  return (
    <div className="LiveTutorTutorCalendar">
      <div className="month">
        <ul>
          <li className="button prev" onClick={onClickNextMonth.bind(this, false)}>
            &#10094;
          </li>
          <li className="button next" onClick={onClickNextMonth.bind(this, true)}>
            &#10095;
          </li>
          <li>
            <h5>
              <FormattedMessage id="ID_DATE_YEAR" values={{ year: currentMonth.year() }}>
                {(year) => (
                  <FormattedMessage id={`ID_DATE_MONTH_${currentMonth.month()}`}>
                    {(month) => (
                      <FormattedMessage id="ID_DATE_FORMAT_YEARMONTH" values={{ year: year, month: month }} />
                    )}
                  </FormattedMessage>
                )}
              </FormattedMessage>
            </h5>
          </li>
        </ul>
      </div>
      <div className="day">
        <ul>
          {[...Array(7)].map((element, index) => (
            <li key={index} className={index === 0 ? "Sunday" : ""}>
              <div className="day__inner">
                <h5>
                  <FormattedMessage id={`ID_DATE_DAY_${index}`} />
                </h5>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="date">
        {weeks.map((week, index) => (
          <ul key={index}>
            {week.map((date, index) => {
              let schedule = schedules[date.date() - 1];
              let liClass = "";
              if (
                (date.set("year", currentMonth.year()).isBefore(today) &&
                  !date.set("year", currentMonth.year()).isSame(today, "day")) ||
                !date.isSame(currentMonth, "M")
              ) {
                liClass = "Other";
              } else if (date.isSame(today.startOf("D"))) {
                liClass = "Today";
              } else if (index === 0) {
                liClass = "Sunday";
              }
              let innerClass = "date__inner ";
              if (date.isSame(currentMonth, "M") && schedule[0]) {
                innerClass += date >= today ? "Active" : "InActive";
              }
              return (
                <li key={index} className={liClass}>
                  <div className={innerClass}>
                    <h5>{date.date()}</h5>
                    {date.isSame(currentMonth, "M") && schedule[0] && (
                      <span className="tooltip">
                        {schedule.map((s, index) => (
                          <h4 key={index}>{`${s.time}:00 ${s.name}`}</h4>
                        ))}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default LiveTutorTutorCalendar;
