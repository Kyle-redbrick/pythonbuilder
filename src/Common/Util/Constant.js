import { checkDueDate } from "../Util/checkDueDate";

export const URL = {
  API_SERVER: process.env.REACT_APP_API_SERVER,
  WIZSCHOOL: process.env.REACT_APP_WIZSCHOOL,
  WEBRTC_SERVER: process.env.REACT_APP_WEBRTC_SERVER,
  WIZSCHOOL_BUILDER: process.env.REACT_APP_WIZSCHOOL_BUILDER,
  WIZSCHOOL_BUILDER_READONLY: process.env.REACT_APP_WIZSCHOOL_BUILDER_READONLY,
  WIZSCHOOL_BUILDER_EDIT: process.env.REACT_APP_WIZSCHOOL_BUILDER_EDIT,
  WIZSCHOOL_LIVE: process.env.REACT_APP_WIZSCHOOL_LIVE,
  WIZSCHOOL_LIVE_1V4: process.env.REACT_APP_WIZSCHOOL_LIVE_1V4,
  WIZSCHOOL_ENVTEST: "https://dev.wizschool.io/#/envtest/",
  WIZSCHOOL_LAB: process.env.REACT_APP_WIZSCHOOL_LAB,
  WIZSCHOOL_RECORD: process.env.REACT_APP_WIZSCHOOL_RECORD,
  WIZSCHOOL_RECORD_PYTHON: process.env.REACT_APP_WIZSCHOOL_RECORD_PYTHON,
  WIZSCHOOL_REVIEW_PYTHON: process.env.REACT_APP_WIZSCHOOL_REVIEW_PYTHON,
  WIZSCHOOL_PYTHON_STUDENT: process.env.REACT_APP_WIZSCHOOL_PYTHON_STUDENT,
  WIZSCHOOL_PYTHON_TUTOR: process.env.REACT_APP_WIZSCHOOL_PYTHON_TUTOR,
  WIZSCHOOL_PYTHON_1v4_STUDENT: process.env.REACT_APP_WIZSCHOOL_PYTHON_1V4_STUDENT,
  WIZSCHOOL_PYTHON_1v4_TUTOR: process.env.REACT_APP_WIZSCHOOL_PYTHON_1V4_TUTOR,
  WIZSCHOOL_AGORA_RECORD: "https://agora-record-bucket.s3.ap-northeast-2.amazonaws.com/",
  WIZSCHOOL_ETC_BUCKET: "https://wizschool-etc.s3.ap-northeast-2.amazonaws.com/",

  LIVE_TEST: "https://share.wizschool.io/liveTest/",
  JANUS_SERVER: "https://wizlive.wizschool.io:8089/janus",
  ICE_SERVERS: [
    {
      urls: ["stun:wizlive.wizschool.io:3478", "turn:wizlive.wizschool.io:3478"],
      username: "wizmate",
      credential: "dudtkdxhdghk",
    },
  ],
  KAKAO_CHAT: `http://pf.kakao.com/_xaxoSWxb`,
};

