import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import * as request from "../../../Common/Util/HTTPRequest";
import * as TrackingUtil from "../../../Common/Util/TrackingUtil";
import View from "./View";
import "./index.scss";
import { FREE_TRIAL_TYPE } from "../../../Common/Util/Constant";
import { withRouter } from "react-router-dom";
import ReactPixel from "react-facebook-pixel";

class Container extends Component {
  constructor(props) {
    super(props);
    const _promotionCode = this.getPromotionCode(props);

    this.state = {
      name: "",
      grade: undefined,
      gender: undefined,
      email: "",
      phone: "",
      parentName: props.from === "WIZLAB_EVT" ? "위즈랩이벤트" : "",
      promotionCode: _promotionCode,
      isWizlabEvent: props.from === "WIZLAB_EVT",

      isNameValid: false,
      isGradeValid: false,
      isGenderValid: false,
      isEmailValid: false,
      isPhoneValid: false,
      isParentNameValid: false,
      isPromotionCodeValid: false,
      isBeforeApplying: true,
      isMarketingAgreement: false,
      route: "",
      isRouteValid: _promotionCode ? true : false,
      detailRoute: "",
      isDetailRouteValid: false,

      freeTrialType: FREE_TRIAL_TYPE.BASIC,
    };

    this.startTrackingReactPixelSkinSchool();
  }

  componentDidMount() {
    TrackingUtil.sendAPEventDirect("page_view", {
      page_path: window.location.pathname,
    });
  }

  getPromotionCode = (props) => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("utm_source");

