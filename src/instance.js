import { handleData, handleWatchers, sub } from "./observe";
import { set, getByIndex, getKeyByIndex } from "./utils";

export default class Vue {
  constructor(config) {
    this._event = []
    this.$options = config;
    this.$data = handleData(this, this.$options.data());
    handleWatchers(this, this.$options.watch);
  }

  $set(object, key, value) {
    if (object === this) {
      set(this.$data, key, value);
      handleData(this, getByIndex(this.$data, key, -1), getKeyByIndex(key, -1));
    } else {
      set(object, key, value);
      handleData(this, getByIndex(object, key, -1), getKeyByIndex(key, -1));
    }
  }

  $watch(key, func) {
    set(this.$data, key);
    handleData(this, getByIndex(this.$data, key, -1), getKeyByIndex(key, -1));
    sub(this, key, func);
  }
}
