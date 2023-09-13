const funcName = "sendSignal";

onmessage = function (e) {
  if (e === undefined || e.data === undefined) {
    return;
  }

  const sprites = e.data.sprites;
  const spriteIds = e.data.spriteIds;

  if (sprites === undefined || spriteIds === undefined) {
    return;
  }

  const signalNames = getSignalNames(sprites, spriteIds);
  postMessage(signalNames);
};

function getSignalNames(sprites, spriteIds) {
  let ret = [];

  for (let i = 0; i < spriteIds.length; i++) {
    const id = spriteIds[i];
    const sprite = sprites[id];
    const code = sprite.code;

    const spriteSignalNames = getSpriteSignalNames(code);
    ret = [...ret, ...spriteSignalNames];
  }

  return ret;
}

function getSpriteSignalNames(code) {
  const ret = [];
  const funcIdxs = [];

  let funcIdx = code.indexOf(funcName);
  while (funcIdx !== -1) {
    funcIdxs.push(funcIdx);
    funcIdx = code.indexOf(funcName, funcIdx + 1);
  }

  for (let i = 0; i < funcIdxs.length; i++) {
    const idx = funcIdxs[i];
    const signalName = getSignalName(code, idx);

    if (signalName !== null) {
      ret.push(signalName);
    }
  }

  return ret;
}

function getSignalName(code, idx) {
  const startIdx = code.indexOf("(", idx);
  const endIdx = code.indexOf(")", startIdx + 1);
  if (startIdx === -1 || endIdx === -1) {
    return null;
  }

  const word = code.substring(startIdx + 1, endIdx).trim();
  if (word.length < 3) {
    return null;
  }

  const firstChar = word[0];
  const lastChar = word[word.length - 1];
  if (firstChar !== '"' || lastChar !== '"') {
    return null;
  }

  return word.substring(1, word.length - 1);
}
