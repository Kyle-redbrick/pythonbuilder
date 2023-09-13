import React from "react";
import { FormattedMessage } from "react-intl";
import "./index.scss";

function View(props) {
  const {
    students,
    feedbacks,
    lectureGroup,
    selectedStudentIndex,
    onSelectedStudent,
    onChange,
    onScore,
    onSave,
    onCancel,
    onChangeMemo,
  } = props;

  if (!lectureGroup || !students || !feedbacks) return <div />;
  const selectedFeedback = feedbacks[selectedStudentIndex];

  return (
    <div className="Live_Tutor_Tutor_My_Group_Feedback">
      <div className="header">
        <div className="title">튜터 페이지</div>
        <div className="title margin_top20">{lectureGroup.name}</div>
        <div className="subTitle">{lectureGroup.lecture === "python_1v4" ? "데이터 지니어스" : "앱 크리에이터"}</div>
        {/* <div className="subTitle margin_top12">우리 반 진도 0 / 52</div>
        <div className="progress_bar_container">
          <div className="progress" style={{width: "50%"}}/>
        </div> */}
      </div>

      <div className="profile_container">
        {students.map((student, index) => {
          return (
            <GroupFeedbackStudentProfile
              key={index}
              index={index}
              student={student}
              isSelected={index === selectedStudentIndex}
              onSelectedStudent={onSelectedStudent}
            />
          );
        })}
      </div>

      <div className="section_title margin_top12">{lectureGroup.title}</div>
      <div className="section_subTitle">{`${lectureGroup.date} ${lectureGroup.startTime} 수업 진행`}</div>
      <div className="section_title margin_top35">영역별 진단</div>

      {feedbacks[selectedStudentIndex].feedbacks.map((feedback, index) => {
        return <GroupEvaluationView key={index} feedIndex={index} feedback={feedback} onScore={onScore} />;
      })}

      <div className="section_title margin_top20 margin_bottom16">학생 정밀 피드백</div>

      {Array(4)
        .fill()
        .map((_, index) => {
          let placeholder = "내용을 입력해주세요.";
          if (index === 0) {
            placeholder = "ex) LV.3 명령어를 설명해주고 나면 스스로 코드를 작성할 수 있습니다.";
          }
          return (
            <GroupFeedbackArea
              key={index}
              tipText={<FormattedMessage id={`ID_GROUP_FEEDBACK_TIP0${index + 1}`} />}
              detailFeedback={selectedFeedback.detailFeedbacks[index]}
              placeholder={placeholder}
              index={index}
              onChange={onChange}
            />
          );
        })}

      <div className="section_feedback_title margin_top20">튜터용 메모</div>
      <div className="section_feedback_guide">
        <p className="section_feedback_guide_text">[튜터 메모 작성 가이드]</p>
        <ul>
          <li>- 메모는 학습 관리를 위한 목적으로만 활용되며, 수강생에게 노출되지 않습니다. </li>
          <li>- 다른 튜터님들을 위해 아래 5가지 항목에 맞춰 수강생의 특징을 자세히 적어주세요.</li>
          <li>- 무료체험 수업인 경우, 학생의 학년(나이), 코딩 경험을 함께 기재해 주세요. </li>
          <li>- 메모가 제대로 입력되지 않은 경우, 수업 후 개별 연락을 드릴 수 있습니다. </li>
          <li>1) 학습 진단: LV.1 ~ LV.4 중 선택</li>
          <li>2) 개념 이해: 수업 중 배운 내용을 이해한 정도 </li>
          <li>3) 프로그래밍 활용: 스스로 응용 코딩이 가능한 정도 </li>
          <li>4) 학습 태도: 수업 참여도 </li>
          <li>5) 학습 상황: 재수강 필요 여부 </li>
        </ul>
      </div>
      <textarea
        className="feedback_app_link_area margin_top16"
        value={selectedFeedback.memo}
        onChange={(e) => onChangeMemo(e)}
        placeholder="학생에게 보여지지 않는 공간입니다. 자유롭게 내용을 작성해주세요."
      />

      <div className="section_feedback_title margin_top20">{selectedFeedback.detailFeedbacks[4].title}</div>
      <textarea
        className="feedback_app_link_area margin_top16"
        value={selectedFeedback.detailFeedbacks[4].message}
        onChange={(e) => {
          onChange(e, 4);
        }}
        placeholder="퍼블리싱 URL을 입력해주세요. (선택)"
      />

      <div className="button_container">
        <div className="cancel_button" onClick={onCancel}>
          나가기
        </div>
        <div className="confirm_button" onClick={onSave}>
          저장하기
        </div>
      </div>
    </div>
  );
}

export default View;

function GroupFeedbackStudentProfile(props) {
  const { index, student, isSelected, onSelectedStudent } = props;
  return (
    <div
      className={`profile_card ${isSelected && "selected"}`}
      onClick={() => {
        onSelectedStudent(index);
      }}
    >
      <img src={student.icon} alt=""></img>
      <div className="name">{student.name}</div>
    </div>
  );
}

function GroupEvaluationView(props) {
  const { feedIndex, feedback, onScore } = props;
  const score = feedback.level;

  return (
    <div className="evaluation_container">
      <div className="title">{feedback.evaluationTitleKo}</div>
      <div className="line" />
      <div className="text">{feedback.title}</div>
      <div className="star_container">
        {Array(3)
          .fill()
          .map((_, index) => {
            return (
              <div
                className={`star ${index < score && " selected"} `}
                key={index}
                onClick={() => onScore(feedIndex, index + 1)}
              />
            );
          })}
      </div>
    </div>
  );
}

function GroupFeedbackArea(props) {
  const { tipText, placeholder, index, detailFeedback, onChange } = props;
  return (
    <div>
      <div className="section_feedback_title margin_top20">{detailFeedback.title}</div>
      <div className="tip_container margin_top12">
        <div className="tip">TIP</div>
        <div className="tip_text">{tipText}</div>
      </div>
      <textarea
        className="feedback_text_area"
        placeholder={placeholder}
        value={detailFeedback.message}
        onChange={(e) => {
          onChange(e, index);
        }}
      />
    </div>
  );
}
