import AgoraRTC from "agora-rtc-sdk-ng";
import { RtcTokenBuilder } from "agora-access-token";
import * as request from "./HTTPRequest";
import { AGORA_UID, WEBHOOK_TYPE } from "./Constant";

/*
  AgoraWebSDK NG API Docs: https://agoraio-community.github.io/AgoraWebSDK-NG/api/en/
*/

export class AgoraClient {
  constructor(options, userType, webhook) {
    this.agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    this.agoraOptions = options;
    this.agoraOptions.token = RtcTokenBuilder.buildTokenWithUid(
      options.appid,
      options.appCertificate,
      options.channel,
      options.uid,
      options.role,
      0,
    );
    this.userType = userType;
    this.webhook = webhook;
  }

  get isSubscriberRtcRole() {
    return ["record", "monitor"].includes(this.userType);
  }

  setLocalVideo(local) {
    this.localVideoRef = local;
  }

  setRemoteVideo(remote) {
    this.remoteVideoRef = remote;
  }

  async join() {
    this.agoraClient.on("connection-state-change", this._handleUserState);
    this.agoraClient.on("user-joined", this._handleUserJoined);
    this.agoraClient.on("user-published", this._handleUserPublished);
    this.agoraClient.on("user-unpublished", this._handleUserUnpublished);

    await this.agoraClient.join(
      this.agoraOptions.appid,
      this.agoraOptions.channel,
      this.agoraOptions.token,
      this.agoraOptions.uid,
    );
  }

  publish(localAudioTrack, localVideoTrack) {
    this.agoraClient.publish([localAudioTrack, localVideoTrack]);
  }

  unpublish() {
    this.agoraClient.unpublish();
  }

  /*
    Interface LocalTrack Docs : https://agoraio-community.github.io/AgoraWebSDK-NG/api/en/interfaces/ilocaltrack.html
  */
  disConnectTrack(track) {
    track.setEnabled(false);
  }

  async getMediaInputDevices() {
    const devices = await AgoraRTC.getDevices();
    const audioDevices = devices.filter((device) => device.kind === "audioinput");
    const videoDevices = devices.filter((device) => device.kind === "videoinput");
    return [audioDevices[0].deviceId, videoDevices[0].deviceId];
  }

  async getLocalAudioDevices() {
    try {
      const audio = await AgoraRTC.getMicrophones();
      return audio;
    } catch (error) {
      return [];
    }
  }

  async getLocalVideoDevices() {
    try {
      const video = await AgoraRTC.getCameras();
      return video;
    } catch (error) {
      return [];
    }
  }

  async getLocalAudioTrack(microphoneId) {
    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({ microphoneId });
    return audioTrack;
  }

  async getLocalVideoTrack(cameraId) {
    const videoTrack = await AgoraRTC.createCameraVideoTrack({ cameraId });
    return videoTrack;
  }

  async getNetworkStat() {
    /* 
      Cuation: npm agora-rtc-sdk-ng에서 Func getNetworkStats, getTransportStat을 지원해주지 않으므로 별도 처리
    */
    return navigator.onLine;
  }

  async getLocalMediaTracks(microphoneId, cameraId) {
    const [audioTrack, videoTrack] = await Promise.all([
      AgoraRTC.createMicrophoneAudioTrack({ microphoneId }),
      AgoraRTC.createCameraVideoTrack({ cameraId }),
    ]);
    return [audioTrack, videoTrack];
  }

  async onChangeMediaDevice(localAudioTrack, localVideoTrack) {
    if (!localAudioTrack || !localVideoTrack) {
      console.error("invalid local track!");
      return;
    }

    AgoraRTC.onMicrophoneChanged = async (changedDevice) => {
      if (changedDevice.state === "ACTIVE") {
        this.localAudioTrack.setDevice(changedDevice.device.deviceId);
      } else if (changedDevice.device.label === this.localAudioTrack.getTrackLabel()) {
        const oldMicrophones = await AgoraRTC.getMicrophones();
        oldMicrophones[0] && this.localAudioTrack.setDevice(oldMicrophones[0].deviceId);
      }
    };

    AgoraRTC.onCameraChanged = async (changedDevice) => {
      if (changedDevice.state === "ACTIVE") {
        this.localVideoTrack.setDevice(changedDevice.device.deviceId);
      } else if (changedDevice.device.label === this.localVideoTrack.getTrackLabel()) {
        const oldCameras = await AgoraRTC.getCameras();
        oldCameras[0] && this.localVideoTrack.setDevice(oldCameras[0].deviceId);
      }
    };
  }

  _handleUserState = (currentState, revState, reason) => {
    if (this.isSubscriberRtcRole) return;

    if (currentState === "CONNECTED") {
      this.webhook.send(WEBHOOK_TYPE.CONNECTED);
    }
  };

  _handleUserJoined = (user) => {
    if (user.uid === AGORA_UID.STUDENT) {
      if (this.userType === "tutor") {
        this.startRecording();
        this.webhook.send(WEBHOOK_TYPE.CONNECTED_ALL);
      }
    }
  };

  async startRecording() {
    const params = {
      type: "python",
      channel: this.agoraOptions.channel,
      uid: AGORA_UID.TUTOR,
      userToken: localStorage.getItem("wizToken"),
      recordToken: this.agoraOptions.token,
    };

    try {
      const result = await request.startRecording(params).then((res) => res.json());
      console.log("recording start: ", result);
    } catch (err) {
      console.error(err);
    }
  }

  _handleUserPublished = async (user, mediaType) => {
    await this.agoraClient.subscribe(user, mediaType);

    if (mediaType === "video") {
      if (this.isSubscriberRtcRole) {
        if (user.uid === AGORA_UID.TUTOR) {
          user.videoTrack.play(this.remoteVideoRef.current);
        } else if (user.uid === AGORA_UID.STUDENT) {
          user.videoTrack.play(this.localVideoRef.current);
        }
      } else {
        user.videoTrack.play(this.remoteVideoRef.current);
      }
    } else {
      user.audioTrack.play();
    }
  };

  _handleUserUnpublished = (user) => {
    if (this.isSubscriberRtcRole) return;

    if ([AGORA_UID.TUTOR, AGORA_UID.STUDENT].includes(user.uid)) {
      this.webhook.send(WEBHOOK_TYPE.DISCONNECTED);
    }
  };
}
