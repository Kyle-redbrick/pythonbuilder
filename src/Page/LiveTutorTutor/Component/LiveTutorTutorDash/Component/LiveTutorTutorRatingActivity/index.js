import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import "./index.scss";

function RatingStar({ rating }) {
  const starCount = 5;
  return (
    <div className="LiveTutorTutor__Rating__Stars">
      {[...Array(starCount)].map((e, i) => (
        <p key={i} className={`LiveTutorTutor__Rating__Star ${i + 0.5 <= rating ? "on" : "off"}`} />
      ))}
    </div>
  );
}

function LiveTutorTutorRatingActivity(props) {
  const { tutorActivity, onClickRating } = props;
  var rating = (tutorActivity.ratingSum / tutorActivity.ratingCount).toFixed(1);
  if (isNaN(rating)) {
    rating = 0;
  }
  return (
    <div className="LiveTutorTutor__RatingActivity">
      <div className="LiveTutorTutor__Rating" onClick={onClickRating.bind(this, rating)}>
        <RatingStar rating={rating} />
        <h4 className="LiveTutorTutor__Rating__Rating">
          {rating || "0.0"} / 5.0 ({tutorActivity.ratingCount || 0})
        </h4>
      </div>
      <div className="LiveTutorTutor__Activity">
        <Link to={`/tutor/students`}>
          <div className="LiveTutorTutor__Activity__header">
            <h4 className="title">
              <FormattedMessage id="ID_LIVETUTOR_TUTOR_ACTIVITY_STUDENTS" />
            </h4>
            <h4 className="subtitle">
              <FormattedMessage
                id="ID_LIVETUTOR_TUTOR_ACTIVITY_STUDENTS_COUNT"
                values={{ count: tutorActivity.studentsCount || 0 }}
              />
            </h4>
          </div>
        </Link>
        <div className="LiveTutorTutor__Activity__Students">
          {(tutorActivity.studentsRecent || []).length === 0 ? (
            <div className="LiveTutorTutor__Activity__Student__Empty">
              <h5>
                <FormattedMessage id="ID_LIVETUTOR_TUTOR_ACTIVITY_STUDENTS_EMPTY" />
              </h5>
            </div>
          ) : (
            tutorActivity.studentsRecent.map((student, index) => {
              const email = student.studentEmail;
              if (!email || !student.student) {
                return <div key={index} />;
              }
              const name = student.student.name;
              const icon = student.student.icon;
              return (
                <Link key={index} to={`/tutor/student/${email}`}>
                  <div className="LiveTutorTutor__Activity__Student">
                    <img className="image" src={icon} alt={name} title={name} />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveTutorTutorRatingActivity;
