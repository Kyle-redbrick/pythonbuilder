const funcName = "global";

onmessage = function (e) {
  if (e === undefined || e.data === undefined) {
    return;
  }

  const sprites = e.data.sprites;
  const spriteIds = e.data.spriteIds;

  if (sprites === undefined || spriteIds === undefined) {
    return;
  }

  const globalValues = getGlobalValues(sprites, spriteIds);
  postMessage(globalValues);
};

function getGlobalValues(sprites, spriteIds) {
  let ret = [];

  for (let i = 0; i < spriteIds.length; i++) {
    const id = spriteIds[i];
    const sprite = sprites[id];
    const code = sprite.code;
    const spriteGlobalValues = getSpriteGlobalValues(code);
    ret = [...ret, ...spriteGlobalValues];
  }

  return ret;
}

function getSpriteGlobalValues(code) {
  const ret = [];
  const funcIdxs = [];

  let funcIdx = code.indexOf(funcName);
  while (funcIdx !== -1) {
    funcIdxs.push(funcIdx);
    funcIdx = code.indexOf(funcName, funcIdx + 1);
  }

  for (let i = 0; i < funcIdxs.length; i++) {
    const idx = funcIdxs[i];
    const globalValue = getGlobalValue(code, idx);

    if (globalValue !== null) {
      ret.push(globalValue);
    }
  }

  return ret;
}

function getGlobalValue(code, idx) {
  const startIdx = code.indexOf(".", idx);
  const endIdx = code.indexOf("=", startIdx + 1);

  if (startIdx === -1 || endIdx === -1) {
    return null;
  }

  const word = code.substring(startIdx + 1, endIdx).trim();
  if (isVariable(word)) {
    return word;
  }

  return null;
}

function isVariable(word) {
  for (let i = 0; i < word.length; i++) {
    const ch = word.charAt(i);
    if (isNumber(ch) || isLetter(ch) || isAllowedChar(ch)) {
      continue;
    } else {
      return false;
    }
  }

  return true;
}

function isNumber(ch) {
  return ch >= "0" && ch <= "9";
}

function isLetter(ch) {
  return (ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z");
}

function isAllowedChar(ch) {
  switch (ch) {
    case "_":
    case "$":
      return true;
    default:
      return false;
  }
}
