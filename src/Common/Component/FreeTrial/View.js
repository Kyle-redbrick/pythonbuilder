import React from "react";
import DropDown from "../../Component/DropDown";
import "./index.scss";
import { FREE_TRIAL_TYPE } from "../../../Common/Util/Constant";
import { FormattedMessage } from "react-intl";

const SelectEnableList = {
  grade: {
    items: [
      <FormattedMessage id="ID_STUDENT_GRADE_ELEMENTARTY_3" />,
      <FormattedMessage id="ID_STUDENT_GRADE_ELEMENTARTY_4" />,
      <FormattedMessage id="ID_STUDENT_GRADE_ELEMENTARTY_5" />,
      <FormattedMessage id="ID_STUDENT_GRADE_ELEMENTARTY_6" />,
      <FormattedMessage id="ID_STUDENT_GRADE_MIDDLE_1" />,
      <FormattedMessage id="ID_STUDENT_GRADE_MIDDLE_2" />,
      <FormattedMessage id="ID_STUDENT_GRADE_MIDDLE_3" />,
    ],
    hint: <FormattedMessage id="ID_PAYMENT_FORM_GRADE" />,
  },
  gender: {
    items: [<FormattedMessage id="ID_STUDENT_GENDER_F" />, <FormattedMessage id="ID_STUDENT_GENDER_M" />],
    hint: <FormattedMessage id="ID_PAYMENT_FORM_GENDER" />,
  },
  route: {
    items: [
      <FormattedMessage id="ID_FREE_ROUTE_INPUT_1" />,
      <FormattedMessage id="ID_FREE_ROUTE_INPUT_2" />,
      <FormattedMessage id="ID_FREE_ROUTE_INPUT_3" />,
      <FormattedMessage id="ID_FREE_ROUTE_INPUT_4" />,
      <FormattedMessage id="ID_FREE_ROUTE_INPUT_5" />,
    ],
    hint: <FormattedMessage id="ID_FREE_ROUTE_INPUT" />,
  },
};

