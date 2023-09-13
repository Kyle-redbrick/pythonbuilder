import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import Reservation from "./Reservation";
import "./index.scss";

function View(props) {
  const {
    reservationEnum,
    reservations,
    totalReservationCount,
    onClickTab,
    onClickMessage,
    onClickStart,
    onClickCancel,
    onClickFeedback,
    onClickPastReview,
    onClickMore,
    handleEnvTest,
  } = props;

  let title;

  switch (reservationEnum.key) {
    case "complete":
      title = (
        <p className="Count">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_CLASS_NAME_COMPLETE" />
        </p>
      );
      break;

    case "upcoming":
      title = (
        <p className="Count">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_CLASS_NAME_UPCOMING" />
        </p>
      );
      break;

    case "canceled":
      title = (
        <p className="Count">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_CLASS_NAME_CANCELED" />
        </p>
      );
      break;

    default:
      title = "";
  }

  const tutor = {
    tutor: {
      attribute: "tutorPage",
      key: "tutor",
    },
  };

  const newReservationEnum = Object.assign(tutor, global.reservationEnum);

  return (
    <div className="LiveTutorTutor__ReservationList">
      <div className="LiveTutorTutor__Tabs">
        {Object.keys(newReservationEnum).map((key, index) => {
          const currentEnum = newReservationEnum[key];
          if (key === "guide" || key === "notice") {
            return <Fragment key={index} />;
          }
          return currentEnum === reservationEnum ? (
            <p className="LiveTutorTutor__Tab on" key={index}>
              <FormattedMessage id={"ID_LIVETUTOR_TUTOR_" + currentEnum.key.toUpperCase()}>
                {(name) =>
                  currentEnum.key === "tutor" ? (
                    <FormattedMessage id="ID_LIVETUTOR_TUTOR_TUTOR" />
                  ) : currentEnum.key === "tutorGuide" || currentEnum.key === "tutorNotice" ? (
                    <Fragment />
                  ) : (
                    <FormattedMessage id="ID_LIVETUTOR_TUTOR_CLASS_NAME" values={{ name: name }} />
                  )
                }
              </FormattedMessage>
            </p>
          ) : currentEnum.key === "tutor" ? (
            <Link to={`../../tutor`} className="LiveTutorTutor__Tab off" onClick={onClickTab} key={index}>
              <FormattedMessage id={"ID_LIVETUTOR_TUTOR_" + currentEnum.key.toUpperCase()}>
                {(name) =>
                  currentEnum.key === "tutor" ? (
                    <FormattedMessage id="ID_LIVETUTOR_TUTOR_TUTOR" />
                  ) : (
                    <FormattedMessage id="ID_LIVETUTOR_TUTOR_CLASS_NAME" values={{ name: name }} />
                  )
                }
              </FormattedMessage>
            </Link>
          ) : (
            <Link to={`${currentEnum.key}`} className="LiveTutorTutor__Tab off" onClick={onClickTab} key={index}>
              <FormattedMessage id={"ID_LIVETUTOR_TUTOR_" + currentEnum.key.toUpperCase()}>
                {(name) =>
                  currentEnum.key === "tutor" ? (
                    <FormattedMessage id="ID_LIVETUTOR_TUTOR_TUTOR" />
                  ) : (
                    <FormattedMessage id="ID_LIVETUTOR_TUTOR_CLASS_NAME" values={{ name: name }} />
                  )
                }
              </FormattedMessage>
            </Link>
          );
        })}
      </div>
      <hr className="line" />

      <div className="LiveTutorStudent--EnvTest">
        <button className="LiveTutorStudent--EnvTest--button" onClick={handleEnvTest}>
          <p className="LiveTutorStudent--EnvTest--image" />
          수업 환경 테스트
        </button>
      </div>

      <div className="Reservations">
        <div className="CountWrapper">
          {title}
          <p className="Count">
            <FormattedMessage id="ID_LIVETUTOR_TUTOR_CLASS_COUNT" values={{ count: totalReservationCount }} />
          </p>
        </div>
        {reservations.length > 0 ? (
          reservations.map((reservation, index) => (
            <Reservation
              key={index}
              reservation={reservation}
              reservationEnum={reservationEnum}
              onClickStart={onClickStart.bind(this, reservation)}
              onClickCancel={onClickCancel.bind(this, reservation)}
              onClickMessage={onClickMessage.bind(this, reservation)}
              onClickFeedback={onClickFeedback.bind(this, reservation)}
              onClickPastReview={onClickPastReview.bind(this, reservation)}
            />
          ))
        ) : (
          <div className="Empty">
            <h4>
              {reservationEnum && (
                <FormattedMessage id={"ID_LIVETUTOR_TUTOR_" + reservationEnum.key.toUpperCase()}>
                  {(name) => <FormattedMessage id={"ID_LIVETUTOR_TUTOR_CLASS_EMPTY"} values={{ name: name }} />}
                </FormattedMessage>
              )}
            </h4>
          </div>
        )}
      </div>
      {reservations.length < totalReservationCount && (
        <div className="More" onClick={onClickMore}>
          <hr className="line" />
          <h4>
            <FormattedMessage id="ID_LIVETUTOR_TUTOR_MORE" />
          </h4>
        </div>
      )}
    </div>
  );
}

export default View;
