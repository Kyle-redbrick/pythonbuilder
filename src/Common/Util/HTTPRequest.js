import { roomId } from "../../Page/Python/Component/util/pythonSocket";
import { URL } from "./Constant";
import { detectIE } from "./detectBrowser";

const fetchRequest = (url, method, param) => {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    platform: "wizlive",
  };

  if (localStorage.getItem("wizToken")) {
    headers["Authorization"] = localStorage.getItem("wizToken");
  }

  if (detectIE()) {
    headers["Pragma"] = "no-cache";
  }
  if (param) {
    return fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(param),
    });
  } else {
    return fetch(url, {
      method: method,
      headers: headers,
    });
  }
};

/**** User */
export const userProfile = (param) => {
  return fetchRequest(URL.API_SERVER + `user/profile/${param.email}`, "GET");
};
export const login = (param) => {
  return fetchRequest(URL.API_SERVER + "user/login", "POST", param);
};
export const loginByToken = (param) => {
  return fetchRequest(URL.API_SERVER + "user/loginByToken", "POST", param);
};

export const signup = (param) => {
  return fetchRequest(URL.API_SERVER + "user/signup", "POST", param);
};
export const updateUserInfo = (param) => {
  return fetchRequest(URL.API_SERVER + "user/update", "POST", param);
};
export const sendPasswordMail = (param) => {
  return fetchRequest(URL.API_SERVER + "user/sendPasswordMail/", "POST", param);
};
export const userCounts = (param) => {
  return fetchRequest(URL.API_SERVER + `user/userCounts/${param.email}`, "GET");
};
export const getBadgeCount = (param) => {
  return fetchRequest(URL.API_SERVER + `user/badge/${param.email}`, "GET");
};

/**** SMS */
export const smsIssue = (param) => {
  return fetchRequest(URL.API_SERVER + "sms/issue", "POST", param);
};
export const smsCheck = (param) => {
  return fetchRequest(URL.API_SERVER + "sms/check", "POST", param);
};
export const smsPlayLink = (param) => {
  return fetchRequest(URL.API_SERVER + "sms/playLink", "POST", param);
};

/**** page */
export const getHomeInfo = (param) => {
  return fetchRequest(URL.API_SERVER + `page/home`, "GET");
};
export const getDashboardInfo = (param) => {
  return fetchRequest(URL.API_SERVER + `page/dashboard/${param.email}`, "GET");
};
export const getWizAppInfo = (param) => {
  return fetchRequest(URL.API_SERVER + "page/wizappMobile", "GET");
};
export const getWizClassInfo = (param) => {
  return fetchRequest(URL.API_SERVER + "page/wizclass", "GET");
};
export const getUserRankingInfo = (param) => {
  return fetchRequest(URL.API_SERVER + "page/ranking", "POST", param);
};
export const getClabInfo = (param) => {
  return fetchRequest(URL.API_SERVER + "page/clab", "GET");
};

/**** Project */
export const getDefaultProject = (param) => {
  return fetchRequest(URL.API_SERVER + "project/default", "GET");
};
export const getSharedProjects = (param) => {
  return fetchRequest(URL.API_SERVER + "project/shared", "GET");
};
export const getPublishedProject = (param) => {
  return fetchRequest(URL.API_SERVER + `project/published/${param.pId}`, "GET");
};
export const getPublishedProjects = (param) => {
  const { email, offset, limit } = param;
  return fetchRequest(URL.API_SERVER + `project/publisheds/${email}/${offset}/${limit}`, "GET");
};
export const getPublishedProjectByKeyword = (param) => {
  const { keyword } = param;
  return fetchRequest(URL.API_SERVER + `project/search/${keyword}`, "GET");
};

