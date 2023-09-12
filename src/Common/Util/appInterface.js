export const sendMessageToApp = (event, payload) => {
  const data = {
    event,
    payload,
  };

  //android
  if (window.app) {
    window.app.onWebViewEvent(data);
  }

  //ios
  if (window.webkit) {
    window.webkit.messageHandlers.onWebViewEvent.postMessage(data);
  }
};