export const ActionType = {
  SET_PROJECT: "SET_PROJECT",
  SET_PROJECT_NAME: "SET_PROJECT_NAME",
  RESET_PROJECT: "RESET_PROJECT",
  SET_SCREENSHOT_URL: "SET_SCREENSHOT_URL",

  ADD_SCENE: "ADD_SCENE",
  REMOVE_SCENE: "REMOVE_SCENE",
  REORDER_SCENE: "REORDER_SCENE",

  SELECT_SCENE: "SELECT_SCENE",
  SELECT_SPRITE: "SELECT_SPRITE",

  ADD_SPRITES: "ADD_SPRITES",
  REMOVE_SPRITE: "REMOVE_SPRITE",
  REMOVE_ALL_SPRITE: "REMOVE_ALL_SPRITE",
  REORDER_SPRITE: "REORDER_SPRITE",
  SET_SPRITE_CODE: "SET_SPRITE_CODE",
  SET_SPRITE_PREVIEW: "SET_SPRITE_PREVIEW",

  ADD_SOUNDS: "ADD_SOUNDS",
  REMOVE_SOUND: "REMOVE_SOUND",
  PLAY_SOUND: "PLAY_SOUND",
  PAUSE_SOUND: "PAUSE_SOUND",
  STOP_SOUND: "STOP_SOUND",

  SELECT_API: "SELECT_API",
  SELECT_METHOD: "SELECT_METHOD",

  SET_IS_DRAWER_OPEN: "SET_IS_DRAWER_OPEN",
  SET_DRAWER_CATEGORY: "SET_DRAWER_CATEGORY",

  SET_IS_PLAYING: "SET_IS_PLAYING",
  SET_IS_FULLSCREEN: "SET_IS_FULLSCREEN",
  SET_SCREEN_MODE: "SET_SCREEN_MODE",

  SET_IS_APP_MODAL_ON: "SET_IS_APP_MODAL_ON",

  UPDATE_USERINFO: "UPDATE_USERINFO",
  ADD_POINT: "ADD_POINT",
  SET_MAIN_POPUP: "SET_MAIN_POPUP",
  SET_MAIN_POPUP_EVENT55: "SET_MAIN_POPUP_EVENT55",

  SET_VIDEO_STATUS: "SET_VIDEO_STATUS",
  SET_VIDEO_URL: "SET_VIDEO_URL",
  SET_VIDEO_FLOATING: "SET_VIDEO_FLOATING",

  ADD_NEW_MSG: "ADD_NEW_MSG",
  SET_CHATBOT_ERRORS: "SET_CHATBOT_ERRORS",
  REMOVE_CHATBOT_MESSAGES: "REMOVE_CHATBOT_MESSAGES",
  SET_TUTOR: "SET_TUTOR",
  INIT_CHATBOT: "INIT_CHATBOT",

  WEBRTC_SET_PROJECT: "WEBRTC_SET_PROJECT",
  ADD_DRAWING: "ADD_DRAWING",
  SET_DRAWING_BOARD: "SET_DRAWING_BOARD",
  SET_EDITOR_RANGE: "SET_EDITOR_RANGE",
  SET_LOG: "SET_LOG",

  SET_INSTANTRUN_URL: "SET_INSTANTRUN_URL",
  SET_REQUEST_IMAGE: "SET_REQUEST_IMAGE",
  SET_RESPONSE_IMAGE: "SET_RESPONSE_IMAGE",

  SET_BTN_HIGHLIGHT: "SET_BTN_HIGHLIGHT",

  // 1v4 python
  SET_TUTOR: "SET_TUTOR",
  SET_STUDENTS: "SET_STUDENTS",
  SET_CURRENT_USER: "SET_CURRENT_USER",
};

export const AMPLITUDE_API_KEY = "db80eca24c739147069da61bc7b17235";

export const MainPopupType = {
  LOGIN: "POPUP_LOGIN",
  SIGNUP: "POPUP_SIGNUP",
};

export const StoreDefault = {
  SCENE_ID: "scene1",
  SCENE_NAME: "scene1",
  API_NAME: "ID_MOTION",
  METHOD_NAME: "moveX",
  BACKGROUND_ID: "night_sky_a",
  BACKGROUND_NAME: "night_sky_a",
};

export const ChatbotMsgType = {
  BOT_SELECT: "BOT_SELECT",
  BOT_CONFIRM: "BOT_CONFIRM",
  BOT_API_SCRIPT: "BOT_API_SCRIPT",
  BOT_ERROR: "BOT_ERROR",
  BOT_RECOMMEND_CLASS: "BOT_RECOMMEND_CLASS",

  GAME_SESSION: "GAME_SESSION",
  GAME_PRINT: "GAME_PRINT",

  REQUEST_SOLUTION: "REQUEST_SOLUTION",
  REQUEST_ERROR: "REQUEST_ERROR",
  REQUEST_VIDEO: "REQUEST_VIDEO",
  REQUEST_DIRECTION_WIZLAB: "REQUEST_DIRECTION_WIZLAB",
};

export const DrawerType = {
  API: "DRAWER_API",
  ANIME: "DRAWER_ANIME",
  SOUND: "DRAWER_SOUND",
  CHAT: "DRAWER_CHAT",
};

export const ModalType = {
  STORAGE: "MODAL_STORAGE",
  PUBLISH: "MODAL_PUBLISH",
  QRTEST: "MODAL_QRTEST",
  INSTANT_RUN: "MODAL_INSTANT_RUN",
};

export const SpriteType = {
  PLAIN: "plain",
  SPRITE: "sprite",
  BACKGROUND: "background",
  TEXT: "text",
  CUSTOM: "custom",
  COMPONENT: "component",
};

export const StorageType = {
  CHAR: "STORAGE_CHAR",
  OBJECT: "STORAGE_OBJECT",
  BG: "background",
  SOUND: "sound",
  TEXTBOX: "textbox",
  DRAWING: "drawing",
  COMPONENT: "component",
};

