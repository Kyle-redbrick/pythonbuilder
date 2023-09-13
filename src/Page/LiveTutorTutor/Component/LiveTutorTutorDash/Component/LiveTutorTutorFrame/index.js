import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import "./index.scss";

function LiveTutorTutorFrame(props) {
  const { title, subtitle, link, children } = props;
  const titleContent = (
    <Fragment>
      <div className="header">
        <h3 className="title">{title}</h3>
        {subtitle && <h4 className="subtitle">{subtitle}</h4>}
      </div>
      <hr className="line"></hr>
    </Fragment>
  );
  return (
    <div className="LiveTutorTutor__Frame">
      {title && (link ? <Link to={link}>{titleContent}</Link> : titleContent)}
      {children}
    </div>
  );
}

export default LiveTutorTutorFrame;
