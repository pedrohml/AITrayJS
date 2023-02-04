const vueApp = new Vue({
  el: '#app',
  data() {
    const providers = PromptWindowBridge.getProviders();
    const preferences = PromptWindowBridge.getPreferences();
    const providersMap = Object.fromEntries(providers.map(p => [p.id, p]));
    const clipboardAutoMode = preferences.clipboardAutoMode || false;
    const isAlwaysOnTop = preferences.isAlwaysOnTop || false;
    
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
      250,
      () => {
        if (app.clipboardAutoMode) {
          app.context = PromptWindowBridge.readFromClipboard();
          if (PromptWindowBridge.isWindowVisible() && app.context !== this.previousClipboard) {
            PromptWindowBridge.focusWindow();
          }
          this.previousClipboard = this.context;
        }
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
      const currentPrefs = JSON.parse(JSON.stringify(this.$data));
      if (!this.comparePrefs(this.previousPrefs, currentPrefs)) {
        PromptWindowBridge.setAlwaysOnTop(!!this.isAlwaysOnTop);
        PromptWindowBridge.setPreferences(currentPrefs);
        this.previousPrefs = currentPrefs;
      }
    },
    methods: {
      async submitForm() {
        if (this.prompt) {
          this.$refs.loadingOverlay.removeAttribute("hidden");
          this.result = await PromptWindowBridge.submitForm(JSON.parse(JSON.stringify(this.$data)));
          this.$refs.loadingOverlay.setAttribute("hidden", true);
        }
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
      },
      contextChanged() {
      },
      comparePrefs(prevPrefs, newPrefs) {
        if (this.clipboardAutoMode) {
          prevPrefs = {...prevPrefs, ...{ context: null }};
          newPrefs = {...newPrefs, ...{ context: null }};
        }
        
        prevPrefs = JSON.stringify(prevPrefs);
        newPrefs = JSON.stringify(newPrefs);
        
        return prevPrefs === newPrefs;
      }
    }
  });
