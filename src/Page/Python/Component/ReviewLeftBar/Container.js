import React, { Component } from "react";
import { connect } from "react-redux";
import View from "./View";
import * as request from "../../../../Common/Util/HTTPRequest";

class Container extends Component {
  constructor(props) {
    super(props);
    this.userType = props.userType; // userType (student or tutor)
    this.state = {
      tabMenu: "hints", // left Tab  Menu (document or history)
      studyIdx: 0,
      studyList: [],
    };
  }

  async componentWillMount() {
    if (!this.props.reservationId) return;

    const reviewList = await request
      .getReviewList({
        id: this.props.reservationId,
        email: this.props.email ? this.props.email : "null",
      })
      .then((res) => res.json());

    JSON.parse(reviewList.reviewState)
      ? this.setState({ studyList: JSON.parse(reviewList.reviewState).state })
      : this.setState({ studyList: [] });
  }

  componentDidMount() {}

  componentDidUpdate() {}

  // Left Tab Menu Click Handler
  handleLeftTabMenu = (type) => {
    this.setState({ tabMenu: type });
  };

  handleStudyIdx = (type) => {
    switch (type) {
      case "down":
        this.setState({
          tabMenu: "hints",
          studyIdx: this.state.studyIdx - 1,
        });
        break;
      case "up":
        this.setState({
          tabMenu: "hints",
          studyIdx: this.state.studyIdx + 1,
        });
        break;
      default:
        break;
    }
  };

  render() {
    // const {} = this.props;
    const { tabMenu, studyIdx, studyList } = this.state;
    const { handleLeftTabMenu, handleStudyIdx } = this;
    return (
      <View
        userType={this.props.userType}
        tabMenu={tabMenu}
        studyIdx={studyIdx}
        studyList={studyList}
        handleLeftTabMenu={handleLeftTabMenu}
        handleStudyIdx={handleStudyIdx}
      />
    );
  }
}

export default connect((state) => ({ email: state.userinfo.email }))(Container);
