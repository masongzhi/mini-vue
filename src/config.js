export default {
  template: `
    <div>
      <div>{{a}}</div>
      <div>{{b.a}}</div>
    </div>
  `,
  data() {
    return {
      a: 2,
      b: {
        a: 34,
        b: "dfdf"
      },
      c: [1, 3, 4],
      d: {
        a: {
          b: {
            c: 1
          }
        }
      }
    };
  },
  watch: {
    a: function(n, o) {
      console.log("new a===>>>>", n);
      console.log("old a===>>>>", o);
    }
  },
  beforeCreate() {
    console.log('beforeCreate===>>>>');
  },
  created() {
    console.log('created===>>>>');
  },
  beforeMount() {
    console.log('beforeMount===>>>>');
  },
  mounted() {
    console.log('mounted===>>>>');
  }
};
