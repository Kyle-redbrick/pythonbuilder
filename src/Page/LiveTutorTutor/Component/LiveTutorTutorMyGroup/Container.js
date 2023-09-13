import React, { Component } from "react";
import * as request from "../../../../Common/Util/HTTPRequest";
import View from "./View.js";
import { connect } from "react-redux";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
    };
  }

  componentDidMount() {
    request
      .getTutorLectureGroups({ email: this.props.email })
      .then((res) => res.json())
      .then((json) => {
        this.setState({ groups: json });
      });
  }

  render() {
    return <View {...this.state} />;
  }
}

export default connect((state) => ({
  email: state.userinfo.email,
  tutorType: state.userinfo.tutorType,
}))(Container);