export const updatePublishedProjectsViewCount = (param) => {
  const { pId } = param;
  return fetchRequest(URL.API_SERVER + `project/published/viewcount/${pId}`, "PUT");
};
export const getMyPublishedProjects = (param) => {
  const { email, offset, limit } = param;
  return fetchRequest(URL.API_SERVER + `project/mypublisheds/${email}/${offset}/${limit}`, "GET");
};
export const updateDevelopingProject = (param) => {
  return fetchRequest(URL.API_SERVER + `project/developing/${param.pId}`, "PUT", param);
};
export const deleteDevelopingProject = (param) => {
  return fetchRequest(URL.API_SERVER + `project/developing/${param.pId}/${param.email}`, "DELETE");
};
export const postSharedProject = (param) => {
  return fetchRequest(URL.API_SERVER + "project/shared", "POST", param);
};
export const postPublishedProject = (param) => {
  return fetchRequest(URL.API_SERVER + "project/published", "POST", param);
};
export const getWizlabPlayPage = (param) => {
  return fetchRequest(URL.API_SERVER + "project/getWizlabPlayPage", "POST", param);
};
export const getAppsBy = (param) => {
  const { mode, offset, limit } = param;
  return fetchRequest(URL.API_SERVER + `project/getAppsBy/${mode}/${offset}/${limit}`, "GET");
};

export const getAllStates = (param) => {
  return fetchRequest(URL.API_SERVER + `project/states/${param.email}`, "GET");
};

/*** wiz class */
export const getWizClass = (param) => {
  return fetchRequest(URL.API_SERVER + `wizclass/${param.cId}`, "GET");
};
export const getPurchased = (param) => {
  return fetchRequest(URL.API_SERVER + `wizclass/purchased/${param.cId}/${param.email}`, "GET");
};
export const getPurchasedByPID = (param) => {
  return fetchRequest(URL.API_SERVER + `wizclass/purchased/pId/${param.pId}/${param.email}`, "GET");
};
export const updatePurchasedByPID = (param) => {
  return fetchRequest(URL.API_SERVER + `wizclass/purchased/pId/${param.pId}`, "PUT", param);
};

export const purchaseWizClass = (param) => {
  return fetchRequest(URL.API_SERVER + "wizclass/purchase", "POST", param);
};

/*** comment */
export const getComments = (param) => {
  return fetchRequest(
    URL.API_SERVER + `${param.parentType}/comment/${param.parentId}/${param.limit}/${param.offset}`,
    "GET",
  );
};
export const postComment = (param) => {
  return fetchRequest(URL.API_SERVER + `${param.parentType}/comment`, "POST", param);
};
export const deleteComment = (param) => {
  return fetchRequest(URL.API_SERVER + `published/comment/${param.id}`, "DELETE");
};
export const editComment = (param) => {
  return fetchRequest(URL.API_SERVER + `published/comment`, "PUT", param);
};

export const postReply = (param) => {
  return fetchRequest(URL.API_SERVER + `${param.parentType}/reply`, "POST", param);
};
export const deleteReply = (param) => {
  return fetchRequest(URL.API_SERVER + `published/reply/${param.id}`, "DELETE");
};
export const editReply = (param) => {
  return fetchRequest(URL.API_SERVER + `published/reply`, "PUT", param);
};

/*** like */
export const updatePublishedLike = (param) => {
  return fetchRequest(URL.API_SERVER + "published/like", "POST", param);
};
export const getPublishedLike = (param) => {
  return fetchRequest(URL.API_SERVER + `published/like/${param.pId}/${param.email}`, "GET");
};

/*** upload */
export const upload = (formData) => {
  return fetch(URL.API_SERVER + "upload", {
    method: "POST",
    body: formData,
  });
};
export const uploadAsset = (formData) => {
  return fetch(URL.API_SERVER + "upload/asset", {
    method: "POST",
    body: formData,
  });
};
export const uploadPublished = (param) => {
  return fetchRequest(URL.API_SERVER + "upload/published", "POST", param);
};

/*** basic class */
export const getBasicClasses = (param) => {
  return fetchRequest(URL.API_SERVER + `basic`, "GET");
};

export const getBasicClass = (param) => {
  return fetchRequest(URL.API_SERVER + `basic/${param.id}`, "GET");
};

export const getBasicClassItem = (param) => {
  return fetchRequest(URL.API_SERVER + `basic/item/${param.id}`, "GET");
};

