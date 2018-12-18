import { handleData, handleWatchers, sub } from "./observe";
import set from 'lodash/set'

export default class Vue {
  constructor(config) {
    this.$options = config;
    this.$data = handleData(config.data);
    handleWatchers(config.watch);
  }

  $set(object, key, value) {
    if (object === this) {
      set(this.$data, key, handleData(value))
    } else {
      set(object, key, handleData(value))
    }
  }

  $watch(key, func) {
    sub(key, func);
  }
}
