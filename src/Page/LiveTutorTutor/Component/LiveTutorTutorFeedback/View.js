import React from "react";
import Feedback from "../../../../Common/Component/Feedback";
import "./index.scss";

function View(props) {
  const { reservationId, studentEmail, isReadonly, isTutor } = props;
  return (
    <Feedback reservationId={reservationId} studentEmail={studentEmail} isReadonly={isReadonly} isTutor={isTutor} />
  );
}

export default View;
