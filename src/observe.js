const events = [];

// 订阅
export const sub = function(key, handler) {
  events.push({
    handler: handler,
    key: key
  });
};

// 发布
const pub = function(key, n, o) {
  events.forEach(event => {
    if (event.key === key) {
      event.handler(n, o);
    }
  });
};

export function handleData(data, keyStr) {
  Object.keys(data).forEach(key => {
    const _keyStr = keyStr ? (keyStr + '.' + key) : key
    let val = data[key];
    Object.defineProperty(data, key, {
      get() {
        return val;
      },
      set(newVal) {
        if (newVal === val) return;
        const oldVal = val;
        val = newVal;
        pub(_keyStr, newVal, oldVal);
      }
    });

    if (typeof data[key] === "object" || typeof data[key] === "function") {
      handleData(data[key], _keyStr);
    }
  });
  return data;
}

export function handleWatchers(watchers) {
  Object.keys(watchers).forEach(key => {
    sub(key, watchers[key]);
  });
}
