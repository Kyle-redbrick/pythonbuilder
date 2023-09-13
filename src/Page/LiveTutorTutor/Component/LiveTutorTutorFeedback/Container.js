import React, { Component } from "react";
import * as TrackingUtil from "../../../../Common/Util/TrackingUtil";
import View from "./View.js";

class Container extends Component {
  componentDidMount() {
    TrackingUtil.sendPageEvent("/tutor/feedback", this.props.email);
  }

  render() {
    const { reservationId, email, isReadonly } = this.props;
    return <View reservationId={reservationId} studentEmail={email} isReadonly={isReadonly} isTutor={true} />;
  }
}

export default Container;
