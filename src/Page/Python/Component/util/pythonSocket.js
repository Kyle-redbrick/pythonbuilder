import io from "socket.io-client";
import * as request from "../../../../Common/Util/HTTPRequest";
const options = {};
// const publicIp = "http://localhost";
const publicIp = "https://dev.wizschool.io";
let port = "3220";
let dockerPort = "3006";
// let dockerPort = "3220";
export let socket = undefined;
export let JanusSocket = undefined;
// export let handleLoop = false;
export let roomId = -1;
export const setUpSocket = async (_lectureInfo) => {
  console.log("setUp Socket Start", _lectureInfo);
  // socket = io(`${publicIp}:${port}`, options);
  roomId = undefined;

  if (["tutorTraining", "pySpring", "review"].includes(_lectureInfo.match.params.userType)) {
    socket = io(`${publicIp}:${dockerPort}`, options);
    roomId = Math.floor(Math.random() * 1000000) + 100000;
    if (roomId > 1000000) roomId = roomId - 100000;
    sendSocket("connectRoom", roomId);
    socket.on("connectToRoom", (data) => {
      console.log("room test message is  , ", data);
    });

    console.log("tutor Training room ", roomId);
    return "tutorTraining";
  } else {
    socket = io(`${publicIp}:${port}`, options);

    const liveTutorRoom = await request.getLiveTutorRoomId({ email: _lectureInfo.email }).then((res) => res.json());

    liveTutorRoom.myLecture.tutorEmail = liveTutorRoom.tutorEmail;

    if (liveTutorRoom && liveTutorRoom.roomId) {
      let entranceBody = {
        id: liveTutorRoom.id,
        isTutor: _lectureInfo.match.params.userType === "tutor" ? true : false,
        pid: liveTutorRoom.myLecture.id,
      };

      request.postLiveEntrance(entranceBody).then((res) => console.log("postLiveEntrance", res.json()));
      roomId = liveTutorRoom.roomId;
      sendSocket("connectRoom", roomId);
      sendSocket("enteranceLecture", _lectureInfo.match.params.userType);
      socket.on("connectToRoom", (data) => {
        console.log("room test message is  , ", data);
      });

      return liveTutorRoom;
    }
  }
};

export const sendSocket = (type, message) => {
  if (socket) socket.emit(type, { roomId, message });
};

export const setUpJanusSocket = () => {
  JanusSocket = io("https://wizlive.wizschool.io:3000/", options);
};

export const sendJanusSocket = (message) => {
  JanusSocket.emit("state", message);
};
