import React from "react";
import "./index.scss";

import PythonHeader from "./Component/Header";
import PythonLeftBar from "./Component/LeftBar";
import PythonReviewLeftBar from "./Component/ReviewLeftBar";
import PythonEditor from "./Component/Editor";
import PythonRightBar from "./Component/RightBar";
import PythonBottomBar from "./Component/BottomBar";
import PythonCamera from "./Component/Camera";
import FlowChart from "../../Common/Component/FlowChart";
import FlowChartTraining from "./Component/FlowChart";
import PythonBoard from "./Component/Board";

import Rating from "./Component/Popup/PopupRank";
import RatingComplete from "./Component/Popup/PopupRankComplete";
import LessonFeedback from "./Component/Popup/PopupFeedBack";
import LessonEnd from "./Component/Popup/PopupLessonEnd";

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  const {
    title,
    userType,
    tutorEmail,
    studentEmail,
    fluidFontSize,
    reservationId,
    handleStoryRestore,
    handleSaveLocalStorage,
    handleRestoreLocalStorage,
    handleGetCodeData,
    currentCode,
    isOpenBoard,
    isOpenThumbnail,
    handleToggleBoard,
    handleToggleThumbnail,
    handleTestChangeScript,
    trainingScriptList,
    trainingScript,
    thumbnail,
    getBoardThumbnail,
    handleLectureTimer,
    handleCloseTab,
    lectureTime,
    handlePopupShow,
    isShowRatingPopup,
    isShowRatingCompletePopup,
    isShowLessonFeedbackPopup,
    isShowLessonEndPopup,
    uploading,
  } = props;
  return (
    <div className="Page--Python">
      <PythonHeader
        title={title}
        userType={userType}
        lectureTime={lectureTime}
        handleTestChangeScript={handleTestChangeScript}
        trainingScriptList={trainingScriptList}
        handlePopupShow={handlePopupShow}
        handleLectureTimer={handleLectureTimer}
      />
      {userType === "review" ? (
        <PythonReviewLeftBar
          userType={userType}
          fluidFontSize={fluidFontSize}
          reservationId={reservationId}
          handleSaveLocalStorage={handleSaveLocalStorage}
          handleRestoreLocalStorage={handleRestoreLocalStorage}
        />
      ) : (
        <PythonLeftBar
          userType={userType}
          fluidFontSize={fluidFontSize}
          reservationId={reservationId}
          handleSaveLocalStorage={handleSaveLocalStorage}
          handleRestoreLocalStorage={handleRestoreLocalStorage}
          trainingScript={trainingScript}
        />
      )}
      <button className="TabWidthBarButton" id="TabWidthBarButton">
        <span>||</span>
      </button>
      <PythonEditor
        userType={userType}
        handleStoryRestore={handleStoryRestore}
        handleGetCodeData={handleGetCodeData}
        currentCode={currentCode}
      />
      <PythonRightBar
        handleToggleThumbnail={handleToggleThumbnail}
        userType={userType}
      />
      <PythonBottomBar />

      {isOpenThumbnail && (
        <PythonBoard
          handleToggleBoard={handleToggleBoard}
          handleToggleThumbnail={handleToggleThumbnail}
          thumbnail={thumbnail}
          userType={userType}
        />
      )}

      {isOpenBoard &&
        (userType === "tutorTraining" || userType === "pySpring" ? (
          <FlowChartTraining
            handleToggleBoard={handleToggleBoard}
            getBoardThumbnail={getBoardThumbnail}
            userType={userType}
            reservationId={reservationId}
            isOpenBoard={isOpenBoard}
          />
        ) : (
          <FlowChart
            handleToggleBoard={handleToggleBoard}
            getBoardThumbnail={getBoardThumbnail}
            userType={userType}
            reservationId={reservationId}
            isOpenBoard={isOpenBoard}
          />
        ))}

      {(isShowRatingPopup ||
        isShowRatingCompletePopup ||
        isShowLessonFeedbackPopup ||
        isShowLessonFeedbackPopup ||
        isShowLessonEndPopup) && <div className="overlay" />}

      {isShowRatingPopup && (
        <Rating
          handlePopupShow={handlePopupShow}
          reservationId={reservationId}
          tutorEmail={tutorEmail}
        />
      )}
      {isShowRatingCompletePopup && (
        <RatingComplete handlePopupShow={handlePopupShow} />
      )}
      {isShowLessonFeedbackPopup && (
        <LessonFeedback handleCloseTab={handleCloseTab} />
      )}

      {isShowLessonEndPopup && (
        <LessonEnd
          handlePopupShow={handlePopupShow}
          lectureTime={lectureTime}
          handleLectureTimer={handleLectureTimer}
          reservationId={reservationId}
          tutorEmail={tutorEmail}
          studentEmail={studentEmail}
        />
      )}

      {["tutor", "student"].includes(userType) && (
        <PythonCamera
          userType={userType}
          reservationId={reservationId}
          tutorEmail={tutorEmail}
          studentEmail={studentEmail}
        />
      )}
      {uploading && (
        <div className="recording-upload">
          <div className="recording-upload__progress" />
          <p>수업영상을 업로드 중입니다...</p>
        </div>
      )}
      <audio
        loop
        id="bgm_engineering"
        hidden
        width="150px"
        height="25"
        src="https://wizschool-python.s3.ap-northeast-2.amazonaws.com/sounds/Engineering_2.mp3"
        controls="controls"
      />

      <audio
        loop
        id="bgm_brainteaser"
        hidden
        width="150px"
        height="25"
        src="https://wizschool-python.s3.ap-northeast-2.amazonaws.com/sounds/brainTeaser_2.mp3"
        controls="controls"
      />

      <audio
        loop
        id="bgm_upbeatcorporation"
        hidden
        width="150px"
        height="25"
        src="https://wizschool-python.s3.ap-northeast-2.amazonaws.com/sounds/upbeatcorporation_2.mp3"
        controls="controls"
      />
    </div>
  );
}
