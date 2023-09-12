import ReactGA from "react-ga";
import * as request from "./HTTPRequest";
import amplitude from "amplitude-js";
import { AMPLITUDE_API_KEY } from "./Constant";

const sendStatistics = (params) => {
  request.sendToStatistics(params).catch((err) => console.error(err));
};

const checkHost = () => {
  return window.location.hostname === "wizlive.com" || window.location.hostname === "www.wizlive.com";
};

export const sendPageEvent = (data, email) => {
  if (!checkHost()) return;

  try {
    const params = { data, email };
    ReactGA.pageview(data);
    initNaverPremiumLog();
    sendStatistics(params);
    initMob();
  } catch (e) {}
};

export const sendAPEvent = (params) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(params);
};

export const sendAPEventDirect = (event, properties) => {
  amplitude.getInstance().init(AMPLITUDE_API_KEY);
  amplitude.getInstance().logEvent(event, properties);
};

export const sendGAEvent = (data, email) => {
  if (!checkHost()) return;

  try {
    const params = { data, email };
    ReactGA.event(data);
    sendStatistics(params);
  } catch (e) {}
};

export const sendGTMEvent = (event, pagePath = "") => {
  if (!checkHost()) return;

  try {
    window.dataLayer.push({ event, pagePath });
  } catch (err) {
    console.log(err);
  }
};

export const sendNsmartEvent = (msg) => {
  if (!checkHost()) return;

  try {
    window._NTA.EVT(msg);
  } catch (e) {}
};

const initNaverPremiumLog = () => {
  if (!checkHost()) return;

  try {
    // A. Account ID 적용
    if (!window.wcs_add) {
      window.wcs_add = {};
    }
    window.wcs_add["wa"] = "s_bf79a0d9dbc";
    //B.유입추적함수
    if (!window._nasa) {
      window._nasa = {};
      window.wcs.inflow();
    }
    // C. 로그 수집 함수 호출
    window.wcs_do(window._nasa);
  } catch (e) {}
};

export const sendNaverPremiumLogEvent = (type, value) => {
  if (!checkHost()) return;

  try {
    window._nasa = {};
    window._nasa["cnv"] = window.wcs.cnv(type, value);
    initNaverPremiumLog();
    window._nasa = {};
  } catch (e) {}
};

const initMob = () => {
  if (!checkHost()) return;
  if (!window.EN) {
    setTimeout(initMob, 500);
    return;
  }

  try {
    var rf = new window.EN();
    rf.setData("userid", "wizschool");
    rf.setSSL(true);
    rf.sendRf();
  } catch (e) {}
};

export const sendMobEvent = () => {
  if (!checkHost()) return;

  try {
    var cn = new window.EN();
    cn.setData("uid", "wizschool");
    cn.setData("ordcode", "");
    cn.setData("qty", "1");
    cn.setData("price", "1");
    cn.setData("pnm", encodeURIComponent(encodeURIComponent("counsel")));
    cn.setSSL(true);
    cn.sendConv();
  } catch (e) {}
};

//kakao Pixel
export const kakaoPixelPageView = (type, product, id) => {
  if (!window.kakaoPixel) return;
  const kakaoPixel = window.kakaoPixel("9175849215000034364");
  if (type === "freeTrial") {
    kakaoPixel.pageView();
    kakaoPixel.signUp();
  } else if (type === "payment") {
    kakaoPixel.pageView();
    kakaoPixel.purchase({
      total_price: `${product.price}`,
      currency: "KRW",
      payment_id: id,
      products: [product],
    });
  }
};

// google ads
export const sendAdsEvent = (type, price = 1, id = "") => {
  if (!window.gtag) return;
  const gtag = window.gtag;
  switch (type) {
    case "freeTrial":
      gtag("event", "conversion", {
        send_to: "AW-623322625/U2FECMvEz-MBEIHMnKkC",
      });
      break;
    case "payment":
      gtag("event", "conversion", {
        send_to: "AW-623322625/JmbsCPKCz-MBEIHMnKkC",
        value: `${price}`,
        currency: "KRW",
        transaction_id: `${id}`,
      });
      break;
    default:
      break;
  }
};

