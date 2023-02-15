// @ts-nocheck

const vueApp = new Vue({
  el: '#app',
  data() {
    return {
      openaiAccessKey: '',
      macros: [],
    };
  },
  async mounted() {
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape')
        SetupWindowBridge.closeSetupWindow();
    });

    const userData = await SetupWindowBridge.readUserData();
    this.openaiAccessKey = userData.openaiAccessKey;
    this.macros = userData.macros;
  },
  async updated() {
    const userData = await SetupWindowBridge.readUserData();
    userData.openaiAccessKey = this.openaiAccessKey;
    userData.macros = this.macros;
    await SetupWindowBridge.writeUserData(userData);
  },
  methods: {
    openMacro(idx) {
      SetupWindowBridge.openMacro(idx);
    }
  }
});