/*** unit complete */
export const getUnitCompletes = (param) => {
  //param:{email:userEmail}
  return fetchRequest(URL.API_SERVER + `unitComplete/${param.email}`, "GET");
};
export const getUnitCompletesByClassId = (param) => {
  //param:{email:userEmail,classId:classId}
  return fetchRequest(URL.API_SERVER + `unitComplete/${param.email}/${param.classId}`, "GET");
};
export const addUnitComplete = (param) => {
  //param:{email:userEmail,itemId:itemId,classId:classId}
  return fetchRequest(URL.API_SERVER + `unitComplete`, "POST", param);
};
export const resetUnitCompletes = (param) => {
  //param:{email:userEmail, classId:classId}
  return fetchRequest(URL.API_SERVER + `unitComplete/${param.email}/${param.classId}`, "DELETE");
};

/*** asset */
export const assetsById = (param) => {
  return fetchRequest(URL.API_SERVER + "asset/getByIds", "POST", param);
};

export const assetsByCategory = (param) => {
  return fetchRequest(URL.API_SERVER + `assets/${param.categoryId}`, "GET");
};

export const getCategories = (param) => {
  return fetchRequest(URL.API_SERVER + `categories`, "GET");
};

export const addAsset = (param) => {
  return fetchRequest(URL.API_SERVER + "asset", "POST", param);
};

/*** billing */
export const billingHoldPayment = (param) => {
  return fetchRequest(URL.API_SERVER + "billing/holdPayment", "POST", param);
};
export const billingNewCustomerWhoPaid = (param) => {
  return fetchRequest(URL.API_SERVER + "billing/newCustomerWhoPaid", "POST", param);
};
export const billingUnsubscribe = (param) => {
  // email, refund
  // return { "lastPayment": 1, "scheduledPayment": 1 }
  return fetchRequest(URL.API_SERVER + `billing/unsubscribe`, "POST", param);
};
export const billingInfo = (param) => {
  return fetchRequest(URL.API_SERVER + `billing/info/${param.email}`, "GET");
};
export const billingUpdateMembership = (param) => {
  return fetchRequest(URL.API_SERVER + `billing/updateMembership`, "POST", param);
};

/*** event */
export const getEvents = (param) => {
  return fetchRequest(URL.API_SERVER + `events`, "GET");
};

/*** community */
export const getCommunityArticles = (param) => {
  return fetchRequest(URL.API_SERVER + `community/articles/${param.limit}/${param.offset}`, "GET");
};

export const getCommunityArticle = (param) => {
  return fetchRequest(URL.API_SERVER + `community/article/${param.articleId}`, "GET");
};

export const addCommunityArticle = (param) => {
  return fetchRequest(URL.API_SERVER + "community/article", "POST", param);
};

export const updateCommunityArticle = (param) => {
  return fetchRequest(URL.API_SERVER + "community/article", "PUT", param);
};

export const deleteCommunityArticle = (param) => {
  return fetchRequest(URL.API_SERVER + `community/article/${param.id}`, "delete");
};

export const getCommunityArticleComments = (param) => {
  return fetchRequest(URL.API_SERVER + `community/article/comments/${param.articleId}`, "GET");
};

export const addCommunityArticleComment = (param) => {
  return fetchRequest(URL.API_SERVER + "community/article/comment", "POST", param);
};

export const updateCommunityArticleComment = (param) => {
  return fetchRequest(URL.API_SERVER + "community/article/comment", "PUT", param);
};

export const deleteCommunityArticleComment = (param) => {
  return fetchRequest(URL.API_SERVER + `community/article/comment/${param.id}`, "delete");
};

export const getCommunityArticleCommentReplies = (param) => {
  return fetchRequest(URL.API_SERVER + `community/article/comment/replies/${param.commentId}`, "GET");
};
export const addCommunityArticleCommentReply = (param) => {
  return fetchRequest(URL.API_SERVER + "community/article/comment/reply", "POST", param);
};

export const updateCommunityArticleReply = (param) => {
  return fetchRequest(URL.API_SERVER + "community/article/comment/reply", "PUT", param);
};

export const deleteCommunityArticleReply = (param) => {
  return fetchRequest(URL.API_SERVER + `community/article/comment/reply/${param.id}`, "delete");
};

export const getCommunityRankings = (param) => {
  return fetchRequest(URL.API_SERVER + `community/rankings/${param.limit}`, "GET");
};

export const selectComment = (param) => {
  return fetchRequest(URL.API_SERVER + "community/article/select", "POST", param);
};

