import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import LogIn from "../LogIn";
import SignUp from "../SignUp";
import UserDropDown from "./UserDropDown";
import FreeTrial from "../FreeTrial";
import { showPopUp, VideoPopUp } from "../PopUp";
import * as userInfoAction from "../../Store/Reducer/UserInfo";
import * as popupAction from "../../Store/Reducer/Popup";
import * as TrackingUtil from "../../../Common/Util/TrackingUtil";
import { MainPopupType, URL } from "../../Util/Constant";
import { showAlert } from "../../../Common/Util/AlertManager";
import * as request from "../../../Common/Util/HTTPRequest";
import { getActiveCoupon } from "../../../Common/Util/Coupon";
import playIcon from "../../../Image/ic_play_black.svg";
import "./index.scss";

const MenuItem = withRouter((props) => {
  let { text, path, handleToggleBtn, className } = props;
  if (path) {
    let matchPath = props.match.path;
    let isSame = matchPath === path;
    // check whether on subpath page or not.
    // console.log(matchPath, isSame);
    let subPath = matchPath.substring(0, matchPath.indexOf("/", 1));
    let toggle = isSame || subPath === path ? "on" : "off";
    const isDot = path === "/events" && toggle === "off";
    if (isSame) {
      return (
        <p
          className={`MenuItem MenuItem--${toggle}`}
          onClick={() => {
            window.location.reload();
          }}
        >
          <span className={`${className && className}`}>{text}</span>
          {isDot && <div className="MenuItem--Dot" />}
        </p>
      );
    } else {
      return (
        <Link to={path} className={`MenuItem MenuItem--${toggle}`} onClick={handleToggleBtn}>
          <span className={`${className && className}`}>{text}</span>
          {isDot && <div className="MenuItem--Dot" />}
        </Link>
      );
    }
  } else {
    return (
      <p
        className="MenuItem"
        onClick={() => {
          showAlert("ID_PAYMENT_ALERT_TITLE", "ID_PAYMENT_ALERT_MSG_SOON", "ID_PAYMENT_ALERT_CLOSEBTN");
        }}
      >
        <span>{text}</span>
      </p>
    );
  }
});

