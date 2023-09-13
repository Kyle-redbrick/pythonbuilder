import React from "react";
import { FormattedMessage } from "react-intl";
import MyWorks from "../../../LiveTutorStudent/Component/MyWorks";
import "./index.scss";

export default function View(props) {
  const { email, name, imgUrl, publishCount, progressCount, progressTotal } = props;
  return (
    <div className="LiveTutorTutorStudent">
      <div className="LiveTutorTutorStudent_Profile">
        <div style={{ display: "flex" }}>
          <img className="Profile_Image" src={imgUrl} alt={name} />
          <div className="Profile_Middle">
            <div className="Profile_Name">{name}</div>
            <div className="Profile_Pub">
              <div className="Profile_PubTitle">
                <FormattedMessage id="ID_LIVETUTOR_TUTOR_STUDENT_PUBLISH" />
              </div>
              <div className="Profile_PubCount">{publishCount}</div>
            </div>
          </div>
        </div>
        <div className="Profile_Progress">
          <div className="Profile_Progress_Number">
            <div className="Profile_Progress_Number_Current">{progressCount}</div>
            <div className="Profile_Progress_Number_Total">/{progressTotal}</div>
          </div>
          <div className="Profile_Progress_Bar">
            <div className="Profile_Progress_Bar_Back">
              <div
                className="Profile_Progress_Bar_Front"
                style={{ width: `${(progressCount / progressTotal) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <MyWorks email={email} />
    </div>
  );
}