export const getEventAttendPeople = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLiveEventBoard/${param.eventId}`, "GET");
};

export const postEventAttendPeople = (param) => {
  return fetchRequest(URL.API_SERVER + "wizLiveEventBoard ", "POST", param);
};

export const postEventCheckFreetial = (param) => {
  return fetchRequest(URL.API_SERVER + "wizLiveEventBoardFreeTrial ", "POST", param);
};

/*** payment */
export const checkPaymentValidation = (param) => {
  return fetchRequest(URL.API_SERVER + "payments/checkValidation", "POST", param);
};

export const addCLabPayment = (param) => {
  return fetchRequest(URL.API_SERVER + "payments", "POST", param);
};

export const cancelCLabPayment = (param) => {
  return fetchRequest(URL.API_SERVER + "payments/clab_payments_canceled", "PUT", param);
};

export const addCLabSchedules = (param) => {
  return fetchRequest(URL.API_SERVER + "payments/schedules", "POST", param);
};

export const getCLabPayment = (param) => {
  return fetchRequest(URL.API_SERVER + `payments/${param.email}/${param.productId}`, "GET");
};

export const getCLabPaymentAll = (param) => {
  return fetchRequest(URL.API_SERVER + `payments/${param.email}`, "GET");
};

/*** product */
export const getCLabProducts = (param) => {
  return fetchRequest(URL.API_SERVER + `products/${param.productType}`, "GET");
};
export const getCLabProduct = (param) => {
  return fetchRequest(URL.API_SERVER + `product/${param.id}`, "GET");
};

/*** clive */
export const getCLiveReservation = (param) => {
  return fetchRequest(URL.API_SERVER + `clive/reservation/${param.id}`, "GET");
};
export const addCLivePayment = (param) => {
  return fetchRequest(URL.API_SERVER + `clivePayments`, "POST", param);
};
export const cancelCLivePayment = (param) => {
  return fetchRequest(URL.API_SERVER + "clivePayments/payments_canceled", "PUT", param);
};
export const getCLivePayment = (param) => {
  return fetchRequest(URL.API_SERVER + `clivePayment/${param.reservationId}`, "GET");
};
export const getCLivePaymentAll = (param) => {
  return fetchRequest(URL.API_SERVER + `clivePayments/${param.email}`, "GET");
};

/*** gameRanking */
export const getGameRanking = (param) => {
  const { pId } = param;
  return fetchRequest(URL.API_SERVER + `gameRanking/${pId}`, "GET");
};
export const getGameRankingAsc = (param) => {
  const { pId } = param;
  return fetchRequest(URL.API_SERVER + `gameRanking/asc/${pId}`, "GET");
};

export const saveScore = (param) => {
  return fetchRequest(URL.API_SERVER + "gameRanking", "POST", param);
};

/*** clab portfolio */
export const getPortfolios = (param) => {
  return fetchRequest(URL.API_SERVER + `project/portfolios`, "GET");
};

/*** statistics */
export const sendToStatistics = (param) => {
  return fetchRequest(URL.API_SERVER + "statistics", "POST", param);
};

/*** C.Live */
export const getTutorsReservation = (param) => {
  const { year, month, day } = param;
  return fetchRequest(URL.API_SERVER + `clive/reservations/tutors/${year}/${month}/${day}`, "GET");
};

export const getTutorReservation = (param) => {
  const { email, year, month, day } = param;
  return fetchRequest(URL.API_SERVER + `clive/reservations/tutor/${email}/${year}/${month}/${day}`, "GET");
};

export const getStudentReservation = (param) => {
  const { email, year, month, day } = param;
  return fetchRequest(URL.API_SERVER + `clive/reservations/student/${email}/${year}/${month}/${day}`, "GET");
};

export const getTutor = (param) => {
  return fetchRequest(URL.API_SERVER + `clive/tutor/${param.email}`, "GET");
};

export const getRoomId = (param) => {
  return fetchRequest(URL.API_SERVER + `clive/roomId/${param.email}`, "GET");
};

/*** CLive Payments */
export const getClivePaymentById = (param) => {
  const { reservationId } = param;
  return fetchRequest(URL.API_SERVER + `clivePayment/${reservationId}`, "GET");
};

/*** premium classes */
export const getPremiumClasses = (param) => {
  return fetchRequest(URL.API_SERVER + "premiumClasses", "GET");
};
export const getPremiumClass = (param) => {
  return fetchRequest(URL.API_SERVER + `premiumClasses/${param.id}`, "GET");
};
export const purchasePremiumClass = (param) => {
  return fetchRequest(URL.API_SERVER + "premiumClasses/purchase", "POST", param);
};
export const getPurchasedPremiumClass = (param) => {
  return fetchRequest(URL.API_SERVER + `premiumClasses/purchased/${param.email}/${param.classId}`, "GET");
};
export const getPurchasedPremiumClasses = (param) => {
  return fetchRequest(URL.API_SERVER + `premiumClasses/purchased/${param.email}`, "GET");
};
export const updatePurchasedPremiumClass = (param) => {
  return fetchRequest(URL.API_SERVER + `premiumClasses/purchased/${param.id}`, "PUT", param);
};

export const getPremiumClassProjects = (param) => {
  return fetchRequest(URL.API_SERVER + `premiumClasses/developings/${param.email}`, "GET");
};

/*** point payment */
export const addPointPayment = (param) => {
  return fetchRequest(URL.API_SERVER + "pointPayments", "POST", param);
};

export const cancelPointPayment = (param) => {
  return fetchRequest(URL.API_SERVER + "pointPayments/payments_canceled", "PUT", param);
};

export const getPointPayment = (param) => {
  return fetchRequest(URL.API_SERVER + `pointPayment/${param.id}`, "GET");
};

export const getPointPaymentAll = (param) => {
  return fetchRequest(URL.API_SERVER + `pointPayments/${param.email}`, "GET");
};

export const pushInstantRun = (param) => {
  return fetchRequest(URL.API_SERVER + `push/instantRun`, "POST", param);
};

/*** noti */
export const getNotifications = (param) => {
  return fetchRequest(URL.API_SERVER + `notification/${param.email}/${param.limit}/${param.offset}`, "GET");
};

/*** subscribe */
export const getRecommendedUsers = (param) => {
  return fetchRequest(URL.API_SERVER + `subscribe/recommendeds`, "GET");
};

export const getSubscribes = (param) => {
  return fetchRequest(URL.API_SERVER + `subscribe/creators/${param.email}`, "GET");
};

export const isSubscribe = (param) => {
  return fetchRequest(URL.API_SERVER + `subscribe/isSubscribe/${param.email}/${param.creatorEmail}`, "GET");
};

export const getProjectsBySubscibe = (param) => {
  return fetchRequest(URL.API_SERVER + `project/subscribe/${param.offset}/${param.limit}`, "POST", param);
};

export const addSubscribe = (param) => {
  return fetchRequest(URL.API_SERVER + `subscribe`, "POST", param);
};

export const removeSubscribe = (param) => {
  return fetchRequest(URL.API_SERVER + `subscribe/${param.email}/${param.creatorEmail}`, "DELETE");
};

/*** products */
export const getProducts = (param) => {
  return fetchRequest(
    URL.API_SERVER + `products?language=${param.language}&classType=${param.classType}&target=${param.target}`,
    "GET",
  );
};
export const getProduct = (param) => {
  return fetchRequest(URL.API_SERVER + `product/id/${param.id}`, "GET");
};

export const getCustomProducts = (param) => {
  return fetchRequest(URL.API_SERVER + `products/custom?email=${param.email}`, "GET");
};

/*** payments */
export const addPayment = (param) => {
  return fetchRequest(URL.API_SERVER + `payment`, "POST", param);
};
export const cancelPayment = (param) => {
  return fetchRequest(URL.API_SERVER + `payment/cancel/${param.id}`, "PUT", param);
};
export const getPaymentResult = (param) => {
  return fetchRequest(URL.API_SERVER + `payment/result/${param.email}/${param.id}`, "GET");
};
export const getPaymentResults = (param) => {
  return fetchRequest(URL.API_SERVER + `payment/result/${param.email}`, "GET");
};

/*** payments -- subscription */
export const trySubscription = (param) => {
  return fetchRequest(URL.API_SERVER + `payment/subscription`, "POST", param);
};

/***wizlive */
export const addReservation = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/reservation`, "POST", param);
};

