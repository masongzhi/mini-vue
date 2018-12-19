// 订阅
export const sub = function(vm, key, handler) {
  vm._event.push({
    handler: handler,
    key: key
  });
};

// 发布
const pub = function(vm, key, n, o) {
  vm._event.forEach(event => {
    if (event.key === key) {
      event.handler.call(vm, n, o);
    }
  });
};

export function handleData(vm, data, keyStr) {
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
        pub(vm, _keyStr, newVal, oldVal);
      }
    });

    if (typeof data[key] === "object" || typeof data[key] === "function") {
      handleData(vm, data[key], _keyStr);
    }
  });
  return data;
}

export function handleWatchers(vm, watchers) {
  Object.keys(watchers).forEach(key => {
    sub(vm, key, watchers[key]);
  });
}
