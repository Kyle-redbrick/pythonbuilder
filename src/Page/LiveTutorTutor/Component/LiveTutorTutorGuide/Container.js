import React, { Component } from "react";
import * as request from "../../../../Common/Util/HTTPRequest";
import View from "./View.js";
import { connect } from "react-redux";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guideData: undefined,
      regularClassData: undefined,
      quizData: undefined,
    };
  }
  componentDidMount() {
    const { tutorType } = this.props;
    const curriculumId = {
      js: 1,
      python: 3,
    };
    this.getTutorGuide(tutorType);
    this.getRegularClass(curriculumId[tutorType]);
    this.getQuizList(tutorType);
  }

  getTutorGuide = (type) => {
    request
      .getTutorGuide(type)
      .then((res) => res.json())
      .then((json) => {
        if (json.guide) {
          this.setState({
            guideData: json.guide,
          });
        } else {
          console.log("fail to get TutorGuide data");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  getRegularClass = (id) => {
    request
      .getRegularClass(id)
      .then((res) => res.json())
      .then((json) => {
        if (json.regularClass) {
          this.setState({
            regularClassData: json.regularClass,
          });
        } else {
          console.log("fail to get TutorGuide data");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  getQuizList = (type) => {
    request
      .getQuizList(type)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          quizData: json,
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  render() {
    const { guideData, regularClassData, quizData } = this.state;
    return <View guideData={guideData} regularClassData={regularClassData} quizData={quizData} />;
  }
}

export default connect((state) => ({ tutorType: state.userinfo.tutorType }), {})(Container);