export const setCompleteReservation = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/setCompleteReservation`, "PUT", param);
};

// export const getReservations = param => {
//   return fetchRequest(
//     URL.API_SERVER + `wizLive/reservations/${param.type}/${param.email}`,
//     "GET"
//   );
// };

// export const getReservations = param => {
//   return fetchRequest(
//     URL.API_SERVER + `wizLive/reservations/${param.email}`,
//     "GET"
//   );
// };

export const getReservations = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/reservations/${param.type}/${param.email}`, "GET");
};
export const getTutors = (param) => {
  return fetchRequest(
    URL.API_SERVER +
      `wizLive/reservation/tutors?offset=${param.offset}&limit=${param.limit}${param.tag ? `&tagId=${param.tag}` : ""}`,
    "GET",
  );
};

export const getTutorPopUp = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/tutor/information/${param.email}`, "GET");
};

// export const getTutorsByDay = param => {
//   return fetchRequest(
//     URL.API_SERVER + `wizLive/tutors/${param.date}/`,
//     "GET"
//   );
// };

export const getTutorsByDay = (param) => {
  return fetchRequest(
    URL.API_SERVER + `wizLive/tutors/new/${param.type}/${param.date}/${param.studentEmail}/schedule`,
    "GET",
  );
};

export const getTimesByTutor = (param) => {
  return fetchRequest(
    URL.API_SERVER + `wizLive/tutors/new/${param.type}/${param.date}/${param.tutorEmail}/tutorSchedule`,
    "GET",
  );
};

export const getAllTutors = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/reservation/tutors/${param.type}`, "GET");
};

