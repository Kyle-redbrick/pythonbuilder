import React from "react";
import "./index.scss";

// const seperateLine = () => {
//   return (
//     <p
//       style={{
//         borderBottom: "0.5px solid #2f3443",
//         marginLeft: "-30px",
//         marginBottom: "16px",
//         width: "105%",
//         color: "#393e4f",
//       }}
//     />
//   );
// };

let beforeChar;

const textBoxCheck = (textItem, idx) => {
  if (idx === 0) {
    if (textItem.speaker === "announcer") {
      beforeChar = "announcer";
      return false;
    } else {
      beforeChar = textItem.speakerName;
      return true;
    }
  } else {
    if (textItem.speaker === "announcer") {
      beforeChar = "announcer";
      return false;
    } else {
      if (beforeChar === textItem.speakerName) {
        return false;
      } else {
        beforeChar = textItem.speakerName;
        return true;
      }
    }
  }
};

const displayConvList = (missionStart, nowScriptId, history, handleHistoryList, fluidFontSize) => {
  return history.map(function (item, i) {
    let textBoxFlag = textBoxCheck(item, i);
    // console.log(missionStart, nowScriptId, i);
    return item.msg === "" ? null : (
      <React.Fragment key={i}>
        <div className="conv">
          {textBoxFlag ? (
            <div className="speakerTalkBox">
              <p className="speakerImgBox">
                {item.speakerName === "파이" && (
                  <img
                    className="speakerImg"
                    src="https://wizschool-python.s3.ap-northeast-2.amazonaws.com/images/freeTrial/caracters/icon_woman.png"
                    alt=""
                  />
                )}
                {item.speakerName === "이선" && (
                  <img
                    className="speakerImg"
                    src="https://wizschool-python.s3.ap-northeast-2.amazonaws.com/images/freeTrial/caracters/icon_man.png"
                    alt=""
                  />
                )}
              </p>
              <p
                className={missionStart && nowScriptId === i ? "speakerTalkText selected" : "speakerTalkText"}
                style={{ fontSize: fluidFontSize + 2 }}
                onClick={() => {
                  handleHistoryList(i);
                }}
              >
                {item.msg}
              </p>
            </div>
          ) : (
            <p
              className={missionStart && nowScriptId === i ? "AnnounceBox selected" : "AnnounceBox"}
              style={{ fontSize: fluidFontSize + 2 }}
              onClick={() => {
                handleHistoryList(i);
              }}
            >
              {item.msg}
            </p>
          )}
        </div>
      </React.Fragment>
    );
  });
};

// const displayConvList = (history) => {
//   return (
//     <React.Fragment>
//       <div>
//         <p>
//           {" "}
//           <img
//             src="https://wizschool-python.s3.ap-northeast-2.amazonaws.com/images/freeTrial/caracters/cha_py.png"
//             style={{ width: "50px", height: "50px" }}
//           />
//           <span>대사대사대사</span>
//         </p>
//       </div>
//     </React.Fragment>
//   );
// };

export default function (props) {
  return displayConvList(
    props.missionStart,
    props.nowScriptId,
    props.convHistory,
    props.handleHistoryList,
    props.fluidFontSize + 2,
  );
}
