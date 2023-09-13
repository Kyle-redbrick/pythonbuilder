import React from "react";

export default function (props) {
  // const {} = props;
  // console.log(props);
  let shadow = `${props.backgroundBase}${props.scriptInfo.backGround}`;
  let opacityValue = "1";

  if (props.scriptInfo.hintIcon || props.scriptInfo.speaker === "hint" || props.scriptInfo.speaker === "answer_input")
    opacityValue = "0.5";

  return (
    <React.Fragment>
      <div
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          opacity: opacityValue,
        }}
      >
        <video
          style={{
            width: "100%",
          }}
          src={shadow}
          autoPlay={true}
          loop={true}
        />
      </div>
    </React.Fragment>
  );
}
