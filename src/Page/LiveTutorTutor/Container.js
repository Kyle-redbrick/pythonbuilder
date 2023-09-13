import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../Common/Component/Header";
import Footer from "../../Common/Component/Footer";
import View from "./View";

global.reservationEnum = {
  upcoming: { attribute: "upcomingReservations", key: "upcoming" },
  complete: { attribute: "completeReservations", key: "complete" },
  canceled: { attribute: "canceledReservations", key: "canceled" },
  guide: { attribute: "tutorGuides", key: "guide" },
  notice: { attribute: "tutorNotices", key: "notice" },
};

class Container extends Component {
  constructor(props) {
    super(props);
    this.TAB_TYPE = {
      ALL: "all",
      UPCOMING: "upcoming",
      COMPLETE: "complete",
      CANCEL: "canceled",
      GUIDE: "guide",
      NOTICE: "notice",
    };
    this.state = {
      selectedTab: this.TAB_TYPE.ALL,
    };
  }

  handleSelectTab = (tab) => {
    this.setState({
      selectedTab: tab,
    });
  };

  render() {
    const { email, match, tutorType } = this.props;

    if (!email || !tutorType) {
      window.location.href = "/";
      return <div />;
    } else {
      return (
        <div className="Page--LiveTutorTutor">
          <Header />
          <View
            email={email}
            match={match}
            TAB_TYPE={this.TAB_TYPE}
            selectedTab={this.state.selectedTab}
            handleSelectTab={this.handleSelectTab}
            tutorType={tutorType}
          />
          <Footer />
        </div>
      );
    }
  }
}

export default connect(
  (state) => ({
    email: state.userinfo.email,
    tutorType: state.userinfo.tutorType,
  }),
  {},
)(Container);
