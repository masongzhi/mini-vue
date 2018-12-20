export default {
  template: `
    <div>
      <div>{{a}}</div>
      <div>{{b.a}}</div>
    </div>
  `,
  data() {
    return {
      value: "i`m value",
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
      },
      firstName: "Foo",
      lastName: "Bar"
    };
  },
  computed: {
    combineValueAndA() {
      return this.value + this.a;
    },
    fullName: {
      get() {
        return this.firstName + " " + this.lastName;
      },
      set(val) {
        const names = val.split(" ");
        this.firstName = names[0];
        this.lastName = names[names.length - 1];
      }
    }
  },
  watch: {
    a: function(n, o) {
      console.log("new a===>>>>", n);
      console.log("old a===>>>>", o);
    }
  },
  methods: {
    getValue() {
      return this.value;
    }
  },
  beforeCreate() {
    console.log("beforeCreate===>>>>");
  },
  created() {
    console.log("created===>>>>");
  },
  beforeMount() {
    console.log("beforeMount===>>>>");
  },
  mounted() {
    console.log("mounted===>>>>");
  },
  beforeUpdate() {
    console.log("beforeUpdated===>>>>");
  },
  updated() {
    console.log("updated===>>>>");
  }
};