export default function View(props) {
  const {
    handleInputChange,
    handleDropDownChange,
    onClickApply,
    onClickTerms,

    name,
    email,
    phone,
    parentName,
    promotionCode,
    grade,
    gender,
    isNameValid,
    isGradeValid,
    isGenderValid,
    isEmailValid,
    isPhoneValid,
    isParentNameValid,
    // isPromotionCodeValid,
    isWizlabEvent,
    freeTrialType,
    isMarketingAgreement,
    route,
    isRouteValid,
    detailRoute,
    isDetailRouteValid,
  } = props;

  const isRouteDetail = ["ID_FREE_ROUTE_INPUT_4", "ID_FREE_ROUTE_INPUT_5"].includes(route);

  const isDisable = isRouteDetail
    ? !(
        isNameValid &&
        isGradeValid &&
        isGenderValid &&
        isEmailValid &&
        isPhoneValid &&
        isParentNameValid &&
        isRouteValid &&
        isDetailRouteValid
      )
    : !(
        isNameValid &&
        isGradeValid &&
        isGenderValid &&
        isEmailValid &&
        isPhoneValid &&
        isParentNameValid &&
        isRouteValid
      );

  return (
    <div className="freetrial_container">
      <div className="freetrial">
        <p className="freetrial_title">{props.intl.formatMessage({ id: "ID_FREE_TITLE" })}</p>
        {/* 무료체험 유형  */}
        <div className="freetrial_type_container">
          <p className="freetrial_subtitle">
            {props.intl.formatMessage({ id: "ID_FREE_TYPE_TITLE" })}
            <span className="freetrial_require">*</span>
          </p>

          <div className="freetrial_type_checkbox_container">
            <div className="freetrial_typ_checkbox_wrapper">
              <input
                id="bagic"
                type="radio"
                name="freeTrialType"
                value={FREE_TRIAL_TYPE.BASIC}
                checked={freeTrialType === FREE_TRIAL_TYPE.BASIC}
                onChange={handleInputChange}
              />
              <p className="freetrial_subtitle">{props.intl.formatMessage({ id: "ID_FREE_TYPE_BASIC" })}</p>
            </div>
            <div className="freetrial_typ_checkbox_wrapper">
              <input
                id="multi"
                type="radio"
                name="freeTrialType"
                value={FREE_TRIAL_TYPE.MULTI}
                checked={freeTrialType === FREE_TRIAL_TYPE.MULTI}
                onChange={handleInputChange}
              />
              <p className="freetrial_subtitle">{props.intl.formatMessage({ id: "ID_FREE_TYPE_MULTI" })}</p>
            </div>
          </div>
        </div>

        {/* 그룹수업 모집 마감처리 */}
        {freeTrialType === FREE_TRIAL_TYPE.MULTI && (
          <div className="freetrial_1v4_disable">
            <p>8월 1:4 그룹수업 모집 마감!</p>
            <p>신청자 폭주로 인하여 조기 마감합니다. 많은 신청에 감사드립니다.</p>
            <p>
              (1:1 무료체험 수업 후, <br />
              10월 그룹 수업 반배정은 가능합니다.)
            </p>
          </div>
        )}

        {/* 학생정보  */}
        <div className="freetrial_studentInfo">
          <p className="freetrial_subtitle">
            {props.intl.formatMessage({ id: "ID_FREE_SUBTITLE_STUDENT" })}
            <span className="freetrial_require">*</span>
          </p>
          {/* 학생정보 - 이름 */}
          <input
            className={`freetrial_input ${name && !isNameValid ? "freetrial_input-warning" : ""}`}
            type="text"
            placeholder={
              isWizlabEvent
                ? "이름을 작성해주세요"
                : props.intl.formatMessage({
                    id: "ID_FREE_INPUT_NAME",
                  })
            }
            value={name}
            name="name"
            onChange={handleInputChange}
          />
          {name && !isNameValid && (
            <p className="freetrial_warning">{props.intl.formatMessage({ id: "ID_FREE_WARNING_NAME" })}</p>
          )}
          {/* 학생정보 - 학년, 성별 */}
          <div
            className={`freetrial_studentInfo_section ${
              (grade && !isGradeValid) || (gender && !isGenderValid) ? "freetrial_studentInfo_section-warning" : ""
            }`}
          >
            <div
              className={`freetrial_studentInfo_dropdown ${
                grade && !isGradeValid ? "freetrial_studentInfo_dropdown-warning" : ""
              }`}
            >
              <DropDown
                defaultValue={SelectEnableList.grade.hint}
                list={SelectEnableList.grade.items}
                handleSelectItem={(item) => handleDropDownChange("grade", item.props.id)}
              />
              {grade && !isGradeValid && (
                <p className="freetrial_warning">{props.intl.formatMessage({ id: "ID_FREE_WARNING_GRADE" })}</p>
              )}
            </div>
            <div
              className={`freetrial_studentInfo_dropdown ${
                gender && !isGenderValid ? "freetrial_studentInfo_dropdown-warning" : ""
              }`}
            >
              <DropDown
                defaultValue={SelectEnableList.gender.hint}
                list={SelectEnableList.gender.items}
                handleSelectItem={(item) => handleDropDownChange("gender", item.props.id)}
              />
              {gender && !isGenderValid && (
                <p className="freetrial_warning">{props.intl.formatMessage({ id: "ID_FREE_WARNING_GENDER" })}</p>
              )}
            </div>
          </div>
          {/* 학생정보 - 이메일 */}
          <input
            className={`freetrial_input ${email && !isEmailValid ? "freetrial_input-warning" : ""}`}
            type="text"
            placeholder={props.intl.formatMessage({
              id: "ID_FREE_INPUT_EMAIL",
            })}
            value={email}
            name="email"
            onChange={handleInputChange}
          />
          {email && !isEmailValid && (
            <p className="freetrial_warning">{props.intl.formatMessage({ id: "ID_FREE_WARNING_EMAIL" })}</p>
          )}
        </div>

        {/* 학부모 정보  */}
        {!isWizlabEvent && (
          <div className="freetrial_parentInfo">
            <p className="freetrial_subtitle">
              {props.intl.formatMessage({
                id: "ID_FREE_SUBTITLE_PARENT_NAME",
              })}
              <span className="freetrial_require">*</span>
            </p>
            <input
              autocomplete="off"
              className={`freetrial_input ${parentName && !isParentNameValid ? "freetrial_input-warning" : ""}`}
              type="text"
              placeholder={props.intl.formatMessage({
                id: "ID_FREE_INPUT_PARENT_NAME",
              })}
              value={parentName}
              name="parentName"
              onChange={handleInputChange}
            />
            {parentName && !isParentNameValid && (
              <p className="freetrial_warning">
                {props.intl.formatMessage({
                  id: "ID_FREE_WARNING_PARENT_NAME",
                })}
              </p>
            )}
          </div>
        )}

        {/* 연락처 정보  */}
        <div className="freetrial_numberInfo">
          <p className="freetrial_subtitle">
            {props.intl.formatMessage({
              id: "ID_FREE_SUBTITLE_PARENT_NUMBER",
            })}
            <span className="freetrial_require">*</span>
          </p>
          <input
            className={`freetrial_input ${phone && !isPhoneValid ? "freetrial_input-warning" : ""}`}
            type="number"
            placeholder={
              isWizlabEvent
                ? "휴대폰 번호를 입력해주세요"
                : props.intl.formatMessage({
                    id: "ID_FREE_INPUT_PARENT_NUMBER",
                  })
            }
            value={phone}
            name="phone"
            onChange={handleInputChange}
          />
          {phone && !isPhoneValid && (
            <p className="freetrial_warning">
              {props.intl.formatMessage({
                id: "ID_FREE_WARNING_PARENT_NUMBER",
              })}
            </p>
          )}
        </div>

        {/* 추천 경로  */}
        {!promotionCode && (
          <div className="freetrial_routeInfo">
            <p className="freetrial_subtitle">
              {props.intl.formatMessage({ id: "ID_FREE_SUBTITLE_RECOMMENDATION_ROUTE" })}
              <span className="freetrial_require">*</span>
            </p>
            <div
              className={`freetrial_routeInfo_dropdown
              ${route && !isRouteValid ? "freetrial_routeInfo_dropdown-warning" : ""}`}
            >
              <DropDown
                defaultValue={SelectEnableList.route.hint}
                list={SelectEnableList.route.items}
                handleSelectItem={(item) => handleDropDownChange("route", item.props.id)}
              />
              {route && !isRouteValid && (
                <p className="freetrial_warning">{props.intl.formatMessage({ id: "ID_FREE_WARNING_ROUTE" })}</p>
              )}
            </div>
          </div>
        )}

        {/* 자세한 경로 */}
        {isRouteDetail && (
          <div className="freetrial_detailInfo">
            <p className="freetrial_subtitle">{props.intl.formatMessage({ id: "ID_FREE_SUBTITLE_DETAIL_ROUTE" })}</p>
            <input
              className={`freetrial_input ${detailRoute && !isDetailRouteValid ? "freetrial_input-warning" : ""}`}
              type="text"
              placeholder={props.intl.formatMessage({ id: "ID_FREE_DETAIL_ROUTE_INPUT" })}
              value={detailRoute}
              name="detailRoute"
              onChange={handleInputChange}
            />
            {detailRoute && !isDetailRouteValid && (
              <p className="freetrial_warning">{props.intl.formatMessage({ id: "ID_FREE_DETAIL_ROUTE_INPUT" })}</p>
            )}
          </div>
        )}

        {/* 마케팅 동의 */}
        <label className="freetrial_input_checkbox" for="marketing-agreement">
          <input
            type="checkbox"
            id="marketing-agreement"
            name="isMarketingAgreement"
            value={isMarketingAgreement}
            onClick={handleInputChange}
          />
          <FormattedMessage id="ID_SIGNUP_MARKETING_AGREEMENT" />
        </label>

        {/* 신청하기 버튼 */}
        <button
          // className="freetrial_button freetrial_button-disabled"
          className="freetrial_button"
          style={{ backgroundColor: isDisable ? "#cccccc" : "#63baf5" }}
          id={`freetrial_button_${window.location.hash}`}
          disabled={isDisable}
          onClick={onClickApply}
        >
          {props.intl.formatMessage({ id: "ID_FREE_BUTTON_APPLY" })}
        </button>

        {/* 개인정보수집 */}
        <div className="freetrial_terms">
          <p className="freetrial_terms_title freetrial_terms_title-web">
            {props.intl.formatMessage({ id: "ID_FREE_TERMS_WEB" })}
          </p>
          <p className="freetrial_terms_title freetrial_terms_title-mobile">
            {props.intl.formatMessage({ id: "ID_FREE_TERMS_MOBILE" })}
          </p>
          <p className="freetrial_terms_link" onClick={onClickTerms}>
            {props.intl.formatMessage({ id: "ID_FREE_TERMS_LINK" })}
          </p>
        </div>
      </div>
    </div>
  );
}
