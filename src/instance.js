import {
  handleData,
  handleComputed,
  handleWatchers,
  handleMethods,
  handleTemplate,
  responseData,
  sub
} from "./observe";
import { get, set, getByIndex, getKeyByIndex } from "./utils";

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
    object = object === this ? this.$data : object;
    // 兼容新的key没办法首次pub
    if (get(object, key) === undefined) {
      set(object, key);
    }
    responseData(this, getByIndex(object, key, -1), getKeyByIndex(key, -1));
    set(object, key, value);
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
