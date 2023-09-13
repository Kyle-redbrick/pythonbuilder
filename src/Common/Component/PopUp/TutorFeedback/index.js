import React, { Component, Fragment } from "react";
import "./index.scss";
import LiveTutorStudenFeedback from "../../../../Page/LiveTutorStudentFeedback";

class TutorFeedbackPopup extends Component {
  render() {
    const { id } = this.props;
    return (
      <div className="popup_tutorfeedback">
        <Fragment>
          <LiveTutorStudenFeedback id={id} />
        </Fragment>
      </div>
    );
  }
}

export default TutorFeedbackPopup;
