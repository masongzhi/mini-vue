import config from "./config";
import Vue from "./instance";

const vm = new Vue(config);

vm.$data.a = 3;

vm.$watch("b.a", function(n, o) {
  console.log("b.a===>>>>", n);
});

vm.$set(vm, "b.a", 5);
vm.$watch("e.a", function(n, o) {
  console.log("e.a===>>>>", n);
});
vm.$set(vm, "e.a", 6);

const value = vm.getValue();
console.log("value===>>>>", value);

console.log("computed combineValueAndA===>>>>", vm.$computed.combineValueAndA);
console.log("computed fullName==before=>>>>", vm.$computed.fullName);
vm.$computed.fullName = "Bar Foo";
console.log("computed fullName==after=>>>>", vm.$computed.fullName);
