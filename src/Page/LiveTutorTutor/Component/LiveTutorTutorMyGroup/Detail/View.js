import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import moment from "moment";
import "moment/locale/ko";

function View(props) {
  const { lectureGroup, completeReservations, upcomingReservations, onEnterLecture, isCanLectureEnter } = props;

  if (!lectureGroup) return <div />;

  const day = moment(lectureGroup.day === 0 ? 7 : lectureGroup.day, "DD").format("dddd");
  const curriculumProgress = Math.floor((completeReservations.length / 12) * 100);

  return (
    <div className="Live_Tutor_Tutor_My_Group_Detail">
      <div className="header">
        <div className="title">{lectureGroup.name}</div>
        <div className="subTitle">
          {lectureGroup.lecture === "python_1v4" ? "데이터 지니어스" : "앱 크리에이터"} |{" "}
          {`매주 ${day} ${lectureGroup.startTime} ~ ${lectureGroup.finishTime}`}{" "}
        </div>
        <div className="progress_text_container">
          <span>{curriculumProgress}</span>
          <div className="text">% 수강</div>
          <div className="curriculum"> {12 - upcomingReservations.length} / 12차시</div>
        </div>
        <div className="progress_bar_container">
          <div className="progress" style={{ width: `${curriculumProgress}%` }} />
        </div>
      </div>

      <div className="section_title">예정 수업</div>
      {upcomingReservations.map((reservation, index) => {
        return (
          <GroupDetailCard
            key={index}
            reservation={reservation}
            lectureGroup={lectureGroup}
            onEnterLecture={onEnterLecture}
            isCanLectureEnter={isCanLectureEnter}
            isCompleted={false}
          />
        );
      })}

      <div className="section_title">완료 수업</div>
      {completeReservations.map((reservation, index) => {
        return (
          <GroupDetailCard
            key={index}
            reservation={reservation}
            lectureGroup={lectureGroup}
            onEnterLecture={onEnterLecture}
            isCanLectureEnter={isCanLectureEnter}
            isCompleted={true}
          />
        );
      })}
    </div>
  );
}

export default View;

function GroupDetailCard(props) {
  const { lectureGroup, reservation, isCompleted, isCanLectureEnter, onEnterLecture } = props;

  const feedbackUrl = {
    pathname: `/tutor/myGroupFeedback/${lectureGroup.id}/${reservation.roomId}`,
  };

  return (
    <div className="Live_Tutor_Tutor_My_Group_Detail_Card">
      <div className="left_container">
        <div className="title">{lectureGroup.name}</div>
        <div className="subTitle">{reservation.lecture.title}</div>
        <div className="date">{reservation.date}</div>

        <div className="button_container">
          {isCompleted ? (
            <Link className="left_button" to={feedbackUrl}>
              학습 평가 및 보기
            </Link>
          ) : (
            <button
              className="left_button"
              disabled={!isCanLectureEnter(reservation.date, reservation.time, reservation.minute)}
              onClick={() => {
                onEnterLecture(reservation);
              }}
            >
              수업 입장
            </button>
          )}
        </div>
      </div>

      <div className="right_container">
        {reservation.students.map((element, index) => {
          return <GroupDetailStudentProfile key={index} {...element} />;
        })}
      </div>
    </div>
  );
}

function GroupDetailStudentProfile(props) {
  const { studentGrade, studentName, studentIcon, studentEntranceTime } = props;
  const entranceTxt = studentEntranceTime ? "입장완료" : "대기";
  return (
    <div className="profile_container">
      <img src={studentIcon}></img>
      <div className="name">{studentName}</div>
      <div className="level">{studentGrade}</div>
      <button className={!studentEntranceTime && "ready"}>{entranceTxt}</button>
    </div>
  );
}
