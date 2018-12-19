import { get } from "./utils";
import render from "./render";
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
  vm.$data = responseData(vm, data, keyStr)
  Object.keys(data).forEach(key => {
    vm[key] = data[key]
  })
}

export function responseData(vm, data, keyStr) {
  Object.keys(data).forEach(key => {
    const _keyStr = keyStr ? keyStr + "." + key : key;
    let val = data[key];
    Object.defineProperty(data, key, {
      get() {
        return val;
      },
      set(newVal) {
        if (newVal === val) return;
        vm._handleBeforeUpdate()
        const oldVal = val;
        val = newVal;
        pub(vm, _keyStr, newVal, oldVal);
        vm._handleUpdated()
      }
    });

    if (typeof data[key] === "object" || typeof data[key] === "function") {
      responseData(vm, data[key], _keyStr);
    }
  });
  return data;
}

export function handleWatchers(vm, watchers) {
  Object.keys(watchers).forEach(key => {
    sub(vm, key, watchers[key]);
  });
}

function transTemplate(vm, template) {
  const reg = /{{(.*?)}}/g;
  const keys = [];
  const newTemplate = template.replace(reg, (match, key) => {
    keys.push(key);
    return get(vm.$data, key);
  });
  return {
    newTemplate,
    keys
  }
}
export function handleTemplate(vm, template) {
  const result = transTemplate(vm, template);

  // 监听key变化时重新render
  result.keys.forEach(key => {
    sub(vm, key, () => {
      render(null, transTemplate(vm, template).newTemplate);
    });
  });

  render(null, result.newTemplate);
}

export function handleMethods(vm, methods) {
  Object.keys(methods).forEach(key => {
    if (vm.$data[key]) {
      throw new Error('has already declared' + key + ' in vm.$data')
    }
    vm[key] = methods[key].bind(vm)
  })
}