export const getTutorTags = () => {
  return fetchRequest(URL.API_SERVER + `wizlive/tag`, "GET");
};

// export const getTutorsByDateTime = param => {
//   return fetchRequest(
//     URL.API_SERVER + `wizLive/tutors/${param.date}/${param.time}`,
//     "GET"
//   );
// };

export const getTutorsByDateTime = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/tutors/new/${param.type}/${param.date}/${param.time}`, "GET");
};

export const cancelReservation = (param) => {
  const { id, type, sameDayCancellation, haveSameDayCancellation } = param;
  return fetchRequest(URL.API_SERVER + `wizLive/reservation/delete/student/${id}/${type}`, "PUT", {
    sameDayCancellation,
    haveSameDayCancellation,
  });
};

export const getLiveTutorRoomId = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/room/${param.email}`, "GET");
};

export const getLiveTutorRoom1v4Id = (params) => {
  return fetchRequest(URL.API_SERVER + `wizLive/room/${params.email}/${params.roomId}`, "GET");
};

export const getStudentDashboardData = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/student/dashboard/${param.email}`, "GET");
};

export const postFeedbackFromStudent = (param) => {
  return fetchRequest(URL.API_SERVER + "wizLive/student/dashboard/feedback", "POST", param);
};

export const getReservationsByType = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/student/all/${param.type}/${param.email}`, "GET");
};

export const getReservationsById = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/reservation/id/${param.id}`, "GET");
};

export const getLiveTutorFeedback = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/student/feedback/${param.email}/${param.id}`, "GET");
};

/***wizlive - tutor */
export const getTutorActivity = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/reservation/tutor/activity/${param.email}`, "GET");
};

export const getTutorStudents = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/reservation/tutor/students/${param.email}`, "GET");
};

export const getTutorMonthlyReservations = (param) => {
  return fetchRequest(
    URL.API_SERVER +
      `wizLive/reservation/tutor/schedule/${param.tutorType}/${param.type}/${param.email}/${param.year}/${param.month}`,
    "GET",
  );
};

// export const getTutorMonthlyReservations = param => {
//   return fetchRequest(
//     URL.API_SERVER +
//       `wizLive/reservation/tutor/schedule/${param.type}/${param.email}/${
//         param.year
//       }/${param.month}`,
//     "GET"
//   );
// };

export const postTutorMonthlyReservations = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/reservation/tutor/schedule`, "POST", param);
};

export const getTutorReservationsSummary = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/reservation/tutor/${param.email}`, "GET");
};

export const getTutorReservationsByType = (param) => {
  return fetchRequest(
    URL.API_SERVER + `wizLive/reservation/tutor/${param.type}/${param.email}/${param.offset}/${param.limit}`,
    "GET",
  );
};

