import { handleData, handleWatchers, sub } from "./observe";
import set from 'lodash/set'

function get(object, key) {
  let newObject = object
  if (/\./.test(key)) {
    key.split('.').forEach(it => {
      newObject = newObject[it]
    })
  }
  return newObject
}

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
