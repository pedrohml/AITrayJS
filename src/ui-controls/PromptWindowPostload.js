const vueApp = new Vue({
  el: '#app',
  data() {
    // const userData = PromptWindowBridge.readUserDataSync();
    const providers = PromptWindowBridge.getProviders();
    const preferences = PromptWindowBridge.getPreferences();
    const providersMap = Object.fromEntries(providers.map(p => [p.id, p]));
    const clipboardAutoMode = preferences.clipboardAutoMode || false;
    const isAlwaysOnTop = preferences.isAlwaysOnTop || false;

    // console.log([preferences]);

    if (clipboardAutoMode) {
      delete preferences.context;
      delete preferences.result;
    }

    PromptWindowBridge.setAlwaysOnTop(isAlwaysOnTop);

    if (!preferences.providerId) {
      delete preferences.providerId;
      delete preferences.modelId;
    }

    if (!preferences.modelId) {
      delete preferences.modelId;
    }

    return {...{
      providers: providersMap,
      providerId: 'openai',
      modelId: 'text-davinci-003',
      context: clipboardAutoMode ? PromptWindowBridge.readFromClipboard() : '',
      prompt: '',
      result: '',
      clipboardAutoMode: clipboardAutoMode,
      isAlwaysOnTop: isAlwaysOnTop
    }, ...preferences};
  },
  mounted() {
    const app = this;
    const watcher = new Watcher(
      500,
      () => {
        if (app.clipboardAutoMode)
          app.context = PromptWindowBridge.readFromClipboard();
      },
      () => false);
    watcher.start();

    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'Enter')
        app.submitForm();
      else if (event.key === 'Escape')
        PromptWindowBridge.closePromptWindow();
    });

    if (PromptWindowBridge.shouldExecuteOnStartup())
      this.submitForm();
  },
  updated() {
    PromptWindowBridge.setAlwaysOnTop(!!this.isAlwaysOnTop);
    const prefs = JSON.parse(JSON.stringify(this.$data));
    PromptWindowBridge.setPreferences(prefs);
  },
  methods: {
    async submitForm() {
      this.$refs.loadingOverlay.removeAttribute("hidden");
      this.result = await PromptWindowBridge.submitForm(JSON.parse(JSON.stringify(this.$data)));
      this.$refs.loadingOverlay.setAttribute("hidden", true);
    },
    clearForm() {
      this.context = this.clipboardAutoMode ? this.context : '';
      this.prompt = '';
      this.result = '';
    },
    closeWindow() {
      PromptWindowBridge.closePromptWindow();
    },
    clipboardChanged() {
      if (this.clipboardAutoMode)
        this.context = PromptWindowBridge.readFromClipboard();
      else
        this.context = '';
    }
  }
});