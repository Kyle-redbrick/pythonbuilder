import React, { Component, Fragment } from "react";
import * as request from "../../../Util/HTTPRequest";
import "./index.scss";

class TutorProfilePopUp extends Component {
  constructor(props) {
    super(props);
    this.state = { tutor: null, informations: null };
  }
  componentDidMount() {
    this.getTutorProfile(this.props.email);
  }

  getTutorProfile = (email) => {
    request
      .getTutorPopUp({ email: email })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          tutor: {
            ...json,
            informations: JSON.parse(json.information) || [],
          },
        });
      });
  };

  render() {
    const { buttonAction, dismiss } = this.props;
    const { tutor } = this.state;

    let rating = 0;
    if (tutor) {
      rating = (tutor.ratingSum / tutor.ratingCount).toFixed(1);
      if (isNaN(rating)) rating = 0;
    }

    return (
      <div className="popup_tutorprofile">
        {tutor && (
          <Fragment>
            <div className="popup_up__wrapper">
              <img
                className="popup_tutorprofile_icon"
                src={tutor.user.icon}
                alt={tutor.user.name}
                title={tutor.user.name}
              />
              <div className="popup_title__wrapper">
                <div className="popup_title popup_tutorprofile_name">{`${tutor.user.name} 튜터`}</div>
                <div className="stars">
                  {[...Array(5)].map((e, i) => (
                    <p key={i} className={`star ${i + 0.5 <= rating ? "on" : "off"}`} />
                  ))}
                </div>
              </div>
            </div>

            {tutor.user.statusMessage && (
              <div className="popup_tutorprofile_content">
                <div className="popup_tutorprofile_content_title">튜터 한마디</div>
                <div className="popup_tutorprofile_content_subtitle">{tutor.user.statusMessage}</div>
              </div>
            )}
            {tutor.informations.length > 0 && (
              <div className="popup_tutorprofile_content">
                <div className="popup_tutorprofile_content_title">튜터 경력</div>
                <div className="popup_tutorprofile_content_exps">
                  {tutor.informations.map((information, index) => (
                    <div key={index} className="popup_tutorprofile_content_subtitle">
                      {information}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {buttonAction && (
              <button
                className="popup_button popup_button-tutor"
                onClick={() => {
                  if (buttonAction) buttonAction();
                  dismiss();
                }}
              >
                확인
              </button>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

export default TutorProfilePopUp;
