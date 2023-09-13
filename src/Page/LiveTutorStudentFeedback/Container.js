import React, { Component } from "react";
import { connect } from "react-redux";
import "./index.scss";
import View from "./View.js";
import * as request from "../../Common/Util/HTTPRequest";
import * as TrackingUtil from "../../Common/Util/TrackingUtil";
import Header from "../../Common/Component/Header";
import Footer from "../../Common/Component/Footer";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: undefined,
    };
    // this.state = {
    //   feedback: undefined,
    //   title: undefined,
    //   level: undefined,
    //   curriculum: undefined,
    // };
  }
  async componentDidMount() {
    TrackingUtil.sendPageEvent("/student/feedback", this.props.email);
    TrackingUtil.sendAPEventDirect("freetrial_feedback_view");

    try {
      // const id = this.props.id;
      const id = this.props.match.params.reservationId;
      const email = this.props.email;
      const res = await request.getLiveTutorFeedback({ id, email });
      const json = await res.json();
      this.setState({ feedback: json.feedback });
      // this.setState({
      //   title: json.title,
      //   level: json.level,
      //   curriculum: json.curriculum,
      //   feedback: json.feedback,
      // });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    if (!this.props.email) {
      window.location.href = "/";
      return <div />;
    }
    const { email } = this.props;
    // const { feedback, title, level, curriculum } = this.state;
    const { feedback } = this.state;

    return (
      // <div className="liveTutorStudentFeedback--container">
      //   <View
      //     email={email}
      //     title={title}
      //     level={level}
      //     feedback={feedback}
      //     curriculum={curriculum}
      //   />
      // </div>
      <div className="Page--LiveTutorStudentFeedback">
        <Header />
        <View email={email} feedback={feedback} />
        <Footer />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    email: state.userinfo.email,
  }),
  {},
)(Container);
