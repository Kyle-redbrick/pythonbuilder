import React, { Component } from "react";
import * as TrackingUtil from "../../../../Common/Util/TrackingUtil";
import * as request from "../../../../Common/Util/HTTPRequest";
import View from "./View";
import "./index.scss";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
    };
  }
  componentDidMount() {
    TrackingUtil.sendPageEvent("/tutor/students", this.props.email);
    this.getTutorStudents(this.props.email);
  }

  getTutorStudents = (email) => {
    const param = { email: email };

    request
      .getTutorStudents(param)
      .then((res) => res.json())
      .then((json) => {
        const students = json.studentsAll;
        this.setState({ students: students });
        // this.getSubscribes(email);
      })
      .catch((e) => console.error(e));
  };

  onClickSubscibe = (student, index) => {
    const isSubscribe = student.isSubscribe;
    if (isSubscribe) {
      this.postUnsubscribe(this.props.email, student.studentEmail, index);
    } else {
      this.postSubscribe(this.props.email, student.studentEmail, index);
    }
  };

  render() {
    const { students } = this.state;
    return <View students={students} onClickStudent={this.onClickStudent} />;
  }
}

export default Container;
