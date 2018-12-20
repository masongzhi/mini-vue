export function set(object, key, value) {
  let nested = object;
  if (/\./.test(key)) {
    const pathArr = key.split(".");
    const length = pathArr.length;

    pathArr.forEach((p, index) => {
      if (!nested[p] && index < length - 1) {
        nested[p] = parseInt(p) === p ? [] : {};
      }
      if (index === length - 2) {
        nested[p][pathArr[index + 1]] = value;
        return;
      }
      nested = nested[p];
    });
  } else {
    nested[key] = value;
  }
}

export function get(object, key) {
  let nested = object;

  if (/\./.test(key)) {
    const pathArr = key.split(".");

    pathArr.forEach(p => {
      // 如果没有找到，就终止
      if (!nested[p]) return;
      nested = nested[p];
    });
  } else {
    nested = nested[key];
  }
  return nested;
}

export function getByIndex(object, key, i) {
  if (!i && i !== 0) {
    throw new Error("getByIndex需要传入i");
  }
  const pathArr = key.split(".");
  const length = pathArr.length;
  if (i >= length) {
    return;
  }
  if (i < -length) {
    return;
  }
  let nested = object;

  if (/\./.test(key)) {
    pathArr.forEach((p, index) => {
      // 如果没有找到，就终止
      if (!nested[p]) return;
      if ((i < 0 && index - length === i) || (i > 0 && index === i)) {
        return nested[p];
      }
      nested = nested[p];
    });
  } else {
    nested = nested[key];
  }
  return nested;
}

export function getKeyByIndex(key, i) {
  if (!i && i !== 0) return key;
  const pathArr = key.split(".");
  const length = pathArr.length;

  const getLen = i > 0 ? i + 1 : length + i;
  return pathArr.slice(0, getLen).join(".");
}

/**
 * 对象代理
 * @param target 原对象
 * @param proxyTarget 需要代理的对象
 */
export function proxy(target, proxyTarget) {}
