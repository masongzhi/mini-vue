import config from "./config";
import Vue from "./instance";

const vm = new Vue(config)

vm.$data.a = 3

vm.$watch('b.a', function (n, o) {
  console.log('b.a===>>>>', n);
})
// vm.$data.b.a = 5
vm.$set(vm, 'b.a', 5)
