import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import onClickOutside from "react-onclickoutside";
import homeIconImage from "../../../Image/home-icon.svg";
// import mypageIconImage from "../../../Image/mypage-icon.svg";
// import liveTutorIconImage from "../../../Image/livetutor-icon.svg";
import settingsIconImage from "../../../Image/settings-icon.svg";
import logoutIconImage from "../../../Image/logout-icon.svg";
import * as action from "../../Store/Reducer/UserInfo";
import "./UserDropDown.scss";

const UserDDItem = ({ icon, text, url, onClick }) => {
  // Todo: url check refactoring for the case like /dashboard/blah
  const pathName = window.location.hash.slice(1);
  const handleLink = (e, url) => {
    if (url === pathName) {
      e.preventDefault();
      window.location.reload();
    }
  };
  if (!url || url.length === 0) {
    return (
      <div className={`UserDDItem UserDDItem--off`} onClick={onClick}>
        <img className="UserDDItem__icon" src={icon} alt="user-dropdown-icon" />
        <div className="UserDDItem__text">{text}</div>
      </div>
    );
  } else {
    const toggle = url === pathName ? "on" : "off";
    return (
      <Link onClick={(e) => handleLink(e, url)} to={url} style={{ textDecoration: "none" }}>
        <div className={`UserDDItem UserDDItem--${toggle}`}>
          <img className="UserDDItem__icon" src={icon} alt="user-dropdown-icon" />
          <div className="UserDDItem__text">{text}</div>
        </div>
      </Link>
    );
  }
};

class UserDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isListOpened: false,
      // todo: get current page from url
      selectedItem: null,
    };
  }

  handleClickOutside = (e) => {
    this.setState({
      isListOpened: false,
    });
  };

  handleItemClick = (item) => {
    this.props.handleSelectItem(item.id);
    this.setState({ selectedItem: item, isListOpened: false });
  };

  handleToggleList = () => {
    this.setState((state) => {
      return { isListOpened: !state.isListOpened };
    });
  };

  handleLogout = (event) => {
    localStorage.removeItem("wizToken");
    this.props.updateUserInfo();
  };

  render() {
    const { user } = this.props;
    let { isListOpened } = this.state;
    let listToggle = isListOpened ? "on" : "off";
    return (
      <div className="UserDD">
        <div className="UserDD__header" onClick={this.handleToggleList}>
          <div className="UserDDUserTag">
            <div className="UserDDUserTagIcon">
              <img className="UserDDUserTagIcon__img" src={user.icon} alt={user.name} />
            </div>
            <span className="UserDDUserTagName">{user.name}</span>
          </div>
          <div className={`UserDD__arrow UserDD__arrow--${listToggle}`} />
        </div>
        <div className="UserDD__body">
          {isListOpened && (
            <div className="UserDD__list">
              <UserDDItem text={<FormattedMessage id="ID_USERDD_HOME" />} url="/" icon={homeIconImage} />
              <UserDDItem text={<FormattedMessage id="ID_USERDD_SETTING" />} url="/setting" icon={settingsIconImage} />
              <UserDDItem
                text={<FormattedMessage id="ID_USERDD_LOGOUT" />}
                url=""
                icon={logoutIconImage}
                onClick={this.handleLogout}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(null, {
  updateUserInfo: action.updateUserInfo,
})(onClickOutside(UserDropDown));
