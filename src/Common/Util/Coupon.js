import moment from "moment";
import * as request from "./HTTPRequest";

export const getActiveCoupon = (email) => {
  return request
    .getCoupons({ email })
    .then((res) => res.json())
    .then((data) =>
      data.filter((coupon) => {
        const today = moment();
        const day = moment(coupon.expiredAt).diff(today, "days");
        coupon.remainDate = day;
        return !coupon.paymentId && day > -1 && coupon.coupon.status === "active";
      }),
    );
};

export const getInactiveCoupon = (email) => {
  return request
    .getCoupons({ email })
    .then((res) => res.json())
    .then((data) =>
      data.filter((coupon) => {
        const today = moment();
        const day = moment(coupon.expiredAt).diff(today, "days");
        coupon.reason = day < 0 ? "기간 만료" : "사용 완료";
        if (coupon.coupon.status === "inactive") {
          coupon.reason = "사용 불가";
        }
        return coupon.paymentId || (day < 0 && day > -366) || coupon.coupon.status === "inactive";
      }),
    );
};

export const isAvailableToUsePayment = (productInfo) => {
  const {
    classType,
    information: { tickets },
    name,
  } = productInfo;
  if (classType !== "individual") return false;
  if (tickets % 12 !== 0) return false;
  if (name.includes("개인")) return false;
  return true;
};
