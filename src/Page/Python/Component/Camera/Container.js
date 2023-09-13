import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import * as socketUtil from "../util/pythonSocket";
import View from "./View";
import * as request from "../../../../Common/Util/HTTPRequest";
import { RtcRole } from "agora-access-token";
import AgoraClient, { SlackWebhook } from "../util/agoraClient";
import { AGORA_UID } from "../../../../Common/Util/Constant";
class Container extends Component {
  constructor(props) {
    super(props);

    this.localVideoRef = createRef();
    this.remoteVideoRef = createRef();
    this.isRecord = this.isRecording();
    this.localAudioTrack = null;
    this.localVideoTrack = null;
  }

  get agoraUID() {
    if (this.isRecording()) {
      return AGORA_UID.RECORDING;
    }

    const { userType } = this.props;

    if (userType === "tutor") {
      return AGORA_UID.TUTOR;
    } else if (userType === "student") {
      return AGORA_UID.STUDENT;
    }
  }

  get userType() {
    if (this.isRecording()) {
      return "record";
    }

    return this.props.userType;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.inputEventListener, true);
    document.addEventListener("keydown", this.inputEventListener, true);
    this.dragElement(document.querySelector("#Python_Camera")); // dragEvent create

    socketUtil.socket.on("syncLectureEnd", () => {
      this.agoraClient.unpublish();
    });

    this.setup();
  }

  setup = async () => {
    const reservation = await this.getLiveTutorRoom();
    const { tutorEmail, studentEmail, roomId } = reservation;

    this.agoraClient = new AgoraClient(
      {
        appid: "60dcb9c3c74b44b6b0b85aad121d4b3b",
        appCertificate: "fa4e9a552b6c47e3a434f136539cd7d4",
        channel: String(roomId),
        uid: this.agoraUID,
        role: this.isRecord ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER,
      },
      this.userType,
      new SlackWebhook(tutorEmail, studentEmail, this.userType, roomId),
    );

    this.agoraClient.setLocalVideo(this.localVideoRef);
    this.agoraClient.setRemoteVideo(this.remoteVideoRef);

    await this.agoraClient.join();

    if (!this.isRecord) {
      const [selectedMicrophoneId, selectedCameraId] = await this.agoraClient.getMediaInputDevices();
      const [audioTrack, videoTrack] = await this.agoraClient.getLocalMediaTracks(
        selectedMicrophoneId,
        selectedCameraId,
      );

      this.localAudioTrack = audioTrack;
      this.localVideoTrack = videoTrack;

      this.localVideoTrack.play(this.localVideoRef.current);
      this.agoraClient.publish(this.localAudioTrack, this.localVideoTrack);

      this.agoraClient.onChangeMediaDevice(this.localAudioTrack, this.localVideoTrack);
    }
  };

  getLiveTutorRoom = async () => {
    try {
      const liveTutorRoom = await request.getLiveTutorRoomId(this.props).then((res) => res.json());
      return liveTutorRoom;
    } catch (err) {
      console.error(err);
    }
  };

  dragElement = (elmnt) => {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    if (document.getElementById(elmnt.id)) {
      document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();

      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      const $cameraContent = document.querySelector(".Camera_Content");
      const camera_x = $cameraContent.getBoundingClientRect().x;
      const camera_y = $cameraContent.getBoundingClientRect().y;
      const camera_width = $cameraContent.getBoundingClientRect().width;
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight - $cameraContent.clientHeight;

      if (camera_x >= 5 && camera_x <= maxWidth - camera_width - 5) {
        let result_left = camera_x - pos1;
        elmnt.style.left = (result_left / maxWidth) * 100 + "%";
      } else {
        let result_left = 0;
        !(camera_x >= 5) ? (result_left = camera_x + Math.abs(pos1)) : (result_left = camera_x - Math.abs(pos1));
        elmnt.style.left = (result_left / maxWidth) * 100 + "%";
      }

      if (camera_y >= 5 && camera_y <= maxHeight - 10) {
        let result_top = camera_y - pos2;
        elmnt.style.top = (result_top / window.innerHeight) * 100 + "%";
      } else {
        let result_top = 0;
        !(camera_y >= 5) ? (result_top = camera_y + Math.abs(pos2)) : (result_top = camera_y - Math.abs(pos2));
        elmnt.style.top = (result_top / window.innerHeight) * 100 + "%";
      }
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };

  isRecording = () => {
    return new URLSearchParams(window.location.search).has("userToken");
  };

  render() {
    return <View localVideoRef={this.localVideoRef} remoteVideoRef={this.remoteVideoRef} />;
  }
}

export default connect((state) => ({ email: state.userinfo.email }))(Container);