    if (props.from === "sns_detail_page") {
      return "페이스북/인스타그램3";
    }
    if (props.from) {
      return props.from;
    }
    if (myParam === "buzzvill") {
      return "buzzvill";
    }
    if (props.location.pathname === "/events/32") {
      return "온라인광고_m";
    }
    if (props.location.pathname === "/events/44") {
      return "동아사이언스_9월혜택";
    }
    return "";
  };

  startTrackingReactPixelSkinSchool = () => {
    const { location } = this.props;
    switch (location.search) {
      case "?trial=6":
        ReactPixel.trackCustom("freetrial_start_skinschool", { content_name: ["bottom_button_skinschool"] });
        break;
      case "?trial=7":
        ReactPixel.trackCustom("freetrial_start_skinschool", { content_name: ["fixed_button_skinschool"] });
        break;
      default:
        break;
    }
  };

  handleDropDownChange = (type, value) => {
    switch (type) {
      case "grade":
        this.setState({ isGradeValid: value !== undefined });
        break;
      case "gender":
        this.setState({ isGenderValid: value !== undefined });
        break;
      case "route":
        this.setState({ isRouteValid: value !== undefined });
        break;
      default:
        break;
    }

    this.setState({ [type]: value });
  };

  handleInputChange = (e) => {
    switch (e.target.name) {
      case "name":
        this.setState({ isNameValid: e.target.value !== "" });
        break;
      case "email":
        this.setState({
          isEmailValid: e.target.value !== "" && this.checkEmailFormat(e.target.value),
        });
        break;
      case "parentName":
        this.setState({ isParentNameValid: e.target.value !== "" });
        break;
      case "phone":
        this.setState({
          isPhoneValid:
            e.target.value !== "" &&
            e.target.value.length > 9 &&
            e.target.value.length < 12 &&
            e.target.value.startsWith("01"),
        });
        break;
      case "detailRoute":
        this.setState({ isDetailRouteValid: e.target.value !== "" });
        break;
      default:
        break;
    }

    if (e.target.name === "isMarketingAgreement") {
      this.setState((prevState) => ({ isMarketingAgreement: !prevState.isMarketingAgreement }));
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  getGradeNumber = (grade) => {
    switch (grade) {
      case "ID_STUDENT_GRADE_ELEMENTARTY_3":
        return 3;
      case "ID_STUDENT_GRADE_ELEMENTARTY_4":
        return 4;
      case "ID_STUDENT_GRADE_ELEMENTARTY_5":
        return 5;
      case "ID_STUDENT_GRADE_ELEMENTARTY_6":
        return 6;
      case "ID_STUDENT_GRADE_MIDDLE_1":
        return 7;
      case "ID_STUDENT_GRADE_MIDDLE_2":
        return 8;
      case "ID_STUDENT_GRADE_MIDDLE_3":
        return 9;
      default:
        return 0;
    }
  };

  getRecommendationRoute = () => {
    const { route, detailRoute, promotionCode } = this.state;
    let recommendations = {
      ID_FREE_ROUTE_INPUT_1: "인터넷 검색",
      ID_FREE_ROUTE_INPUT_2: "페이스북/인스타그램",
      ID_FREE_ROUTE_INPUT_3: "카페/커뮤니티",
      ID_FREE_ROUTE_INPUT_4: "지인 추천",
      ID_FREE_ROUTE_INPUT_5: "기타",
    };
    if (promotionCode) {
      if (promotionCode.includes(recommendations["ID_FREE_ROUTE_INPUT_2"])) {
        return recommendations["ID_FREE_ROUTE_INPUT_2"];
      } else {
        return "";
      }
    }
    return (recommendations[route] += detailRoute ? ` (${detailRoute})` : "");
  };

  checkEmailFormat = (email) => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return regex.test(this.state.email);
    return regex.test(email);
  };

  onClickApply = () => {
    const {
      name,
      grade,
      gender,
      email,
      phone,
      parentName,
      promotionCode,
      freeTrialType,
      isNameValid,
      isGradeValid,
      isGenderValid,
      isEmailValid,
      isPhoneValid,
      isParentNameValid,
      isMarketingAgreement,
      isRouteValid,
    } = this.state;
    let params = {
      name,
      grade: this.getGradeNumber(grade),
      gender: gender === "ID_STUDENT_GENDER_M" ? "M" : "F",
      email,
      phone,
      parentName,
      freeTrialType,
      isMarketingAgreement,
      route: this.getRecommendationRoute(),
    };

    if (promotionCode || promotionCode.length > 0) {
      params.promotionCode = promotionCode;
    }

    //for wizlab event
    if (this.props.uId) {
      params.uId = this.props.uId;
    }

    if (
      isNameValid &&
      isGradeValid &&
      isGenderValid &&
      isEmailValid &&
      isPhoneValid &&
      isParentNameValid &&
      isRouteValid
    ) {
      request
        .addWizLiveTrial(params)
        .then((res) => res.json())
        .then((json) => {
          // const { result } = json;

          //temp
          this.setState({
            isBeforeApplying: false,
          });
          // if (result === "success") {
          //   this.setState({
          //     isBeforeApplying: false
          //   });

          if (this.props.from === "sns_detail_page") {
            ReactPixel.trackCustom("freetrial_end_skinschool");
          }

          TrackingUtil.sendNaverPremiumLogEvent(4, 1);
          TrackingUtil.sendNsmartEvent(1822);

          const search = new URLSearchParams(this.props.location.search);
          if (["6", "7"].includes(search.get("trial"))) {
            // trial: 6, 7 -> skinschool
            TrackingUtil.sendGTMEvent("SkinSchool FreeTrial Submitted", "/freetrial/submit");
          } else {
            TrackingUtil.sendGTMEvent("FreeTrialForm Submitted", "/freetrial/submit");
          }

          TrackingUtil.sendMobEvent();
          TrackingUtil.sendAdsEvent("freeTrial");
          TrackingUtil.kakaoPixelPageView("freeTrial");
          TrackingUtil.sendKakaoAdsEvent("freeTrial");
          TrackingUtil.sendFBPixelEvent("freeTrial");
          TrackingUtil.sendBuzzADEvent();

          // author : john@wizscool.io
          // date : 2020.07.02
          window.setBizSpring("ODR");
          // } else {
          //   switch (result) {
          //     case "invalid code":
          //       this.setState({ isPromotionCodeValid: false });
          //       break;
          //     default:
          //   }
          // }
          const { dismiss, onApply, location } = this.props;

          // tracking 진행: 홈에서 showPopup으로 진입 했을 경우
          if (onApply) {
            onApply();
          } else {
            // tracking 진행: 기타
            let redirectUrl = "";
            switch (location.search) {
              case "?trial=6":
                redirectUrl = "/freetrial/submit?from=bottom_button_skinschool";
                break;
              case "?trial=7":
                redirectUrl = "/freetrial/submit?from=fixed_button_skinschool";
                break;
              default:
                redirectUrl = "/freetrial/submit";
                break;
            }
            window.location.href = redirectUrl;
          }
          if (dismiss) dismiss();
        })
        .catch((error) => console.error(error));
    }
  };

  onClickTerms = () => {
    window.open("/support/privacy");
  };

  render() {
    const {
      name,
      email,
      phone,
      parentName,
      promotionCode,
      grade,
      gender,
      isBeforeApplying,
      isNameValid,
      isGradeValid,
      isGenderValid,
      isEmailValid,
      isPhoneValid,
      isParentNameValid,
      isPromotionCodeValid,
      isWizlabEvent,
      freeTrialType,
      isMarketingAgreement,
      route,
      isRouteValid,
      detailRoute,
      isDetailRouteValid,
    } = this.state;

    return (
      <View
        isBeforeApplying={isBeforeApplying}
        handleInputChange={this.handleInputChange}
        handleDropDownChange={this.handleDropDownChange}
        onClickApply={this.onClickApply}
        onClickTerms={this.onClickTerms}
        name={name}
        email={email}
        phone={phone}
        parentName={parentName}
        promotionCode={promotionCode}
        grade={grade}
        gender={gender}
        intl={this.props.intl}
        isNameValid={isNameValid}
        isGradeValid={isGradeValid}
        isGenderValid={isGenderValid}
        isEmailValid={isEmailValid}
        isPhoneValid={isPhoneValid}
        isParentNameValid={isParentNameValid}
        isPromotionCodeValid={isPromotionCodeValid}
        isWizlabEvent={isWizlabEvent}
        freeTrialType={freeTrialType}
        isMarketingAgreement={isMarketingAgreement}
        route={route}
        isRouteValid={isRouteValid}
        detailRoute={detailRoute}
        isDetailRouteValid={isDetailRouteValid}
      />
    );
  }
}

export default connect((state) => ({ email: state.userinfo.email }))(withRouter(injectIntl(Container)));
