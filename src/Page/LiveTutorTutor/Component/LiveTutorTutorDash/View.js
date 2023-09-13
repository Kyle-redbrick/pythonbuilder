import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import Frame from "./Component/LiveTutorTutorFrame";
import RatingActivity from "./Component/LiveTutorTutorRatingActivity";
import Calendar from "./Component/LiveTutorTutorCalendar";
import Reservations from "./Component/LiveTutorTutorReservations";
import "./index.scss";

function View(props) {
  const {
    tutorActivity,
    tutorReservations,
    currentMonth,
    monthlyReservations,
    onClickReservation,
    onClickRating,
    onClickNextMonth,
  } = props;

  return (
    <div className="LiveTutorTutor__Dash">
      <div className="columns">
        <div className="left column">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_RATINGACTIVITY">
            {(title) => (
              <Frame title={title}>
                <RatingActivity tutorActivity={tutorActivity} onClickRating={onClickRating} />
              </Frame>
            )}
          </FormattedMessage>
          <Frame>
            <Calendar
              currentMonth={currentMonth}
              monthlyReservations={monthlyReservations}
              onClickNextMonth={onClickNextMonth}
            />
          </Frame>
          <div className="LiveTutorTutor__Button__Wrapper">
            <Link to={`tutor/schedule`}>
              <button className="LiveTutorTutor__Button">
                <FormattedMessage id="ID_LIVETUTOR_TUTOR_SCHEDULE_TITLE" />
              </button>
            </Link>
          </div>
        </div>
        <div className="right column">
          {Object.keys(global.reservationEnum).map((key, index) => {
            const reservationEnum = global.reservationEnum[key];
            const reservations = tutorReservations[reservationEnum.attribute];
            if (key === "guide" || key === "notice") {
              return <Fragment key={index} />;
            }
            return (
              <FormattedMessage key={index} id={"ID_LIVETUTOR_TUTOR_" + reservationEnum.key.toUpperCase()}>
                {(name) => (
                  <FormattedMessage id="ID_LIVETUTOR_TUTOR_CLASS_NAME" values={{ name: name }}>
                    {(title) => (
                      <FormattedMessage id="ID_LIVETUTOR_TUTOR_CLASS_COUNT" values={{ count: reservations.count || 0 }}>
                        {(subtitle) => (
                          <Frame
                            title={title}
                            subtitle={subtitle}
                            link={`tutor/reservationList/${reservationEnum.key}`}
                          >
                            {reservations && (
                              <Reservations
                                reservations={reservations.rows || []}
                                reservationEnum={reservationEnum}
                                onClickReservation={onClickReservation}
                              />
                            )}
                          </Frame>
                        )}
                      </FormattedMessage>
                    )}
                  </FormattedMessage>
                )}
              </FormattedMessage>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default View;