const MenuDropDown = ({
  isMenuDDOn,
  email,
  handleSignupBtn,
  handleLoginBtn,
  handleLogoutBtn,
  handleToggleBtn,
  isTutor,
  onClickCreateLinkBtn,
} = {}) => {
  const toggle = isMenuDDOn ? "on" : "off";
  return (
    <div className={`MenuDD MenuDD--${toggle}`}>
      <div className="MenuItemList">
        <MenuItem text="커리큘럼" path="/curriculum" handleToggleBtn={handleToggleBtn} />
        <MenuItem text="학습시스템" path="/learningSystem" handleToggleBtn={handleToggleBtn} />
        <MenuItem text="튜터" path="/tutorIntroduce" handleToggleBtn={handleToggleBtn} />
        <MenuItem text="이벤트" path="/events" handleToggleBtn={handleToggleBtn} />
        <li className="MenuItem" onClick={onClickCreateLinkBtn}>
          창작하기
        </li>
        <MenuItem className="item--package" type="web" text={<FormattedMessage id="ID_NAV_TICKET" />} path="/package" />
        <MenuItem text="고객센터" path="/cs" handleToggleBtn={handleToggleBtn} />

        {!email ? (
          <React.Fragment>
            <li onClick={handleLoginBtn} className="MenuItem">
              <FormattedMessage id="ID_HEADER_LOGIN" />
            </li>
            <li onClick={handleSignupBtn} className="MenuItem">
              <FormattedMessage id="ID_HEADER_SIGNUP" />
            </li>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <hr className="MenuDD__hr" />
            <MenuItem text={<FormattedMessage id="ID_USERDD_SETTING" />} path="/setting" />

            {isTutor ? (
              <MenuItem text={<FormattedMessage id="ID_USERDD_LIVETUTOR_TUTOR" />} path="/tutor" />
            ) : (
              <MenuItem text={<FormattedMessage id="ID_USERDD_LIVETUTOR" />} path="/student" />
            )}
            <li onClick={handleLogoutBtn} className={`MenuItem`}>
              {<FormattedMessage id="ID_USERDD_LOGOUT" />}
            </li>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

class MainHeader extends Component {
  constructor(props) {
    super(props);
    const { formatMessage } = this.props.intl;
    const title = formatMessage({ id: "ID_TITLE" });
    document.title = title;
    this.state = {
      isMenuDDOn: false,
      badge: 0,
      isActiveCoupon: null,
    };
  }

  handleToggleBtn = (e) => {
    this.setState((state) => ({
      isMenuDDOn: !state.isMenuDDOn,
    }));
  };
  handleLogoutBtn = (e) => {
    localStorage.removeItem("wizToken");
    this.props.updateUserInfo();
    this.handleToggleBtn();
  };

  handleLoginBtn = (e) => {
    e.preventDefault();
    this.setState(
      {
        isMenuDDOn: false,
      },
      () => {
        this.props.setMainPopup(MainPopupType.LOGIN);
      },
    );
  };

  handleSignupBtn = (e) => {
    e.preventDefault();
    this.setState(
      {
        isMenuDDOn: false,
      },
      () => {
        this.props.setMainPopup(MainPopupType.SIGNUP);
      },
    );
  };

  renderUserInfo = () => {
    const { isActiveCoupon } = this.state;
    const info = {
      icon: this.props.icon,
      name: this.props.name,
      isTutor: this.props.isTutor,
    };

    return (
      <div className="MainHeaderRight--inner">
        {info.isTutor ? (
          <div className="MainHeader__liveRow">
            <Link
              to="/tutor"
              onClick={(e) => {
                let matchPath = this.props.match.path;
                let isSame = matchPath === "/tutor";
                if (isSame) {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
            >
              <button className="liveRow--tutor">
                <FormattedMessage id="ID_USERDD_LIVETUTOR_TUTOR" />
              </button>
            </Link>
          </div>
        ) : (
          <div className="MainHeader__liveRow">
            {this.props.history.location.pathname === "/student" && (
              <button
                className="liveRow--student--guide"
                onClick={() => showPopUp(<VideoPopUp src={URL.WIZSCHOOL_ETC_BUCKET + "wizlive_envtest_guide.mp4"} />)}
              >
                <img src={playIcon} alt="play" />
                <span>수업 가이드</span>
              </button>
            )}
            <Link
              to="/student"
              onClick={(e) => {
                let matchPath = this.props.match.path;
                let isSame = matchPath === "/student";
                if (isSame) {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
            >
              <button className="liveRow--student">
                <FormattedMessage id="ID_USERDD_LIVETUTOR" />
                {isActiveCoupon && <span className="liveRow--student__label">N</span>}
              </button>
            </Link>
          </div>
        )}

        <UserDropDown user={info} />
      </div>
    );
  };

  renderAuthMenu = () => {
    return (
      <div className="MainHeader__authRow">
        <div onClick={this.handleLoginBtn} className="HeaderAuthBtn HeaderAuthBtn--login">
          <FormattedMessage id="ID_HEADER_LOGIN" />
        </div>
      </div>
    );
  };

  componentDidMount() {
    // check whether scroll To top or not
    let cands = ["/curriculum", "/package", "/tutorIntroduce", "/cs", "/student", "/tutor"];
    let matchPath = this.props.match.path;
    let isSame = cands.indexOf(matchPath) >= 0;
    let subPath = matchPath.substring(0, matchPath.indexOf("/", 1));
    let isSubSame = cands.indexOf(subPath) >= 0;
    if (isSame || isSubSame) {
      window.scrollTo(0, 0);
    }

    if (this.props.email) {
      this.setNewLabel(this.props.email);
      if (this.props.match.path === "/noti") {
        this.setState({ badge: 0 });
      } else {
        request
          .getBadgeCount({ email: this.props.email })
          .then((res) => res.json())
          .then((json) => this.setState({ badge: json.badge }));
      }
    }
  }

  componentDidUpdate(prevProps, _) {
    const currentEmail = this.props.email;
    if (prevProps.email !== currentEmail) {
      this.setNewLabel(currentEmail);
    }
  }

  setNewLabel = async (email) => {
    if (email) {
      const activeList = await getActiveCoupon(email);
      this.setState({ isActiveCoupon: activeList && activeList.length > 0 });
    } else {
      this.setState({ isActiveCoupon: null });
    }
  };

  handleLink = (e, link) => {
    if (this.props.location.pathname === link) {
      e.preventDefault();
      window.location.reload();
    }
  };

  handleToggleFreeTrial = (e, type = null) => {
    if (e) {
      e.preventDefault();
    }

    showPopUp(
      <FreeTrial
        onApply={() => {
          this.props.history.push({
            pathname: "/freetrial/submit",
            state: { fromType: type },
          });
        }}
      />,
      undefined,
      false,
      true,
      true,
    );
  };

  onClickCreateLinkBtn = () => {
    window.open("https://redbrick.space/", "_blank");
  };

  onClickFreeTrialBtn = () => {
    TrackingUtil.sendAPEventDirect("freetrial_button_click");
    this.props.history.push(`/freetrial?from=${window.location.pathname}`);
  };

  render() {
    const { isMenuDDOn } = this.state;
    const { mainPopup, email, isTutor, isBlur } = this.props;
    const mobileToggle = isMenuDDOn ? "on" : "off";
    return (
      <div className={`MainHeader ${isBlur ? "blur" : ""}`}>
        {mainPopup === MainPopupType.LOGIN && <LogIn />}
        {mainPopup === MainPopupType.SIGNUP && <SignUp />}
        <div className="MainHeader__inner--web">
          <div className="MainHeaderLeft">
            <Link onClick={(e) => this.handleLink(e, "/")} to="/" className="MainHeaderLogo" />
            <div className="MenuItemList">
              <MenuItem type="web" text={<FormattedMessage id="ID_NAV_CURRICULUM" />} path="/curriculum" />
              <MenuItem type="web" text={<FormattedMessage id="ID_NAV_LEARNING_SYSTEM" />} path="/learningSystem" />
              <MenuItem type="web" text={<FormattedMessage id="ID_NAV_TUTOR_INTRODUCE" />} path="/tutorIntroduce" />
              <MenuItem type="web" text={<FormattedMessage id="ID_NAV_EVENTS" />} path="/events" />
              <p className="MenuItem" onClick={this.onClickCreateLinkBtn}>
                창작하기
              </p>
            </div>
          </div>
          <div className="MainHeaderRight">
            {email ? (
              <>
                {this.renderUserInfo()}
                {isTutor ? (
                  ""
                ) : (
                  <Link to="/package" className="item--point-btn">
                    <FormattedMessage id="ID_NAV_TICKET" />
                  </Link>
                )}
              </>
            ) : (
              <>
                <span className="item--HeaderRight item--package">
                  <MenuItem
                    className="item--package"
                    type="web"
                    text={<FormattedMessage id="ID_NAV_TICKET" />}
                    path="/package"
                  />
                </span>
                {this.renderAuthMenu()}
                <div className="item--point-btn" onClick={this.onClickFreeTrialBtn}>
                  <FormattedMessage id="ID_NAV_SIDE_FREETRIAL" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* MOBILE */}
        <div className={`MainHeader__inner--mobile MainHeader__inner--mobile--${mobileToggle}`}>
          <div className="MainHeaderBox">
            <p className="MainHeader__toggleBtn" onClick={this.handleToggleBtn} />
            <Link
              to="/"
              onClick={(e) => {
                let matchPath = this.props.match.path;
                let isSame = matchPath === "/";
                if (isSame) {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
            >
              <p className="MainHeaderLogo" />
            </Link>
            <a className="MainHeaderRight--contact" href="tel:16706192">
              {" "}
            </a>
          </div>
        </div>
        <MenuDropDown
          isMenuDDOn={isMenuDDOn}
          email={email}
          handleSignupBtn={this.handleSignupBtn}
          handleLoginBtn={this.handleLoginBtn}
          handleLogoutBtn={this.handleLogoutBtn}
          isTutor={isTutor}
          onClickCreateLinkBtn={this.onClickCreateLinkBtn}
        />
      </div>
    );
  }
}
export default connect(
  (state) => ({
    badge: state.userinfo.badge,
    email: state.userinfo.email,
    name: state.userinfo.name,
    icon: state.userinfo.icon,
    isTutor: state.userinfo.isTutor,
    mainPopup: state.popup.mainPopup,
  }),
  {
    updateUserInfo: userInfoAction.updateUserInfo,
    setMainPopup: popupAction.setMainPopup,
  },
)(withRouter(injectIntl(MainHeader)));
