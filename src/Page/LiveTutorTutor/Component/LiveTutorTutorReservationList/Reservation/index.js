import React from "react";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import "./index.scss";

function Reservation(props) {
  const {
    reservation,
    reservationEnum,
    onClickStart,
    onClickCancel,
    onClickFeedback,
    onClickPastReview,
    onClickMessage,
  } = props;

  const icon_url = reservation.student.icon;
  const name = reservation.student.name;
  const lectureStartAt = moment(`${reservation.date} ${reservation.time}:${reservation.minute}`, "YYYY-MM-DD HH:mm");

  let current = moment();
  let minStartTime = moment(lectureStartAt).add(-10, "m");
  let maxStartTime = moment(lectureStartAt).add(50, "m");
  if (reservation.type === "js_1v4" || reservation.type === "python_1v4") {
    maxStartTime = moment(lectureStartAt).add(90, "m");
  }

  // 출결
  const reservationDate = moment(`${reservation.date} ${reservation.time}:${reservation.minute}`, "YYYY-MM-DD HH:mm");

  if (reservation.studentEntranceTime && reservation.studentEntranceTime.endsWith("Z")) {
    reservation.studentEntranceTime = reservation.studentEntranceTime.substring(
      0,
      reservation.studentEntranceTime.length - 1,
    );
  }

  const entranceTime = moment(reservation.studentEntranceTime);
  const maxAttendanceTime = moment(reservationDate).add(10, "m"); // 출석 기준시간
  const maxLateTime = moment(reservationDate).add(30, "m"); // 결석 기준 시간

  const isAttendance = entranceTime.isSameOrBefore(maxAttendanceTime) && entranceTime.isSameOrAfter(minStartTime); // 출석
  const isLate = entranceTime.isAfter(maxAttendanceTime) && entranceTime.isSameOrBefore(maxLateTime);

  const isAbsence = !isAttendance && !isLate;
  const sameDayCancellation = reservation.memo === "sameDayCancellation";

  let webContent;
  let mobileContent;

  if (reservationEnum.key === "complete") {
    if (isAttendance) {
      webContent = (
        <p className="ReservationProfile__web--attention attendance">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_ATTENDANCE" />
        </p>
      );

      mobileContent = (
        <p className="ReservationProfile__mobile__textWrapper--attention attendance">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_ATTENDANCE" />
        </p>
      );
    } else if (isLate) {
      webContent = (
        <p className="ReservationProfile__web--attention attendance">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_LATE" />
        </p>
      );

      mobileContent = (
        <p className="ReservationProfile__mobile__textWrapper--attention attendance">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_LATE" />
        </p>
      );
    } else if (sameDayCancellation) {
      // 당일취소 체크
      webContent = (
        <p className="ReservationProfile__web--attention cancel">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_SAME_DAY_CANCELLATION" />
        </p>
      );

      mobileContent = (
        <p className="ReservationProfile__mobile__textWrapper--attention cancel">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_SAME_DAY_CANCELLATION" />
        </p>
      );
    } else {
      // 입장 시간이 출석, 지각이 아니면 모두 결석
      webContent = (
        <p className="ReservationProfile__web--attention absence">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_ABSENCE" />
        </p>
      );

      mobileContent = (
        <p className="ReservationProfile__mobile__textWrapper--attention absence">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_ABSENCE" />
        </p>
      );
    }
  }
  // 차시
  const classOrder = reservation.myLecture ? reservation.myLecture.lecture.title : undefined;

  // cell type
  const reservationKey = reservationEnum.key;

  const canStart = minStartTime <= current && current <= maxStartTime;
  const evaluated = reservation.myLecture && reservation.myLecture.feedback === null;

  let buttons = {
    upcoming: [
      canStart
        ? {
            state: "live",
            titleId: "ID_LIVETUTOR_TUTOR_CLASS_START",
            onClick: onClickStart,
          }
        : {
            state: "cancel",
            titleId: "ID_LIVETUTOR_TUTOR_CLASS_CANCEL",
            onClick: onClickCancel,
          },
      {
        state: "past",
        titleId: "ID_LIVETUTOR_TUTOR_CLASS_PASTREVIEW",
        onClick: onClickPastReview,
      },
    ],
    complete: [
      {
        state: isAbsence ? "enable" : evaluated ? "active" : "live",
        titleId: isAbsence
          ? "ID_LIVETUTOR_TUTOR_CLASS_NOFEEDBACK"
          : evaluated
          ? "ID_LIVETUTOR_TUTOR_CLASS_NOFEEDBACK"
          : "ID_LIVETUTOR_TUTOR_CLASS_FEEDBACK",
        onClick: isAbsence ? () => {} : onClickFeedback,
      },
      {
        state: "past",
        titleId: "ID_LIVETUTOR_TUTOR_CLASS_PASTREVIEW",
        onClick: onClickPastReview,
      },
    ],
    canceled: [
      {
        state: "past",
        titleId: "ID_LIVETUTOR_TUTOR_CLASS_PASTREVIEW",
        onClick: onClickPastReview,
      },
    ],
  };

  return (
    <div className={`Reservation ${reservationEnum === global.reservationEnum.canceled ? "inactive" : ""}`}>
      {/* 프로필 웹 버전 */}
      <img className="ReservationImage--web" src={icon_url} alt={name} title={name} />
      <div className="ReservationProfile__web__wrapper">
        <div className={`ReservationProfile--${reservationKey}`}>
          {webContent}
          <p>
            <FormattedMessage id="ID_LIVETUTOR_TUTOR_STUDENT" />
            {` : ${name}`}
          </p>
          <p>
            <FormattedMessage id="ID_LIVETUTOR_TUTOR_TIME" />
            {` : `}
            <FormattedMessage id={`ID_DATE_MONTH_${lectureStartAt.month()}`}>
              {(month) => (
                <FormattedMessage id="ID_DATE_DATE" values={{ date: lectureStartAt.date() }}>
                  {(date) => <FormattedMessage id="ID_DATE_FORMAT_MONTHDATE" values={{ date: date, month: month }} />}
                </FormattedMessage>
              )}
            </FormattedMessage>
            {` ${lectureStartAt.format("H:mm")}`}
          </p>
          {reservationKey !== "canceled" && (
            <p>
              <FormattedMessage id="ID_LIVETUTOR_TUTOR_CLASS" />
              {` : ${classOrder}`}
            </p>
          )}
        </div>
        <div className="ReservationMessage--web" onClick={onClickMessage}>
          <p className="ReservationMessage__icon" />
          <p className="ReservationMessage__title">
            <FormattedMessage id="ID_LIVETUTOR_TUTOR_MESSAGE_TITLE" />
          </p>
        </div>
      </div>

      {/* 프로필 모바일 버전 */}
      <div className="ReservationProfile__mobile__wrapper">
        <div className="ReservationProfile__mobile">
          <img className="ReservationProfile__mobile--iconImage" src={icon_url} alt={name} title={name} />
          <div className={`ReservationProfile__mobile__textWrapper--${reservationKey}`}>
            {mobileContent}
            <p>
              <FormattedMessage id="ID_LIVETUTOR_TUTOR_STUDENT" />
              {` : ${name}`}
            </p>
            <p>
              <FormattedMessage id="ID_LIVETUTOR_TUTOR_TIME" />
              {` : `}
              <FormattedMessage id={`ID_DATE_MONTH_${lectureStartAt.month()}`}>
                {(month) => (
                  <FormattedMessage id="ID_DATE_DATE" values={{ date: lectureStartAt.date() }}>
                    {(date) => <FormattedMessage id="ID_DATE_FORMAT_MONTHDATE" values={{ date: date, month: month }} />}
                  </FormattedMessage>
                )}
              </FormattedMessage>
              {` ${lectureStartAt.format("H:mm")}`}
            </p>

            {reservationKey !== "canceled" && (
              <p>
                <FormattedMessage id="ID_LIVETUTOR_TUTOR_CLASS" />
                {` : ${classOrder}`}
              </p>
            )}
          </div>
        </div>
        <p className="ReservationMessage__mobile--icon" />
      </div>

      {/* 버튼 부분 */}
      <div className="ReservationButtons">
        {buttons[reservationEnum.key].map((element, index) => {
          return (
            <button
              key={index}
              className={`ReservationButton ${element.state}`}
              onClick={element.state === "active" || "live" ? element.onClick : () => {}}
            >
              <FormattedMessage id={element.titleId} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Reservation;