// export const getStudentReservationsByType = param => {
//   return fetchRequest(
//     URL.API_SERVER +
//       `wizLive/reservation/student/${param.lectureType}/${param.type}/${
//         param.email
//       }/${param.offset}/${param.limit}`,
//     "GET"
//   );
// };

export const getTutorLectureGroups = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/tutor/${param.email}/groups`, "GET");
};

export const getLectureGroupReservations = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/lectureGroup/${param.lectureGroupId}/reservations`, "GET");
};

export const getLectureGroupReservation = (param) => {
  return fetchRequest(
    URL.API_SERVER + `wizLive/lectureGroup/${param.lectureGroupId}/reservation/${param.roomId}}`,
    "GET",
  );
};

export const getStudentReservationsByType = (param) => {
  return fetchRequest(
    URL.API_SERVER + `wizLive/reservation/student/${param.type}/${param.email}/${param.offset}/${param.limit}`,
    "GET",
  );
};

export const postSendStudentMessage = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/reservation/tutor/sendStudentMessage`, "POST", param);
};

export const putReservationCancel = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/reservation/delete/tutor/${param.id}`, "PUT");
};

export const getTutorFeedback = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/student/feedback/${param.email}/${param.id}`, "GET");
};

export const getLectureInfoByTutor = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/getLectureInfoByTutor/${param.lectureType}/${param.email}`, "GET");
};

export const postTutorFeedback = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/reservation/tutor/feedback`, "POST", param);
};

export const wizLiveGetUserInfo = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/getUserInfo/${param.email}`, "GET");
};
export const wizLiveGetPublishProject = (param) => {
  return fetchRequest(
    URL.API_SERVER + `wizLive/getPublishProject/${param.email}/${param.order}/${param.offset}/${param.limit}`,
    "GET",
  );
};
export const wizLiveGetMyProject = (param) => {
  return fetchRequest(
    URL.API_SERVER + `wizLive/getMyProject/${param.email}/${param.order}/${param.offset}/${param.limit}`,
    "GET",
  );
};
// get curriculum data
export const wizLiveGetCurriculum = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/curriculum/${param.curriculumId}`, "GET");
};
// get complete reservations
export const getCompleteReservations = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/student/complete/${param.type}/${param.email}`, "GET");
};

// wizlive status send to slack
export const sendWizLiveWebhook = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/webhook`, "POST", param);
};

//game data
export const loadGameData = (param) => {
  return fetchRequest(URL.API_SERVER + `gameData/load`, "POST", param);
};

export const saveGameData = (param) => {
  return fetchRequest(URL.API_SERVER + `gameData/save`, "POST", param);
};

/** wiz lab project list */
export const getProjectListForTutor = (param) => {
  return fetchRequest(URL.API_SERVER + `project/list/tutor`, "GET");
};

export const getProjectLoadForTutor = (param) => {
  return fetchRequest(URL.API_SERVER + `project/load/tutor/${param.id}`, "GET");
};

/** monitor */
export const getTodayAvailableRooms = (param) => {
  return fetchRequest(URL.API_SERVER + "wizLive/todayAvailableRooms", "GET");
};

export const addWizLiveTrial = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLiveFreeTrial`, "POST", param);
};

export const getLectureSchedules = (param) => {
  return fetchRequest(URL.API_SERVER + `lectureSchedules?type=${param.type}&isDeleted=false`, "GET");
};

export const getMarketingInflowRoutes = (param) => {
  return fetchRequest(URL.API_SERVER + `marketingInflowRoutes`, "GET");
};

export const addTutorRecruit = (param) => {
  return fetchRequest(URL.API_SERVER + `tutorRecruit`, "POST", param);
};

export const getCurriculumProgress = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/getCurriculumProgress/${param.email}`, "GET");
};

export const postSurvey = (param) => {
  return fetchRequest(URL.API_SERVER + `survey`, "POST", param);
};

// wizlive quiz & report
export const getQuizList = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/quiz/list/${param}`, "GET");
};

