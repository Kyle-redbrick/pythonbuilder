import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
import StudentProgress from "../../Common/Component/StudentProgress";
import * as TrackingUtil from "./../../Common/Util/TrackingUtil";
import "./index.scss";

function View(props) {
  // const { feedback, title, curriculum } = props;
  const { email, feedback } = props;
  if (!feedback) {
    return <div />;
  }

  return (
    <div className="LiveTutorStudentFeedback">
      <h1 className="LiveTutorStudentFeedback__title">위즈라이브</h1>
      {/* <ul className="LiveTutorStudentFeedback__nav">
        <li className="LiveTutorStudentFeedback__nav__item">
          <Link to="/student">전체</Link>
        </li>
        <li className="LiveTutorStudentFeedback__nav__item">
          <Link to="/student?tab=upcoming" params={{ tab: "upcoming" }}>
            예정 수업
          </Link>
        </li>
        <li className="LiveTutorStudentFeedback__nav__item">
          <Link to="/student?tab=complete">완료 수업</Link>
        </li>
        <li className="LiveTutorStudentFeedback__nav__item">
          <Link to="/student?tab=canceled">취소 수업</Link>
        </li>
      </ul> */}
      <h2 className="LiveTutorStudentFeedback__subtitle">학습 내용</h2>
      <h3 className="LiveTutorStudentFeedback__section_title">{feedback.title}</h3>
      <StudentProgress email={email} />
      <table className="LiveTutorStudentFeedback__table">
        <thead className="LiveTutorStudentFeedback__thead">
          <tr>
            <th className="LiveTutorStudentFeedback__th LiveTutorStudentFeedback__th__left">학습 목표</th>
            <th className="LiveTutorStudentFeedback__th">평가</th>
          </tr>
        </thead>
        <tbody>
          {feedback.feedbacks.map((feedback, index) => {
            return (
              <tr key={index}>
                <td className="LiveTutorStudentFeedback__td LiveTutorStudentFeedback__td__left">{feedback.title}</td>
                <td className="LiveTutorStudentFeedback__td">{feedback.level}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="LiveTutorStudentFeedback__hint">
        *점수는 1~5까지 표기하고 숫자가 클수록 학습역량이 우수합니다.
      </div>
      <h3 className="LiveTutorStudentFeedback__section_title">담당 튜터 총평</h3>
      <div className="LiveTutorStudentFeedback__msg">{feedback.message}</div>
    </div>
  );
  // return (
  //   <div className="LiveTutorStudentFeedback">
  //     <h2 className="LiveTutorStudentFeedback__subtitle">학습 내용</h2>
  //     <div className="LiveTutorStudentFeedback__info">
  //       <p className="curriculum__title">{curriculum}</p>
  //       <p className="level__title">{title}</p>
  //     </div>
  //     <table className="LiveTutorStudentFeedback__table">
  //       <thead className="LiveTutorStudentFeedback__thead">
  //         <tr>
  //           <th className="LiveTutorStudentFeedback__th LiveTutorStudentFeedback__th__left">
  //             학습 목표
  //           </th>
  //           <th className="LiveTutorStudentFeedback__th">평가</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {feedback.feedbacks.map((feedback, index) => {
  //           return (
  //             <tr key={index}>
  //               <td className="LiveTutorStudentFeedback__td LiveTutorStudentFeedback__td__left">
  //                 {feedback.title}
  //               </td>
  //               <td className="LiveTutorStudentFeedback__td">
  //                 {feedback.level}
  //               </td>
  //             </tr>
  //           );
  //         })}
  //       </tbody>
  //     </table>
  //     <div className="LiveTutorStudentFeedback__hint">
  //       *점수는 1~5까지 표기하고 숫자가 클수록 학습역량이 우수합니다.
  //     </div>
  //     <h3 className="LiveTutorStudentFeedback__section_title">
  //       담당 튜터 총평
  //     </h3>
  //     <div className="LiveTutorStudentFeedback__msg">{feedback.message}</div>
  //   </div>
  // );
}

export default View;
