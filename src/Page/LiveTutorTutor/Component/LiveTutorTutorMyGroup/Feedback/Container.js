import React, { Component } from "react";
import * as request from "../../../../../Common/Util/HTTPRequest";
import View from "./View.js";
import { withRouter } from "react-router-dom";
import { showPopUp, OneButtonPopUp, TwoButtonPopUp } from "../../../../../Common/Component/PopUp";
import { CURRICULUM_PYTHON_EVALUATION_LIST } from "./Constants/CURRICULUM_PYTHON_EVALUATION_LIST";
import { CURRICULUM_JS_EVALUATION_LIST } from "./Constants/CURRICULUM_JS_EVALUATION_LIST";

class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStudentIndex: 0,
      students: undefined,
      feedbacks: undefined,
      lectureGroup: undefined,
    };
  }

  componentDidMount() {
    const { lectureGroupId, roomId } = this.props;
    this.getReservations(lectureGroupId, roomId);
  }

  getReservations = (lectureGroupId, roomId) => {
    try {
      request
        .getLectureGroupReservation({ lectureGroupId, roomId })
        .then((res) => res.json())
        .then((json) => {
          const { lectureGroup, reservations } = json;

          const _lectureGroup = lectureGroup;
          _lectureGroup["title"] = reservations[0].myLecture.lecture.title;
          _lectureGroup["level"] = reservations[0].myLecture.lecture.level;
          _lectureGroup["date"] = reservations[0].date;

          this.setState({ lectureGroup: _lectureGroup }, () => {
            const feedbacks = reservations.map((reservation) => {
              if (reservation.myLecture.feedback) {
                return JSON.parse(reservation.myLecture.feedback);
              } else {
                return this.feedbackFormat;
              }
            });

            const students = reservations.map((reservation) => {
              const _student = reservation.student;
              _student["reservationId"] = reservation.id;
              return _student;
            });

            this.setState({
              students: students,
              feedbacks: feedbacks,
              selectedStudentIndex: 0,
            });
          });
        });
    } catch {}
  };

  onSelectedStudent = (selectedIndex) => {
    this.setState({ selectedStudentIndex: selectedIndex });
  };

  onScore = (feedIndex, score) => {
    const { selectedStudentIndex, feedbacks } = this.state;
    this.setState({
      feedbacks: feedbacks.map((feedback, index) => {
        if (selectedStudentIndex === index) {
          return {
            ...feedback,
            feedbacks: feedback.feedbacks.map((_feedback, index) => {
              if (feedIndex === index) {
                return {
                  ..._feedback,
                  level: score,
                  title: this.evaluationList[_feedback.evaluationTitleEn][score],
                };
              }
              return _feedback;
            }),
          };
        }
        return feedback;
      }),
    });
  };

  onChange = (e, changeIndex) => {
    const { selectedStudentIndex, feedbacks } = this.state;
    const message = e.target.value;

    this.setState({
      feedbacks: feedbacks.map((feedback, index) => {
        if (selectedStudentIndex === index) {
          return {
            ...feedback,
            detailFeedbacks: feedback.detailFeedbacks.map((detailFeedback, index) => {
              if (changeIndex === index) {
                return { ...detailFeedback, message: message };
              }
              return detailFeedback;
            }),
          };
        }
        return feedback;
      }),
    });
  };

  onSave = () => {
    this.postFeedback();
  };

  onCancel = () => {
    this.props.history.goBack();
  };

  onChangeMemo = (e) => {
    const { selectedStudentIndex, feedbacks } = this.state;
    const message = e.target.value;
    this.setState({
      feedbacks: feedbacks.map((feedback, index) => {
        if (selectedStudentIndex === index) {
          return { ...feedback, memo: message };
        }
      }),
    });
  };

  get feedbackFormat() {
    if (!this.evaluationList) {
      return;
    }

    return {
      memo: "",
      message: "",
      detailFeedbacks: [
        {
          title: "오늘 수업의 종합 평가 결과입니다!",
          message: "",
        },
        {
          title: "학생이 특별히 어려워한 부분이 있었나요? 어떻게 이를 해결하였나요?",
          message: "",
        },
        {
          title: "학생의 의견 중 인상 깊었던 부분과 오늘의 전반적인 수업 태도는 어떠했나요?",
          message: "",
        },
        {
          title: "오늘 학생이 복습해야 할 내용은 무엇인가요?",
          message: "",
        },
        {
          title: "오늘 학생이 퍼블리싱한 앱 링크를 입력해 주세요.",
          message: "",
        },
      ],
      feedbacks: [
        {
          evaluationTitleEn: "decomposition",
          evaluationTitleKo: "분해",
          title: this.evaluationList.decomposition[1],
          level: 1,
        },
        {
          evaluationTitleEn: "pattern",
          evaluationTitleKo: "패턴 인식",
          title: this.evaluationList.pattern[1],
          level: 1,
        },
        {
          evaluationTitleEn: "abstraction",
          evaluationTitleKo: "추상화",
          title: this.evaluationList.abstraction[1],
          level: 1,
        },
        {
          evaluationTitleEn: "algorithm",
          evaluationTitleKo: "알고리즘",
          title: this.evaluationList.algorithm[1],
          level: 1,
        },
        {
          evaluationTitleEn: "programming",
          evaluationTitleKo: "프로그래밍",
          title: this.evaluationList.programming[1],
          level: 1,
        },
      ],
    };
  }
  get evaluationList() {
    if (!this.state.lectureGroup) {
      return null;
    }

    const lectureType = this.state.lectureGroup.lecture;
    const lectureLevel = this.state.lectureGroup.level;

    if (lectureLevel.includes("무료")) {
      if (lectureType === "js_1v4") {
        if (lectureLevel === "무료 체험") {
          // 초급
          return CURRICULUM_JS_EVALUATION_LIST[0][1];
        } else {
          // 중급
          return CURRICULUM_JS_EVALUATION_LIST[0][2];
        }
      } else {
        // python
        return CURRICULUM_PYTHON_EVALUATION_LIST[0][1];
      }
    } else {
      const _lectureLevel = lectureLevel.split("-");
      if (lectureType === "js_1v4") {
        return CURRICULUM_JS_EVALUATION_LIST[_lectureLevel[0]][_lectureLevel[1]];
      } else {
        // python
        return CURRICULUM_PYTHON_EVALUATION_LIST[_lectureLevel[0]][_lectureLevel[1]];
      }
    }
  }

  postFeedback = () => {
    const { selectedStudentIndex, students, feedbacks } = this.state;

    const tutorMessage = feedbacks[selectedStudentIndex].detailFeedbacks
      .map((feedback) => {
        return `${feedback.title}\n ${feedback.message}`;
      })
      .join("\n\n");

    feedbacks[selectedStudentIndex].message = tutorMessage;

    const params = {
      id: students[selectedStudentIndex].reservationId,
      feedback: feedbacks[selectedStudentIndex],
    };

    try {
      showPopUp(
        <TwoButtonPopUp
          title="학생 피드백을 저장 하시겠습니까?"
          subtitle=""
          confirmButtonName="저장"
          cancelButtonName="취소"
          confirmAction={() => {
            request
              .postTutorFeedback(params)
              .then((res) => res.json())
              .then((json) => {
                showPopUp(
                  <OneButtonPopUp
                    title={`${students[selectedStudentIndex].name}의 피드백을 저장하였습니다.`}
                    subtitle=""
                    buttonName="확인"
                  />,
                );
              });
          }}
        />,
      );
    } catch {
      showPopUp(<OneButtonPopUp title="피드백을 저장하는데 실패하였습니다." subtitle="" buttonName="확인" />);
    }
  };

  render() {
    const { onSelectedStudent, onScore, onChange, onCancel, onSave, onChangeMemo } = this;
    return (
      <View
        {...this.props}
        {...this.state}
        onChange={onChange}
        onChangeMemo={onChangeMemo}
        onSave={onSave}
        onCancel={onCancel}
        onScore={onScore}
        onSelectedStudent={onSelectedStudent}
      />
    );
  }
}

export default withRouter(Container);
