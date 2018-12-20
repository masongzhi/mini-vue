import { get, proxy } from "./utils";
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
  vm.$data = responseData(vm, data, keyStr);
  proxy(vm.$data, vm)
}

export function responseData(vm, data, keyStr) {
  Object.keys(data).forEach(key => {
    const _keyStr = keyStr ? keyStr + "." + key : key;
    let val = data[key];
    Object.defineProperty(data, key, {
      enumerable: true,
      get() {
        return val;
      },
      set(newVal) {
        if (newVal === val) return;
        vm._handleBeforeUpdate();
        const oldVal = val;
        val = newVal;
        pub(vm, _keyStr, newVal, oldVal);
        vm._handleUpdated();
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
  };
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
    if (key in vm) {
      throw new Error("has already declared" + key + " in vm");
    }
    vm[key] = methods[key].bind(vm);
  });
}

export function handleComputed(vm, computeds) {
  vm.$computed = {};
  Object.keys(computeds).forEach(key => {
    if (key in vm) {
      throw new Error("has already declared" + key + " in vm");
    }
    // 处理为统一格式
    const computedType = typeof computeds[key];
    let computed = computeds[key];

    if (computedType === "function") {
      computed = {
        get: computed.bind(vm)
      };
    } else if (computedType === "object") {
      computed = {
        get: computed.get.bind(vm),
        set: computed.set.bind(vm)
      };
    } else {
      throw new Error(
        "type of computed was wrong, should be a function or a object"
      );
    }
    Object.defineProperty(vm.$computed, key, {
      enumerable: true,
      get() {
        return computed.get();
      },
      set(newVal) {
        if (newVal === computed.get()) return;
        computed.set(newVal);
      }
    });
  });
  proxy(vm.$computed, vm)
}
