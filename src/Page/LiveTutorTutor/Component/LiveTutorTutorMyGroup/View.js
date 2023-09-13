import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import "./index.scss";

function View(props) {
  const { groups } = props;

  return (
    <div className="Live_Tutor_Tutor_My_Group">
      {groups.map((element, index) => {
        return <GroupCard key={index} {...element} />;
      })}
    </div>
  );
}

export default View;

function GroupCard(props) {
  const { id, name, lecture, startDate } = props;
  const detailUrl = {
    pathname: `/tutor/myGroupDetail/${id}`,
  };

  return (
    <Link to={detailUrl} style={{ textDecoration: "none" }}>
      <div className="Live_Tutor_Tutor_My_Group_Card">
        <div className="left_container">
          <div className="title">{name}</div>
          <div className="subTitle">{lecture === "python_1v4" ? "데이터 지니어스" : "앱 크리에이터"}</div>
        </div>
        <div className="right_container">
          <div className="date">{startDate}</div>
        </div>
      </div>
    </Link>
  );
}
