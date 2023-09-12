import { combineReducers } from "redux";
import userinfo from "./UserInfo";
import popup from "./Popup";
import tabs from "./Tabs";

export default combineReducers({
  userinfo: userinfo,
  popup: popup,
  tabs: tabs,
});
