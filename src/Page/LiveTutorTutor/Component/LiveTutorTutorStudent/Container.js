import React, { Component } from "react";
import * as TrackingUtil from "../../../../Common/Util/TrackingUtil";
import * as request from "../../../../Common/Util/HTTPRequest.js";
import View from "./View";
import "./index.scss";

class Container extends Component {
  constructor(props) {
    super(props);
    this.email = props.studentEmail;
    this.state = {
      name: "이름",
      imgUrl: "",
      publishCount: 0,
      progressCount: 0,
      progressTotal: 1,
    };
  }
  componentDidMount() {
    TrackingUtil.sendPageEvent("/tutor/student", this.props.email);
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
      <View
        email={this.email}
        name={name}
        imgUrl={imgUrl}
        publishCount={publishCount}
        progressCount={progressCount}
        progressTotal={progressTotal}
      />
    );
  }
}

export default Container;
