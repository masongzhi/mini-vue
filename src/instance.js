import { handleData, handleWatchers, sub } from "./observe";
import { set, getByIndex, getKeyByIndex } from "./utils";

export default class Vue {
  constructor(config) {
    this.$options = config;
    this.$data = handleData(config.data);
    handleWatchers(config.watch);
  }

  $set(object, key, value) {
    if (object === this) {
      set(this.$data, key, value);
      handleData(getByIndex(this.$data, key, -1), getKeyByIndex(key, -1));
    } else {
      set(object, key, value);
      handleData(getByIndex(object, key, -1), getKeyByIndex(key, -1));
    }
  }

  $watch(key, func) {
    set(this.$data, key);
    handleData(getByIndex(this.$data, key, -1), getKeyByIndex(key, -1));
    sub(key, func);
  }
}
