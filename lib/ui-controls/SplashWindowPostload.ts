// @ts-nocheck

const vueApp = new Vue({
  el: '#app',
  data() {
    return {
      loaded: []
    };
  },
  async mounted() {
    await this.load('user', 400);
    await this.load('ui', 500);
    await this.load('ai', 800);
    await this.load('full', 400);
    setTimeout(() => {
      SplashWindowBridge.closeSplashWindow();
    }, 200);
  },
  async updated() {},
  methods: {
    maskAsLoaded(label) {
      this.$data.loaded.push(label);
    },
    isLoaded(label) {
      return this.$data.loaded.indexOf(label) > -1;
    },
    load(label, timeout) {
      timeout ||= 250;
      return new Promise((res, rej) => {
        setTimeout(() => {
          this.maskAsLoaded(label);
          res(true);
        }, timeout);
      })
    }
  }
});
