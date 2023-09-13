import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import Dash from "./Component/LiveTutorTutorDash";
import Feedback from "./Component/LiveTutorTutorFeedback";
import ReservationList from "./Component/LiveTutorTutorReservationList";
import TutorGuide from "./Component/LiveTutorTutorGuide";
import TutorNotice from "./Component/LiveTutorTutorNotice";
import Schedule from "./Component/LiveTutorTutorSchedule";
import Students from "./Component/LiveTutorTutorStudents";
import Student from "./Component/LiveTutorTutorStudent";
import MyGroup from "./Component/LiveTutorTutorMyGroup";
import MyGroupDetail from "./Component/LiveTutorTutorMyGroup/Detail";
import MyGroupFeedback from "./Component/LiveTutorTutorMyGroup/Feedback";
import "./index.scss";

function View(props) {
  const { email, match, TAB_TYPE, selectedTab, handleSelectTab, tutorType } = props;
  var content;

  switch (match.params.page) {
    case "schedule":
      content = <Schedule email={email} tutorType={tutorType} />;
      break;
    case "reservationList":
      content = (
        <ReservationList
          selectedTab={match.params.mode}
          email={email}
          reservationEnum={global.reservationEnum[match.params.mode]}
        />
      );
      break;
    case "tutorGuide":
      content = <TutorGuide />;
      break;
    case "tutorNotice":
      content = <TutorNotice />;
      break;
    case "feedback":
      content = (
        <Feedback
          email={match.params.email}
          reservationId={match.params.id}
          isReadonly={match.params.isReadonly === "true"}
        />
      );
      break;
    case "myGroup":
      content = <MyGroup />;
      break;
    case "myGroupDetail":
      content = <MyGroupDetail lectureGroupId={match.params.mode} />;
      break;
    case "myGroupFeedback":
      content = <MyGroupFeedback lectureGroupId={match.params.lectureGroupId} roomId={match.params.roomId} />;
      break;
    case "students":
      content = <Students email={email} />;
      break;
    case "student":
      content = <Student tutorEmail={email} studentEmail={match.params.mode} />;
      break;
    default:
      content = <Dash email={email} tutorType={tutorType} />;
      break;
  }

  return (
    <div
      className={
        match.params.page === undefined
          ? "LiveTutorTutor"
          : `LiveTutorTutor--page LiveTutorTutor--page__${match.params.page}`
      }
    >
      <h2>
        <Link to="/tutor" className="LiveTutorTutor__header">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_LIVETUTOR" />
        </Link>
      </h2>
      <div
        className={`LiveTutorTutor--Header--contants ${
          match.url !== "/tutor" && !match.url.includes("myGroup") && "LiveTutorTutor--Header--contants--hide"
        }`}
      >
        <ul className="tabs-list">
          {[
            {
              type: TAB_TYPE.ALL,
              text: <FormattedMessage id="ID_RESERVATION_SECTION_ALL" />,
            },
            {
              type: TAB_TYPE.UPCOMING,
              text: <FormattedMessage id="ID_RESERVATION_SECTION_UPCOMMING" />,
            },
            {
              type: TAB_TYPE.COMPLETE,
              text: <FormattedMessage id="ID_RESERVATION_SECTION_COMPLETE" />,
            },
            {
              type: TAB_TYPE.CANCEL,
              text: <FormattedMessage id="ID_RESERVATION_SECTION_CANCEL" />,
            },
            {
              type: TAB_TYPE.MY_GROUP,
              text: <FormattedMessage id="ID_RESERVATION_SECTION_MY_GROUP" />,
            },
            {
              type: TAB_TYPE.GUIDE,
              text: <FormattedMessage id="ID_RESERVATION_SECTION_GUIDE" />,
            },
            {
              type: TAB_TYPE.NOTICE,
              text: <FormattedMessage id="ID_RESERVATION_SECTION_NOTICE" />,
            },
          ].map((tab, index) => {
            let path;
            switch (tab.type) {
              case TAB_TYPE.ALL:
                path = "";
                break;
              case TAB_TYPE.UPCOMING:
              case TAB_TYPE.CANCEL:
              case TAB_TYPE.COMPLETE:
                path = `/tutor/reservationList/${tab.type}`;
                break;
              case TAB_TYPE.MY_GROUP:
                path = `/tutor/myGroup`;
                break;
              case TAB_TYPE.GUIDE:
                path = `/tutor/tutorGuide`;
                break;
              case TAB_TYPE.NOTICE:
                path = `/tutor/tutorNotice`;
                break;
              default:
                path = "";
                break;
            }
            return (
              <Link to={path} className="LiveTutorTutor--Header--tabLink" key={index}>
                <div
                  key={index}
                  className={`LiveTutorTutor--Header--tab ${selectedTab === tab.type && "tab--on"} ${
                    tab.type === TAB_TYPE.MYWORKS && "tab--right"
                  }`}
                  onClick={() => handleSelectTab(tab.type)}
                >
                  {tab.text}
                </div>
              </Link>
            );
          })}
        </ul>
      </div>
      {/* 여기에서 page 표현 */}
      <div className="LiveTutorTutor__body">{content}</div>
    </div>
  );
}

export default View;
