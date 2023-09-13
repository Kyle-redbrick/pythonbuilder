import React from "react";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import { showPopUp, TutorFixedSchedule } from "../../../../Common/Component/PopUp";
import { Holidays } from "../../../../Common/Util/Constant";
import { TUTOR_SCHEDULE } from "./Container";
import plusIcon from "../../../../Image/icon_plus.svg";
import calendarIcon from "../../../../Image/icon_calendar.svg";
import "./index.scss";

function View(props) {
  const {
    schedules,
    startTime,
    endTime,
    currentMonth,
    onClickNextMonth,
    onClickDate,
    onClickHour,
    onClickTime,
    onClickSave,
    onClickCancel,
    tutorType,
    postTutorMonthlySchedule,
    currentWeek,
    onClickWeek,
    activeNum,
    isActive,
    scheduleCount,
    fixedSchedules,
  } = props;
  const today = moment();
  const startDate = currentMonth.startOf("M");
  const dayCount = currentMonth.daysInMonth();
  const timeCategory = ["registered", "pastRegistered", "fixed", "registerable", "noncancelable", "past"];

  const handleTutorSchedule = (status) => {
    switch (status) {
      case TUTOR_SCHEDULE.OPEN:
        return "isOn";
      case TUTOR_SCHEDULE.FIXED:
        return "isFixed";
      case TUTOR_SCHEDULE.RESERVED:
        return "isReserved";
      default:
        return "isOff";
    }
  };

  const render = ({ activeNum, isActive }) => {
    return (
      <>
        <MonthPicker currentMonth={currentMonth} onClickNextMonth={onClickNextMonth} />
        <div className="DatePicker">
          <div className="DatePicker__Container">
            <ul className="DatePicker__Days">
              <li className="header" />
              <li />
              {[...Array(dayCount)].map((_, index) => {
                const day = (startDate.day() + index) % 7;
                const date = startDate.date() + index;
                const isHoliday = Holidays.indexOf(moment(currentMonth).date(date).format("YYYY-MM-DD")) !== -1;

                let className = day !== 0 ? (day === 6 ? "Saturaday" : "") : "Sunday";

                if (isHoliday) {
                  className += " holiday";
                }
                return (
                  <li key={index} className={className}>
                    <FormattedMessage id={`ID_DATE_DAY_${day}`} />
                  </li>
                );
              })}
            </ul>
            <ul className="DatePicker__Dates">
              <li className="header" />
              <li />
              {[...Array(dayCount)].map((_, index) => {
                const day = (startDate.day() + index) % 7;
                const date = startDate.date() + index;
                const isToday = today.startOf("d").isSame(moment(currentMonth).date(date).startOf("d"));
                const isHoliday = Holidays.indexOf(moment(currentMonth).date(date).format("YYYY-MM-DD")) !== -1;
                let className = isToday ? "Today" : day !== 0 ? (day === 6 ? "Saturaday" : "") : "Sunday";
                if (isHoliday) {
                  className += " holiday";
                }
                return (
                  <li key={index} onClick={onClickDate.bind(this, date)} className={className}>
                    <div className="DatePicker__Date">{date}</div>
                  </li>
                );
              })}
            </ul>
            <div className="DatePicker__Times">
              {[...Array(endTime - startTime + 1)].map((_, index) => {
                const time = startTime + index;
                return (
                  <ul key={index}>
                    <li className="header" onClick={onClickHour.bind(this, time)}>
                      <div className="DatePicker__Hour">{`${time}:00`}</div>
                    </li>
                    <li />
                    {[...Array(dayCount)].map((_, index) => {
                      const date = startDate.date() + index;
                      const isAfter = today.startOf("d").isSameOrAfter(moment(currentMonth).date(date).startOf("d"));
                      const status = schedules[date - 1][time].status;
                      var divClass = `DatePicker__Time ${isAfter ? "isAfter" : "isBefore"} ${handleTutorSchedule(
                        status,
                      )}`;
                      return (
                        <li
                          key={index}
                          onClick={() => {
                            if (isAfter || status === TUTOR_SCHEDULE.RESERVED || status === TUTOR_SCHEDULE.FIXED)
                              return;
                            onClickTime(date, time, null);
                          }}
                        >
                          <div className={divClass} />
                        </li>
                      );
                    })}
                  </ul>
                );
              })}
            </div>
          </div>
        </div>
        <div className="ButtonTab">
          <button className={`button complete ${isActive ? "active" : ""}`} onClick={onClickSave} disabled={!isActive}>
            <FormattedMessage id="ID_LIVETUTOR_TUTOR_SAVE_SCHEDULE" /> {activeNum > 0 && `(${activeNum})`}
          </button>
          {isActive && (
            <button className="button cancel" onClick={onClickCancel}>
              <FormattedMessage id="ID_LIVETUTOR_TUTOR_RESET_SCHEDULE" />
            </button>
          )}
        </div>
        <div className="Categories">
          <div className="scheduled_count">
            <FormattedMessage
              id="ID_LIVETUTOR_TUTOR_SCHEDULED_COUNT"
              values={{
                month: currentMonth.month() + 1,
                count: scheduleCount,
              }}
            />
          </div>
          <div className="scheduled_list">
            {timeCategory.map((category, index) => (
              <div key={index} className="Category">
                <div className={`Category_Paint ${category}`} />
                <h5>
                  <FormattedMessage id={`ID_LIVETUTOR_TUTOR_SCHEDULE_${category.toUpperCase()}`} />
                </h5>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  if (tutorType === "js") {
    return (
      <div className="LiveTutorTutor__Schedule">
        <ScheduleInfo
          postTutorMonthlySchedule={postTutorMonthlySchedule}
          currentWeek={currentWeek}
          onClickWeek={onClickWeek}
          fixedSchedules={fixedSchedules}
          startDate={startDate}
          currentMonth={currentMonth}
          onClickNextMonth={onClickNextMonth}
        />
        <hr className="line" />
        <div className="LiveTutorTutor__Tabs">
          <h3 className="LiveTutorTutor__Tab">자바스크립트 스케줄 관리</h3>
        </div>
        {render({ activeNum, isActive })}
      </div>
    );
  } else {
    return (
      <div className="LiveTutorTutor__Schedule">
        <ScheduleInfo
          postTutorMonthlySchedule={postTutorMonthlySchedule}
          currentWeek={currentWeek}
          onClickWeek={onClickWeek}
          fixedSchedules={fixedSchedules}
          startDate={startDate}
          currentMonth={currentMonth}
          onClickNextMonth={onClickNextMonth}
        />
        <hr className="line" />
        <div className="LiveTutorTutor__Tabs">
          <h3 className="LiveTutorTutor__Tab">파이썬 스케줄 관리</h3>
        </div>
        {render({ activeNum, isActive })}
      </div>
    );
  }
}

const ScheduleInfo = ({
  postTutorMonthlySchedule,
  fixedSchedules,
  currentWeek,
  onClickWeek,
  startDate,
  currentMonth,
  onClickNextMonth,
}) => {
  const num = Object.values(fixedSchedules).flat().length;
  return (
    <div className="live-tutor-schedule">
      <div className="live-tutor-schedule__info">
        <MonthPicker currentMonth={currentMonth} onClickNextMonth={onClickNextMonth} />
        <p className="live-tutor-schedule__title">내 고정 스케줄{num > 0 && <span>{num}</span>}</p>
        {num > 0 ? (
          <ScheduleBox
            postTutorMonthlySchedule={postTutorMonthlySchedule}
            currentWeek={currentWeek}
            onClickWeek={onClickWeek}
            fixedSchedules={Object.entries(fixedSchedules)}
            startDate={startDate}
          />
        ) : (
          <DefaultScheduleBox postTutorMonthlySchedule={postTutorMonthlySchedule} />
        )}
      </div>
      <ul className="live-tutor-schedule__list">
        <li>꼭 읽어주세요!</li>
        <li>•&nbsp;&nbsp;수업 시작일, 시간을 선택하신 일정에 맞춰 수강생과 고정적으로 수업 진행이 가능합니다</li>
        <li>
          •&nbsp;&nbsp;등록한 고정 스케줄은 수강생에게 직접 노출되지 않습니다. 고정 수업이 가능한 수업 시작일, 시간을
          선택해주시면 학생과 튜터님을 적극 매칭해 드리고 있습니다.
        </li>
        <li>
          •&nbsp;&nbsp;고정 스케줄 등록 후, 수정 및 취소는 위즈라이브 운영팀으로 요청주시기 바랍니다. (직접 수정 및 취소
          불가능)
        </li>
      </ul>
    </div>
  );
};

const AddScheduleBtn = ({ postTutorMonthlySchedule }) => {
  return (
    <button
      type="button"
      className="add-schedule-btn"
      onClick={() =>
        showPopUp(
          <TutorFixedSchedule
            confirmAction={(add) => {
              postTutorMonthlySchedule(add);
            }}
          />,
          null,
          false,
          true,
          true,
          true,
          "tutorFixedSchedule",
        )
      }
    >
      <img src={plusIcon} alt="" />
      고정 스케줄 등록
    </button>
  );
};

const ScheduleBox = ({ postTutorMonthlySchedule, currentWeek, onClickWeek, fixedSchedules, startDate }) => {
  return (
    <div className="schedule-box">
      <AddScheduleBtn postTutorMonthlySchedule={postTutorMonthlySchedule} />
      <ul className="schedule-box__list">
        {fixedSchedules.map(([day, list]) => {
          return (
            <li key={day}>
              <p className="schedule-box__list__day">{moment(Number(day), "days").format("dd")}</p>
              <ul>
                {list.length === 0 && <li className="schedule-box__list__box--default">고정 스케줄 없음</li>}
                {list
                  .sort((a, b) => a.time - b.time)
                  .map(({ date, time }) => (
                    <li key={date + time} className="schedule-box__list__box">
                      <span className="schedule-box__list__time">{`${time}시`}</span>
                      <span className="schedule-box__list__date">
                        {moment(startDate)
                          .clone()
                          .add(date - 1, "days")
                          .format("YYYY.MM.DD")}
                      </span>
                    </li>
                  ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <div className="schedule-box__list--mobile">
        <div className="schedule-box__list--mobile__tabs">
          {fixedSchedules.map(([day, list], i) => {
            return (
              <div
                key={i}
                className={`schedule-box__list--mobile__day ${currentWeek === i ? "active" : ""}`}
                onClick={() => onClickWeek(i)}
              >
                {moment(Number(day), "days").format("ddd")}
              </div>
            );
          })}
        </div>
        <div className="schedule-box__list--mobile__boxes">
          {fixedSchedules[currentWeek][1].length > 0 ? (
            fixedSchedules[currentWeek][1].map(({ date, time }, i) => (
              <div key={i} className="schedule-box__list__mobile__box">
                <span className="schedule-box__list__time">{`${time}시`}</span>
                <span className="schedule-box__list__date">
                  {moment(startDate)
                    .clone()
                    .add(date - 1, "days")
                    .format("YYYY.MM.DD")}
                </span>
              </div>
            ))
          ) : (
            <div className="schedule-box__list__mobile__box--default">고정 스케줄 없음</div>
          )}
        </div>
      </div>
    </div>
  );
};

const DefaultScheduleBox = ({ postTutorMonthlySchedule }) => {
  return (
    <div className="schedule-box--default">
      <div>
        <img src={calendarIcon} alt="" />
        <span>등록된 고정 스케줄이 없습니다</span>
      </div>
      <AddScheduleBtn postTutorMonthlySchedule={postTutorMonthlySchedule} />
    </div>
  );
};

const MonthPicker = ({ currentMonth, onClickNextMonth }) => {
  return (
    <div className="MonthPicker">
      <h4>
        <FormattedMessage id="ID_DATE_YEAR" values={{ year: currentMonth.year() }} />
      </h4>
      <p className="MonthPicker__Arrow left" onClick={onClickNextMonth.bind(this, false)} />
      <h4>
        <FormattedMessage id={`ID_DATE_MONTH_${currentMonth.month()}`} />
      </h4>
      <p className="MonthPicker__Arrow right" onClick={onClickNextMonth.bind(this, true)} />
    </div>
  );
};

export default View;
