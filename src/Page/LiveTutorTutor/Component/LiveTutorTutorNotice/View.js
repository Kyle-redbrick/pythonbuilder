import React from "react";
import arrowUpImage from "../../../../Image/arrow-up-btn.svg";
import arrowDownImage from "../../../../Image/arrow-down-btn.svg";
import moment from "moment";
import "./index.scss";

function View(props) {
  const { selectedNoticeIndex, handleSelectNoticeIndex, noticeData, onClickPopup } = props;
  return (
    <div className="LiveTutorTutor__Notice">
      <div className="LiveTutorTutor__NoticeWrapper">
        <p className="LiveTutorTutor__Notice--title">튜터 공지사항</p>
        <p className="LiveTutorTutor__Notice--popup" onClick={onClickPopup}>
          정규수업 실습 신청
        </p>
      </div>
      <p
        style={{
          border: "1px solid #000000",
          height: "2px",
        }}
      />
      <ul className="NoticeItemList">
        {noticeData &&
          noticeData.map((item, index) => {
            const selected = index === selectedNoticeIndex;
            const toggle = selected ? "on" : "off";
            return (
              <li className="NoticeItem" key={index} onClick={() => handleSelectNoticeIndex(index)}>
                <div className="NoticeItem__questionRow">
                  <div className="NoticeItem__questionWrapper">
                    <p className="NoticeItem__question--order">{index + 1}.</p>
                    <p className="NoticeItem__question">{item.title}</p>
                    <p className="NoticeItem__question--date">
                      {selected ? `최종 수정 ${moment(item.updatedAt).format("YYYY.MM.DD")}` : ""}
                    </p>
                  </div>
                  <img
                    className="NoticeItem__question--icon"
                    src={selected ? arrowUpImage : arrowDownImage}
                    alt="arrow btn"
                  />
                </div>
                <div className={`NoticeItem__answerRow NoticeItem__answerRow--${toggle}`}>
                  {selected && <p className="NoticeItem__answer">{item.content}</p>}
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default View;
