import React, { Component, createRef } from "react";
import { injectIntl } from "react-intl";
import { AGORA_UID } from "../../../Util/Constant.js";
import { AgoraClient } from "../../../Util/AgoraClient";
import { RtcRole } from "agora-access-token";
import MicImg from "../../../../Image/mic.svg";
import NetworkImg from "../../../../Image/network.svg";
import VideoImg from "../../../../Image/video.svg";
import "./index.scss";

class EnvTestPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: { device: "", isReady: false },
      audio: { device: "", isReady: false },
      network: { isReady: false },
    };
    this.localVideoRef = createRef();
    this.localAudioTrack = null;
    this.localVideoTrack = null;
  }

  async componentDidMount() {
    await this.connectAgora();
  }

  async connectAgora() {
    // Initialize Agora Web RTC Conenction
    this.createAgoraClient();
    const isNetworkConnected = await this.agoraClient.getNetworkStat();
    this.setState({ network: { isReady: isNetworkConnected } });

    this.agoraClient.setLocalVideo(this.localVideoRef);
    await this.setCamera(this.agoraClient);
    await this.setAudio(this.agoraClient);
  }

  createAgoraClient() {
    this.agoraClient = new AgoraClient({
      appid: "60dcb9c3c74b44b6b0b85aad121d4b3b",
      appCertificate: "fa4e9a552b6c47e3a434f136539cd7d4",
      channel: `${new Date().getTime()}`,
      uid: AGORA_UID.STUDENT,
      role: RtcRole.PUBLISHER,
    });
  }

  async setCamera(AgoraClient) {
    const videos = await this.agoraClient.getLocalVideoDevices();
    if (!videos.length) return;

    let videoId;
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      if (video.deviceId !== "default") {
        videoId = video.id;
        break;
      }
    }

    const localVideoTrack = await AgoraClient.getLocalVideoTrack(videoId);
    this.connectVideo(localVideoTrack);
    if (this.localVideoTrack) this.localVideoTrack.play(this.localVideoRef.current);
  }

  async setAudio(AgoraClient) {
    const audios = await this.agoraClient.getLocalAudioDevices();
    if (!audios.length) return;

    let audioId;
    for (let i = 0; i < audios.length; i++) {
      const audio = audios[i];
      if (audio.deviceId !== "default") {
        audioId = audio.id;
        break;
      }
    }

    const localAudioTrack = await AgoraClient.getLocalAudioTrack(audioId);
    this.connectAudio(localAudioTrack);
  }

  connectVideo(videoTrack) {
    this.localVideoTrack = videoTrack;
    this.setState({
      video: {
        device: videoTrack._deviceName,
        isReady: videoTrack._enabled,
      },
    });
  }

  connectAudio(audioTrack) {
    this.localAudioTrack = audioTrack;
    this.setState({
      audio: {
        device: audioTrack._deviceName,
        isReady: audioTrack._enabled,
      },
    });
  }

  browserPermissionErrorHandler() {
    this.setState({
      video: {
        device: "not allowed",
        isReady: false,
      },
      audio: {
        device: "not allowed",
        isReady: false,
      },
    });
  }

  onClickConfirm = () => {
    const { video, audio, network } = this.state;
    const { handleEnvTestStatus } = this.props;
    localStorage.setItem("envTestStatus", JSON.stringify({ video, audio, network }));
    if (handleEnvTestStatus) {
      handleEnvTestStatus(network.isReady, audio.isReady, video.isReady);
    }
    this.disConnectAgora();
    this.props.dismiss();
  };

  async disConnectAgora() {
    this.agoraClient.disConnectTrack(this.localVideoTrack);
    this.agoraClient.disConnectTrack(this.localAudioTrack);
  }

  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    const { video, audio, network } = this.state;

    const STATUS_TYPE = {
      true: "정상",
      false: "연결 실패",
    };

    return (
      <div className="env-test">
        <h3 className="env-test__title">{formatMessage({ id: "ID_MYCLASS_HOME_EV_TEST" })}</h3>

        <div className="env-test__states">
          {[
            {
              icon: NetworkImg,
              text: "네트워크",
              status: network.isReady,
            },
            {
              icon: MicImg,
              text: "마이크",
              status: audio.isReady,
            },
            {
              icon: VideoImg,
              text: "비디오",
              status: video.isReady,
            },
          ].map(({ icon, text, status }) => (
            <div className="env-test__state" key={text}>
              <img src={icon} alt={text} />
              <div>
                <p>{text}</p>
                <p className={status ? "active" : "inactive"}>{STATUS_TYPE[status]}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="env-test__video" id="localVideo" ref={this.localVideoRef}>
          {!video.isReady && "비디오 없음"}
        </div>
        <button type="button" onClick={this.onClickConfirm}>
          확인
        </button>
      </div>
    );
  }
}

export default injectIntl(EnvTestPopUp);
