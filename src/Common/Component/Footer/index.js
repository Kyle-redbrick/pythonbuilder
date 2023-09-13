import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import blogImage from "../../../Image/blog.svg";
import instaImage from "../../../Image/insta.svg";
import faceBookImage from "../../../Image/facebook.svg";
import { URL } from "../../../Common/Util/Constant";
import "./index.scss";

const MainFooter = (props) => {
  return (
    <div className="MainFooter">
      <div className="MainFooter__inner">
        <div className="MainFooter__termsRow">
          <p className="MainFooter__item--bold">
            <Link className="MainFooter__link" to="/support/privacy">
              <FormattedMessage id="ID_FOOTER_PRIVACY" />
            </Link>
          </p>
          <p className="MainFooter__item--bold">
            <Link className="MainFooter__link" to="/support/terms">
              <FormattedMessage id="ID_FOOTER_TERMS" />
            </Link>
          </p>
          <p className="MainFooter__item--bold">
            <a
              className="MainFooter__link"
              href="https://www.notion.so/redbrickspace/a970f92b0f47455e8c3bef9dddbedb18"
              target="_blank"
              rel="noreferrer noopener"
            >
              <FormattedMessage id="ID_FOOTER_POLICY" />
            </a>
          </p>
        </div>
        <div className="MainFooter__itemholder">
          <p className="MainFooter__item">
            <FormattedMessage id="ID_FOOTER_COPYRIGHT" />
          </p>
        </div>
        <div>
          <p className="MainFooter__subheader">
            <FormattedMessage id="ID_FOOTER_CAMPUS" />
          </p>
          <div className="MainFooter__itemholder">
            <p className="MainFooter__item">
              <FormattedMessage id="ID_FOOTER_SSN" />
            </p>
          </div>
          <div className="MainFooter__itemholder">
            <p className="MainFooter__item">
              <FormattedMessage id="ID_FOOTER_ADDRESS" />
            </p>
          </div>
          <div className="MainFooter__itemholder">
            <p className="MainFooter__item">
              <FormattedMessage id="ID_FOOTER_EMAIL" />
              <a
                className="MainFooter__link"
                href={`mailto:${props.intl.formatMessage({
                  id: "ID_FOOTER_EMAIL_VALUE",
                })}`}
              >
                <FormattedMessage id="ID_FOOTER_EMAIL_VALUE" />
              </a>
            </p>
            <p className="MainFooter__vertical-line" />
            <p className="MainFooter__item">
              <FormattedMessage id="ID_FOOTER_PHONE" />
              <span>
                <FormattedMessage id="ID_FOOTER_PHONE_VALUE" />
              </span>
            </p>
            <p className="MainFooter__vertical-line" />
            <p className="MainFooter__item">
              <a
                className="MainFooter__link MainFooter__link__kakao"
                target="_blank"
                rel="noopener noreferrer"
                href={URL.KAKAO_CHAT}
              >
                <FormattedMessage id="ID_FOOTER_KAKAO" />
                <FormattedMessage id="ID_FOOTER_KAKAO_VALUE" />
              </a>
            </p>
          </div>
          <div className="MainFooter__snsRow">
            <p className="MainFooter__snsItem">
              <a href="https://blog.naver.com/wizlive-official" target="_blank" rel="noopener noreferrer">
                <img src={blogImage} alt="blog link" />
              </a>
            </p>
            <p className="MainFooter__snsItem">
              <a href="https://www.instagram.com/wizlive.official/" target="_blank" rel="noopener noreferrer">
                <img src={instaImage} alt="insta link" />
              </a>
            </p>
            <p className="MainFooter__snsItem">
              <a href="https://www.facebook.com/momelancer" target="_blank" rel="noopener noreferrer">
                <img src={faceBookImage} alt="facebook link" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default injectIntl(MainFooter);
