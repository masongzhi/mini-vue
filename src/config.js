export default {
  data: {
    a: 2,
    b: {
      a: 34,
      b: "dfdf"
    },
    c: [1, 3, 4]
  },
  watch: {
    a: function (n, o) {
      console.log('new a===>>>>', n);
      console.log('old a===>>>>', o);
    }
  }
};