export const ErrorType = {
  PARAMETER_INVALID_TYPE: "PARAMETER_INVALID_TYPE",
  PARAMETER_UNDEFINED: "PARAMETER_UNDEFINED",
  PARAMETER_NOT_FOUND: "PARAMETER_NOT_FOUND",
};

export const DEFAULT_PROFILE_IMAGES = [
  "https://s3.ap-northeast-2.amazonaws.com/wizschool-images/profile-image-00.png",
  "https://s3.ap-northeast-2.amazonaws.com/wizschool-images/profile-image-01.png",
  "https://s3.ap-northeast-2.amazonaws.com/wizschool-images/profile-image-02.png",
  "https://s3.ap-northeast-2.amazonaws.com/wizschool-images/profile-image-03.png",
  "https://s3.ap-northeast-2.amazonaws.com/wizschool-images/profile-image-04.png",
  "https://s3.ap-northeast-2.amazonaws.com/wizschool-images/profile-image-05.png",
  "https://s3.ap-northeast-2.amazonaws.com/wizschool-images/profile-image-06.png",
  "https://s3.ap-northeast-2.amazonaws.com/wizschool-images/profile-image-07.png",
  "https://s3.ap-northeast-2.amazonaws.com/wizschool-images/profile-image-08.png",
  "https://s3.ap-northeast-2.amazonaws.com/wizschool-images/profile-image-09.png",
];

export const DEFAULT_VIDEO_URL = "https://s3.ap-northeast-2.amazonaws.com/wizschool-class-videos/basic_1_preview.mp4";

/* pad */
export const PadSideBarType = {
  API: "SIDEBAR_API",
  ANIME: "SIDEBAR_ANIME",
  SOUND: "SIDEBAR_SOUND",
  CHAT: "SIDEBAR_CHAT",
  SCREEN: "SIDEBAR_SCREEN",
};

export const Holidays = [
  "2020-01-01",
  "2020-01-24",
  "2020-01-25",
  "2020-01-26",
  "2020-01-27",
  "2020-04-15",
  "2020-04-30",
  "2020-05-05",
  "2020-09-30",
  "2020-10-01",
  "2020-10-02",
  "2020-10-09",
  "2020-12-25",
  "2021-01-01",
  "2021-02-11",
  "2021-02-12",
  "2021-03-01",
  "2021-05-05",
  "2021-05-19",
  "2021-09-20",
  "2021-09-21",
  "2021-09-22",
  "2021-12-25",
];

export const Colors = {
  main: "#23d8af",
  totalScroe: "#32c5ff",
  command: "#6dd400",
  notion: "#9c81ff",
};

export const TAB_TYPE = {
  ALL: "all",
  HOME: "home",
  HOME_1v4: "home_1v4",
  UPCOMMING: "upcoming",
  COMPLETE: "complete",
  CANCEL: "canceled",
  MYWORKS: "myworks",
  MANAGEMENT: "management",
  MYLECTURES: "mylectures",
  MYLECTURES_1v4: "mylectures_1v4",
  HISTORY: "history",
  LECTURECALENDAR: "lectureCalendar",
  MYCLASSGROUP: "myClassGroup",
};

export const FREE_TRIAL_TYPE = {
  BASIC: "basic", // 1:1 교육
  MULTI: "multi", // 1:4 교육
};

export const NEW_FREE_TRIAL_TYPE = {
  INDIVIDUAL: "individual",
  GROUP: "group",
};

export const PAYMENT = {
  PG: {
    KG_INISIS: "html5_inicis.MOIwizlive",
    TOSS: "tosspayments",
  },
  METHOD: {
    CARD: "card",
    TRANSFER: "trans",
  },
  CODE: {
    BC_CARD: "361",
  },
};

export const AGORA_UID = {
  TUTOR: "1",
  STUDENT: "2",
  RECORDING: "3",
  MONITOR: "4",
};

export const WEBHOOK_TYPE = {
  CONNECTED: "WEBHOOK_TYPE_CONNECTED",
  CONNECTED_ALL: "WEBHOOK_TYPE_CONNECTED_ALL",
  DISCONNECTED: "WEBHOOK_TYPE_DISCONNECTED",
};

export const ACTIVE_EVENT_IDS = [
  12,
  32,
  checkDueDate("2023-07-14") ? 56 : null,
  checkDueDate("2023-06-30") ? 57 : null,
  checkDueDate("2023-07-31") ? 58 : null,
];
