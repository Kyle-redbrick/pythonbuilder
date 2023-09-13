import React, { Fragment } from "react";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { Link } from "react-router-dom";
import "./index.scss";

function LiveTutorTutorReservations(props) {
  const { reservations, reservationEnum, onClickReservation } = props;

  return (
    <div className="LiveTutorTutor__Reservations">
      {reservations.length === 0 ? (
        <div className="LiveTutorTutor__Reservations__Empty">
          <h4>
            <FormattedMessage id={"ID_LIVETUTOR_TUTOR_" + reservationEnum.key.toUpperCase()}>
              {(name) => <FormattedMessage id={"ID_LIVETUTOR_TUTOR_CLASS_EMPTY"} values={{ name: name }} />}
            </FormattedMessage>
          </h4>
        </div>
      ) : (
        <Fragment>
          {reservations.map((reservation, index) => {
            const date = moment(reservation.date, "YYYY-MM-DD");
            const time = reservation.time;
            const minute = reservation.minute;
            return (
              <Link to={`/tutor/student/${reservation.studentEmail}`} key={index}>
                <div
                  className="LiveTutorTutor__Reservation"
                  key={index}
                  onClick={onClickReservation.bind(this, reservation)}
                >
                  <h4>
                    <FormattedMessage id={`ID_DATE_MONTH_${date.month()}`}>
                      {(month) => (
                        <FormattedMessage id="ID_DATE_DATE" values={{ date: date.date() }}>
                          {(date) => (
                            <FormattedMessage id="ID_DATE_FORMAT_MONTHDATE" values={{ date: date, month: month }} />
                          )}
                        </FormattedMessage>
                      )}
                    </FormattedMessage>
                  </h4>
                  <h4>{time + ":" + minute}</h4>
                  <img
                    className="LiveTutorTutor__ReservationImage"
                    src={reservation.student.icon}
                    alt={reservation.student.name}
                    title={reservation.student.name}
                  />
                  <h4>{reservation.student.name}</h4>
                </div>
              </Link>
            );
          })}
        </Fragment>
      )}
    </div>
  );
}

export default LiveTutorTutorReservations;
