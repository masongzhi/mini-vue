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

/**
 * @example ({a: {b: 1}}, 1) => {b: 1}
 * @param object
 * @param key
 * @param i
 * @returns {*}
 */
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
      if (!nested[p]) return undefined;
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

/**
 * @example ('a.b', 1) => 'a'
 * @param key
 * @param i
 * @returns {string}
 */
export function getKeyByIndex(key, i) {
  if (!isNumber) {
    throw new Error("param i need a number");
  }
  const pathArr = key.split(".");
  const length = pathArr.length;

  const getLen = i >= 0 ? i : length + i;
  return pathArr.slice(0, getLen).join(".");
}

/**
 * 对象代理
 * @param target 原对象
 * @param proxyTarget 需要代理的对象
 * @param key [可选]需要代理的键值
 */
export function proxy(proxyTarget, target, key) {
  if (!isNil(key)) {
    defineProperty(target, key)
  } else {
    Object.keys(proxyTarget).forEach(key => {
      defineProperty(target, key)
    });
  }

  function defineProperty(target, key) {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      get() {
        return proxyTarget[key];
      },
      set(val) {
        proxyTarget[key] = val;
      }
    });
  }
}

export function isUndefined(val) {
  return val !== undefined;
}

export function isNil(val) {
  return val === null || val === undefined;
}

export function isNumber(val) {
  return typeof val === "number";
}
