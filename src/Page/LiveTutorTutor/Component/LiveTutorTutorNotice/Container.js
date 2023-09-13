import React, { Component } from "react";
import * as request from "../../../../Common/Util/HTTPRequest";
import View from "./View.js";
import { showPopUp } from "../../../../Common/Component/PopUp";
import NoticePopup from "./NoticePopup";
import { connect } from "react-redux";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noticeData: undefined,
      selectedNoticeIndex: undefined,
    };
  }

  componentDidMount() {
    this.getTutorNotice();
  }

  getTutorNotice = () => {
    request
      .getTutorNotice()
      .then((res) => res.json())
      .then((json) => {
        if (json.notice) {
          this.setState({
            noticeData: json.notice,
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  handleSelectNoticeIndex = (index) => {
    this.setState((prevState) => ({
      selectedNoticeIndex: index === prevState.selectedNoticeIndex ? undefined : index,
    }));
  };

  onClickPopup = () => {
    showPopUp(<NoticePopup email={this.props.email} />);
  };

  render() {
    const { selectedNoticeIndex, noticeData } = this.state;
    const { handleSelectNoticeIndex, onClickPopup } = this;
    return (
      <View
        selectedNoticeIndex={selectedNoticeIndex}
        handleSelectNoticeIndex={handleSelectNoticeIndex}
        noticeData={noticeData}
        onClickPopup={onClickPopup}
      />
    );
  }
}

export default connect(
  (state) => ({
    email: state.userinfo.email,
  }),
  {},
)(Container);
