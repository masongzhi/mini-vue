import {
  handleData,
  handleComputed,
  handleWatchers,
  handleMethods,
  handleTemplate,
  responseData,
  sub
} from "./observe";
import {
  get,
  set,
  getByIndex,
  getKeyByIndex,
  proxy,
  isUndefined
} from "./utils";

export default class Vue {
  constructor(config) {
    this._event = [];
    this.$options = config;
    // beforeCreate
    this.$options.beforeCreate && this.$options.beforeCreate.call(this);
    handleData(this, this.$options.data());
    handleComputed(this, this.$options.computed);
    handleWatchers(this, this.$options.watch);
    handleMethods(this, this.$options.methods);
    // created
    this.$options.created && this.$options.created.call(this);
    // beforeMount
    this.$options.beforeMount && this.$options.beforeMount.call(this);
    handleTemplate(this, this.$options.template);
    // mounted
    this.$options.mounted && this.$options.mounted.call(this);
  }

  $set(object, key, value) {
    const isVm = object === this;
    // 需要在赋值前记录是否存在
    const isNewKey = isVm && isUndefined(get(this, key));
    object = isVm ? this.$data : object;

    if (isVm
      && getKeyByIndex(key, 1) in object
      && typeof object[getKeyByIndex(key, 1)] === 'function'
    ) {
      throw new Error("has already declared" + key + " in vm.methods");
    }

    // 兼容新的key没办法首次pub
    if (isUndefined(get(object, key))) {
      set(object, key);
    }
    responseData(this, getByIndex(object, key, -1), getKeyByIndex(key, -1));
    set(object, key, value);
    // 当新的key加进来$data时，需要创建新的proxy
    if (isNewKey) {
      proxy(object, this, getKeyByIndex(key, 1));
    }
  }

  $watch(key, func) {
    sub(this, key, func);
  }

  // beforeUpdate
  _handleBeforeUpdate() {
    this.$options.beforeUpdate && this.$options.beforeUpdate.call(this);
  }

  // updated
  _handleUpdated() {
    this.$options.updated && this.$options.updated.call(this);
  }
}
