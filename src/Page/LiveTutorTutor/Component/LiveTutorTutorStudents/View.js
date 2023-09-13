import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import "./index.scss";

function View(props) {
  const { students } = props;
  return (
    <div className="LiveTutorTutor__Students">
      <div className="LiveTutorTutor__Tabs">
        <h3 className="LiveTutorTutor__Tab ">
          <FormattedMessage id="ID_LIVETUTOR_TUTOR_STUDENT_TITLE" />
        </h3>
      </div>
      <hr className="line" />
      <div className="LiveTutorTutor__Students__Students">
        <h4 className="LiveTutorTutor__Students__Count">{`총 ${students.length}명`}</h4>
        {students.map((student, index) => {
          const email = student.studentEmail;
          if (!email || !student.student) {
            return <div key={index} />;
          }
          const name = student.student.name;
          const icon = student.student.icon;
          const organization = student.student.organization;
          return (
            <Link key={index} to={`/tutor/student/${email}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="LiveTutorTutor__Students__Student">
                <div className="Student__Left">
                  <img src={icon} alt={name} title={name} />
                </div>
                <div className="Student__Content">
                  <h2 className="name">{name}</h2>
                  <h4 className="email">{email}</h4>
                  <h4 className="organization">{organization}</h4>
                </div>
                <div className="Student__Right" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default View;
