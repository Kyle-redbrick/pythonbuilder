import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import * as request from "../../../Common/Util/HTTPRequest.js";
import "./index.scss";

class StudentProgress extends Component {
  constructor(props) {
    super(props);
    this.email = props.email;
    this.state = {
      name: "이름",
      imgUrl: "",
      publishCount: 0,
      progressCount: 0,
      progressTotal: 1,
    };
  }
  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = () => {
    request
      .wizLiveGetUserInfo({ email: this.email })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          name: json.user.name,
          imgUrl: json.user.icon,
          publishCount: json.projects.count,
          progressCount: json.progress.done,
          progressTotal: json.progress.total,
        });
      })
      .catch((e) => console.error(e));
  };

  render() {
    const { name, imgUrl, publishCount, progressCount, progressTotal } = this.state;

    return (
      <div className="studentProgress">
        <div style={{ display: "flex" }}>
          <img className="Profile_Image" src={imgUrl} alt={name} />
          <div className="Profile_Middle">
            <div className="Profile_Name">{name}</div>
            <div className="Profile_Pub">
              <div className="Profile_PubTitle">
                <FormattedMessage id="ID_LIVETUTOR_TUTOR_STUDENT_PUBLISH" />
              </div>
              <div className="Profile_PubCount">{publishCount}</div>
            </div>
          </div>
        </div>
        <div className="Profile_Progress">
          <div className="Profile_Progress_Number">
            <div className="Profile_Progress_Number_Current">{progressCount}</div>
            <div className="Profile_Progress_Number_Total">/{progressTotal}</div>
          </div>
          <div className="Profile_Progress_Bar">
            <div className="Profile_Progress_Bar_Back">
              <div
                className="Profile_Progress_Bar_Front"
                style={{ width: `${(progressCount / progressTotal) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StudentProgress;
