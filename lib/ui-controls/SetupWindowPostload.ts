// @ts-nocheck

const vueApp = new Vue({
  el: '#app',
  data() {
    return {
      kiranAccessKey: '',
      openaiAccessKey: '',
      macros: [],
    };
  },
  async mounted() {
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape')
        SetupWindowBridge.closeSetupWindow();
    });

    const userData = await this.getUserData();
    this.fillFromUserData(userData);
  },
  async updated() {
    this.writeToUserData();
  },
  methods: {
    openMacro(idx) {
      SetupWindowBridge.openMacro(idx);
    },
    async getUserData() {
      return await SetupWindowBridge.readUserData() || {};
    },
    fillFromUserData(userData) {
      this.openaiAccessKey = userData.openaiAccessKey;
      this.kiranAccessKey = userData.kiranAccessKey;
      this.macros = userData.macros;
    },
    async writeToUserData(data) {
      const userData = await this.getUserData() || {};
      userData.openaiAccessKey = this.openaiAccessKey;
      userData.kiranAccessKey = this.kiranAccessKey;
      userData.macros = this.macros;
      await SetupWindowBridge.writeUserData(userData);
    }
  }
});