// kakako ads
export const sendKakaoAdsEvent = (type, id, price) => {
  var DaumConversionDctSv;
  if (type === "freeTrial") {
    DaumConversionDctSv = "type=P,orderID=,amount=";
  } else {
    DaumConversionDctSv = `type=W,orderID=${id},amount=${price}`;
  }
  var DaumConversionAccountID = "PE_lF6bJzTQFQVEH3LdxHQ00";
  if (typeof DaumConversionScriptLoaded == "undefined" && window.location.protocol !== "file:") {
    (function () {
      var i = "r" + new Date().getTime() * Math.random() * 9;
      i = i.substr(0, 15);
      var l = "https://";
      var p = [
        l + "cts.keyword.ad.daum.net/clt.do?s=clix",
        l + "cts.ad.daum.net/clt.do?s=ddn",
        l + "cts.ad.daum.net/clt.do?s=moment",
        l + "cts.vcr.daum.net/clt.do?s=vcr",
      ];
      var n = [];
      n.push("wh=" + window.screen.width + "x" + window.screen.height);
      n.push("ln=" + window.history.length);
      n.push("rf=" + encodeURIComponent(document.referrer));
      var o = n.join("&");
      var k =
        "&a=" +
        encodeURIComponent(DaumConversionAccountID) +
        "&v=" +
        encodeURIComponent(DaumConversionDctSv) +
        "&p=" +
        encodeURIComponent(o) +
        "&vr=260&r=" +
        i;
      var m = [];
      for (var j = 0; j < p.length; j++) {
        m[j] = new Image();
        m[j].src = p[j] + k;
      }
    })();
  }
};

// facebook pixel
export const sendFBPixelEvent = (eventName, option = {}) => {
  if (!window.fbq) return;
  try {
    if (eventName === "freeTrial") {
      window.fbq("track", "freeTrial");
    } else if (eventName.includes("skinschool")) {
      // freetrial_start_skinschool 무료체험 버튼클릭
      // freetrial_end_skinschool 무료체험 완료
      window.fbq("track", eventName);
    } else if (eventName === "payment") {
      window.fbq("track", "payment", {
        content_ids: [option.id],
        eventRef: "",
        currency: "KRW",
        num_items: 1,
        value: option.value,
      });
    } else {
      return;
    }
  } catch (err) {
    console.err(err);
  }
};

// buzzvil cpa web 연동 초기화
export const buzzAdInit = (searchParam) => {
  try {
    if (/bz_tracking_id/.test(searchParam)) {
      localStorage.BuzzAd = searchParam;
    }
  } catch (err) {
    console.error(err);
  }
};

// buzzvil cpa web 액션 달성 전송
export const sendBuzzADEvent = () => {
  (function (img) {
    try {
      img.onload = function () {
        if (/bz_tracking_id/.test(localStorage.BuzzAd)) {
          const param = new URLSearchParams(localStorage.BuzzAd);
          console.log("bz_tracking_id: " + param.get("bz_tracking_id"));
        }
        //*필요시 여기서 리다이렉트 수행*
      };
      if (localStorage.BuzzAd === null) {
        localStorage.BuzzAd = "";
      }
      img.src = "//track.buzzvil.com/action/pb/cpa/default/pixel.gif" + localStorage.BuzzAd;
    } catch (err) {
      console.error(err);
    }
  })(new Image());
};

export const sendActiveCampaignEvent = (email, eventName, eventData = {}) => {
  const data = {
    actid: 1001601248,
    key: "b68509382c15434856d28da8a2f07530763a4f54",
    event: eventName,
    eventdata: JSON.stringify(eventData),
    visit: JSON.stringify({ email }),
  };

  const formData = new URLSearchParams();

  for (let key in data) {
    formData.append(key, data[key]);
  }

  fetch("https://trackcmp.net/event", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: formData.toString(),
  })
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error(err));
};

export function gtag() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}
