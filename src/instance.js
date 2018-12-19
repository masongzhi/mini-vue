import { handleData, handleWatchers, sub, handleTemplate } from "./observe";
import { get, set, getByIndex, getKeyByIndex } from "./utils";

export default class Vue {
  constructor(config) {
    this._event = []
    this.$options = config;
    // beforeCreate
    this.$options.beforeCreate.call(this)
    this.$data = handleData(this, this.$options.data());
    handleWatchers(this, this.$options.watch);
    // created
    this.$options.created.call(this)
    // beforeMount
    this.$options.beforeMount.call(this)
    handleTemplate(this, this.$options.template);
    // mounted
    this.$options.mounted.call(this)
  }

  $set(object, key, value) {
    object = object === this ? this.$data : object
    // 兼容新的key没办法首次pub
    if (get(object, key) === undefined) {
      set(object, key);
    }
    handleData(this, getByIndex(object, key, -1), getKeyByIndex(key, -1));
    set(object, key, value);
  }

  $watch(key, func) {
    sub(this, key, func);
  }

  // beforeUpdate
  _handleBeforeUpdate() {
    this.$options.beforeUpdate.call(this)
  }

  // updated
  _handleUpdated() {
    this.$options.updated.call(this)
  }
}