export const getMyQuizList = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/myQuiz/list/${param.email}/${param.type}`, "GET");
};

export const updateMyQuiz = (param) => {
  return fetchRequest(URL.API_SERVER + "wizLive/myQuiz/update", "POST", param);
};

export const getMyReport = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/myReport/${param.email}/${param.myQuizId}`, "GET");
};

/* wizlive tutorGuide, tutorNotice  */
export const getTutorGuide = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/tutorGuide/guide/${param}`, "GET");
};

export const getTutorNotice = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/tutorNotice`, "GET");
};

export const getRegularClass = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/tutorGuide/regularClass/${param}`, "GET");
};

export const getOnlineTextbook = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/textbook/${param.offset}/${param.limit}`, "GET");
};

// coupon
export const checkCodeValidation = (param) => {
  return fetchRequest(URL.API_SERVER + `coupon/validation/${param.code}`, "GET");
};

// promotion coupon validation
export const checkPromotionCodeValidation = (param) => {
  return fetchRequest(URL.API_SERVER + `promotionCode/valid`, "POST", param);
};

export const useCode = (param) => {
  return fetchRequest(URL.API_SERVER + `coupon/use/${param.code}`, "PUT");
};

//event
export const getWizLiveEvents = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLiveEvents`, "GET");
};

export const getWizLiveEvent = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLiveEvents/${param.eventId}`, "GET");
};

// event result
export const getWizLiveEventResults = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLiveEventResults`, "GET");
};

export const getWizLiveEventResultById = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLiveEventResult/${param.eventId}`, "GET");
};

export const addWizLiveEventResult = (param) => {
  return fetchRequest(URL.API_SERVER + "wizLiveEventResult", "POST", param);
};

// oxQuiz event
export const createOxQuizCoupon = (param) => {
  return fetchRequest(URL.API_SERVER + "wizLiveEvent/oxQuiz", "POST", param);
};

// get Python Reservation List
export const getReservationList = () => {
  return fetchRequest(URL.API_SERVER + "wizLive/todayAvailableRooms/python", "GET");
};

// get Python 1:4 Reservation List
export const getReservationList1v4 = () => {
  return fetchRequest(URL.API_SERVER + "wizLive/1v4/todayAvailableRooms", "GET");
};

// set enteranceTime
export const postLiveEntrance = (param) => {
  return fetchRequest(URL.API_SERVER + "wizLive/entrance", "POST", param);
};

export const postLive1v4Entrance = (param) => {
  return fetchRequest(URL.API_SERVER + "wizLive/1v4/entrance", "POST", param);
};

// get tutor traing Script List
export const getLectureList = (param) => {
  return fetchRequest(URL.API_SERVER + "admin/wizlive/lectures", "POST", param);
};

// get tutor traing Script List
export const getLectureListPython = (param) => {
  return fetchRequest(URL.API_SERVER + "admin/wizlive/lecturesPython", "POST", param);
};

// get pythonReview List
export const getReviewList = (param) => {
  return fetchRequest(URL.API_SERVER + `wizLive/python/reviewState/${param.id}/${param.email}`, "GET");
};

//get record info
export const getS3Json = (param) => {
  return fetch(param.url, {
    method: "GET",
    headers: {},
  });
};

// event stock value change
export const eventPayment = (param) => {
  return fetchRequest(URL.API_SERVER + `eventPayment`, "POST", param);
};

// get tutor traing Script List
export const getWhiteList = (param) => {
  return fetchRequest(URL.API_SERVER + `whiteList/${param.email}`, "GET");
};

export const getReservationWhiteList = (param) => {
  return fetchRequest(URL.API_SERVER + `reservationWhiteList/${param.email}/${param.reservationId}`, "GET");
};

// 1v4 get students API
export const getReservationStudents = (roomId) => {
  return fetchRequest(URL.API_SERVER + `wizLive/reservation/students/${roomId}`, "GET");
};

export const startRecording = (params) => {
  return fetchRequest(URL.API_SERVER + "wizlive/record/start", "POST", params);
};

export const stopRecording = (params) => {
  return fetchRequest(URL.API_SERVER + "wizlive/record/stop", "POST", params);
};

/*** Coupon system */
export const getCoupons = (params) => {
  const { email } = params;
  return fetchRequest(URL.API_SERVER + `userCoupons${email ? "?email=" + email : ""}`, "GET");
};
