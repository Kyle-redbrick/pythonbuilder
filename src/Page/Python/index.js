import React from "react";
import { Provider } from "react-redux";
import store from "../../Common/Store";
// import Container from "./Container";
// import UserInfo from "../../Common/Component/UserInfo";

const Python = (props) => {
  return (
    <Provider store={store}>
      <div>python</div>
      {/* <UserInfo>
    <Container {...props} />
    </UserInfo> */}
    </Provider>
  );
};
export default Python;
