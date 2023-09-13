import React from "react";
import { Provider } from "react-redux";
import Store from "../../../../../Common/Store";
import UserInfo from "../../../../../Common/Component/UserInfo";
import Container from "./Container";

const LiveTutorTutorMyGroupDetail = (props) => {
  return (
    <Provider store={Store}>
      <UserInfo>
        <Container {...props} />
      </UserInfo>
    </Provider>
  );
};

export default LiveTutorTutorMyGroupDetail;
