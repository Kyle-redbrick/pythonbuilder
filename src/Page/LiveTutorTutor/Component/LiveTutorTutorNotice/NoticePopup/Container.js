import React, { Component } from "react";
import View from "./View";
import "./index.scss";
import * as request from "../../../../../Common/Util/HTTPRequest";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level: "",
      time: "",

      isValid: true,
      applyPopupFlag: true,
    };
  }

  handleInputChange = (e) => {
    const target = e.target;
    this.setState({
      [target.name]: target.value,
    });
  };

  handleApplyButton = () => {
    const { level, time } = this.state;

    this.setState(
      {
        isValid: level !== "" && time !== "",
      },
      () => {
        if (this.state.isValid) {
          const msg = `[정규수업 실습신청 알림]
      이메일 : ${this.props.email}
      차시 : ${level}
      희망 시간대 : ${time}
      `;
          request.sendWizLiveWebhook({ msg });
          this.setState({
            applyPopupFlag: false,
          });
        }
      },
    );
  };

  handleDismissButton = () => {
    this.props.dismiss();
  };

  render() {
    const { level, time, applyPopupFlag, isValid } = this.state;
    return (
      <View
        handleApplyButton={this.handleApplyButton}
        handleInputChange={this.handleInputChange}
        handleDismissButton={this.handleDismissButton}
        level={level}
        time={time}
        isValid={isValid}
        applyPopupFlag={applyPopupFlag}
      />
    );
  }
}

export default Container;
