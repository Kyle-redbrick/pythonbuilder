import React from "react";
import { connect } from "react-redux";
import * as request from "../../../Common/Util/HTTPRequest";
import * as action from "../../Store/Reducer/UserInfo";

class UserInfoContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mounted: false };
    this.showAlert = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.showAlert = this.showAlert && this.state.mounted;
    return true;
  }

  componentDidMount() {
    window.addEventListener("focus", this.handleWindowFocus);
    if (Object.keys(this.props.userinfo).length === 0) {
      this.handleLoginByToken();
    } else {
      this.setState({ mounted: true });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("focus", this.handleWindowFocus);
  }

  handleLoginByToken = async (e) => {
    let token = localStorage.getItem("wizToken");

    if (this.isRecording()) {
      token = this.getUserToken();
    }

    if (token) {
      const params = { token };
      try {
        // const response = await request.loginByToken(params);
        // const json = await response.json();
        // console.log("json", json.use);
        // if (json.user) {
        //   let user = json.user;
        //   user.payment = json.payment;
        //   this.props.updateUserInfo(user);
        //   this.setState({ mounted: true });
        // } else {
        //   // console.log("user not found");
        //   localStorage.removeItem("wizToken");
        //   this.props.updateUserInfo();
        //   this.setState({ mounted: true });
        // }
        this.props.updateUserInfo({
          apkTicket: 0,
          availablePoint: 5000,
          badge: 0,
          birth: null,
          createdAt: "2023-05-30T00:14:33.000Z",
          edge: "",
          email: "howCodingCoachPY4@wizschool.io",
          gender: null,
          icon: "https://s3.ap-northeast-2.amazonaws.com/wizschool-images/profile-image-02.png",
          id: 790001770,
          interestedCount: 0,
          isMarketingAgreement: false,
          isOfficial: false,
          isTutor: true,
          levelPoint: 5000,
          liveTutor1v4Ticket: 0,
          liveTutorTicket: 0,
          name: "파이썬시연4",
          organization: null,
          payment: null,
          phone: "00000000000",
          python1v4Ticket: 0,
          pythonTicket: 0,
          signedOut: false,
          statusMessage: null,
          subscribeCount: 0,
          tutorType: "python",
          uid: 790001770,
          verifiedEmail: null,
        });
        this.setState({ mounted: true });
      } catch (err) {
        this.props.updateUserInfo({
          apkTicket: 0,
          availablePoint: 5000,
          badge: 0,
          birth: null,
          createdAt: "2023-05-30T00:14:33.000Z",
          edge: "",
          email: "howCodingCoachPY4@wizschool.io",
          gender: null,
          icon: "https://s3.ap-northeast-2.amazonaws.com/wizschool-images/profile-image-02.png",
          id: 790001770,
          interestedCount: 0,
          isMarketingAgreement: false,
          isOfficial: false,
          isTutor: true,
          levelPoint: 5000,
          liveTutor1v4Ticket: 0,
          liveTutorTicket: 0,
          name: "파이썬시연4",
          organization: null,
          payment: null,
          phone: "00000000000",
          python1v4Ticket: 0,
          pythonTicket: 0,
          signedOut: false,
          statusMessage: null,
          subscribeCount: 0,
          tutorType: "python",
          uid: 790001770,
          verifiedEmail: null,
        });
        this.setState({ mounted: true });
        // console.log("request failed");
        // localStorage.removeItem("wizToken");
        // this.props.updateUserInfo();
        // this.setState({ mounted: true });
      }
    } else {
      this.props.updateUserInfo({
        apkTicket: 0,
        availablePoint: 5000,
        badge: 0,
        birth: null,
        createdAt: "2023-05-30T00:14:33.000Z",
        edge: "",
        email: "howCodingCoachPY4@wizschool.io",
        gender: null,
        icon: "https://s3.ap-northeast-2.amazonaws.com/wizschool-images/profile-image-02.png",
        id: 790001770,
        interestedCount: 0,
        isMarketingAgreement: false,
        isOfficial: false,
        isTutor: true,
        levelPoint: 5000,
        liveTutor1v4Ticket: 0,
        liveTutorTicket: 0,
        name: "파이썬시연4",
        organization: null,
        payment: null,
        phone: "00000000000",
        python1v4Ticket: 0,
        pythonTicket: 0,
        signedOut: false,
        statusMessage: null,
        subscribeCount: 0,
        tutorType: "python",
        uid: 790001770,
        verifiedEmail: null,
      });
      this.setState({ mounted: true });
      // console.log("token not found");
      // localStorage.removeItem("wizToken");
      // this.props.updateUserInfo();
      // this.setState({ mounted: true });
    }
  };

  handleWindowFocus = (e) => {
    let token = localStorage.getItem("wizToken");

    if (this.isRecording()) {
      token = this.getUserToken();
    }

    if (token) {
      const json = this.parseJwt(token);
      const tokenEmail = json.email;
      if (tokenEmail !== this.props.userinfo.email) {
        window.location.reload();
      }
    }
    if (!token && Object.keys(this.props.userinfo).length > 0) {
      this.props.updateUserInfo();
    }
  };

  parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  }

  isRecording() {
    return new URLSearchParams(window.location.search).has("userToken");
  }

  getUserToken() {
    return new URLSearchParams(window.location.search).get("userToken");
  }

  render() {
    return <>{this.state.mounted === true ? this.props.children : null}</>;
  }
}

export default connect(
  (state) => ({
    userinfo: state.userinfo,
  }),
  {
    updateUserInfo: action.updateUserInfo,
  },
)(UserInfoContainer);
