import React, { Component } from "react";
import "./index.scss";
import { Link } from "react-router-dom";

class RadioButtonPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: "js",
    };
  }

  render() {
    const {
      title,
      subtitle,
      buttonName,
      // buttonAction,
      dismiss,
      ticketHave,
      pythonTicketHave,
      remainingLectureCount,
      pythonRemainingLectureCount,
      nextLearningProgress,
      nextPythonLearningProgress,
    } = this.props;
    const { course } = this.state;
    return (
      <div className="popup_radioButton">
        <div className="popup_title">{title || "title"}</div>
        {subtitle && <div className="popup_subtitle">{subtitle}</div>}

        <div>
          <div className={`radio_button ${course === "js" && "selected"}`}>
            <input
              type="radio"
              id="js"
              name="course"
              value="js"
              checked={course === "js"}
              onChange={(e) => this.setState({ course: e.target.value })}
            />
            <span className="radio_mark" />
            <label htmlFor="js">
              <div>
                <p>
                  <strong>[프로그래밍 개념 마스터]</strong>
                </p>
                <p>{`${nextLearningProgress}`}</p>
                <span>{`잔여 수강권: ${ticketHave}개`}</span> | <span>{`남은 수업: ${remainingLectureCount}개`}</span>
              </div>
            </label>
          </div>
          <div className={`radio_button ${course === "python" && "selected"}`}>
            <input
              type="radio"
              id="python"
              name="course"
              value="python"
              checked={course === "python"}
              onChange={(e) => this.setState({ course: e.target.value })}
            />
            <span className="radio_mark" />
            <label htmlFor="python">
              <div>
                <p>
                  <strong>[파이썬]</strong>
                </p>
                <p>{`${nextPythonLearningProgress}`}</p>
                <span>{`잔여 수강권: ${pythonTicketHave}개`}</span> |{" "}
                <span>{`남은 수업: ${pythonRemainingLectureCount}개`}</span>
              </div>
            </label>
          </div>
        </div>
        {/* <Link to={`/reservation/${course}`}> */}
        <button
          className="popup_button"
          // onClick={() => (window.location.href = "/reservation")}
          onClick={() => {
            if (dismiss) dismiss();
            window.location.href = `/reservation/${course}`;
            // if (buttonAction) buttonAction();
          }}
        >
          {/* <Link
            to={`${course === "js" ? "/reservation" : "/reservation"}`}
          > */}
          {buttonName || "confirm"}
          {/* </Link> */}
        </button>
        {/* </Link> */}
      </div>
    );
  }
}

export default RadioButtonPopUp;
