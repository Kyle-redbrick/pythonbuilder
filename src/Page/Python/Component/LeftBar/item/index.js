import React from "react";

const handleHintIcon = (handleMissionHint) => {
  return (
    <div
      className="hintIconBox"
      onClick={() => {
        handleMissionHint("showHint");
      }}
    >
      <img
        className="hintIconImg"
        src="https://wizschool-python.s3.ap-northeast-2.amazonaws.com/images/lectures/p_icon_a.png"
        alt="hint new"
      />
    </div>
  );
};

export default function (props) {
  if (props.scriptInfo.hintIcon) {
    return handleHintIcon(props.handleMissionHint);
  } else {
    return null;
  }
}
