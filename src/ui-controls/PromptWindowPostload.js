const vueApp = new Vue({
  el: '#app',
  data() {
    const preferences = this.getPreferences();
    
    PromptWindowBridge.setAlwaysOnTop(preferences.isAlwaysOnTop);

    return {...{
      providers: undefined, // async populated
      providerId: 'openai',
      modelId: 'text-davinci-003',
      context: preferences.clipboardAutoMode ? this.readFromClipboard() : '',
      prompt: '',
      result: '',
      clipboardAutoMode: preferences.clipboardAutoMode,
      isAlwaysOnTop: preferences.isAlwaysOnTop,
      isSaveEnabled: PromptWindowBridge.isSaveEnabled(),
    }, ...preferences};
  },
  async mounted() {
    const app = this;
    const providers = await PromptWindowBridge.getProviders();
    const providersMap = Object.fromEntries(providers.map(p => [p.id, p]));

    this.providers = providersMap;

    this.clipboardWatcher = this.clipboardWatcher || new Watcher(
      250,
      () => {
        if (app.clipboardAutoMode) {
          app.context = this.readFromClipboard();
          if (PromptWindowBridge.isWindowVisible() && app.context !== this.previousClipboard) {
            PromptWindowBridge.focusWindow();
            this.$refs.prompt.focus();
          }
          this.previousClipboard = this.context;
        }
      },
      () => false);
      this.clipboardWatcher.start();
      
      document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'Enter')
          app.submitForm();
        else if (event.key === 'Escape')
          this.closeWindow();
      });

      if (PromptWindowBridge.shouldExecuteOnStartup())
        this.submitForm();
    },
    async updated() {
      PromptWindowBridge.setAlwaysOnTop(!!this.isAlwaysOnTop);
      await this.setPreferences();
    },
    methods: {
      async submitForm() {
        if (this.prompt) {
          this.$refs.loadingOverlay.removeAttribute("hidden");
          this.$refs.form.setAttribute("disabled", true);
          try {
            const currentData = JSON.parse(JSON.stringify(this.$data));
            this.result = await PromptWindowBridge.submitForm(currentData);
            currentData.result = this.result;
            await this.savePreferences(currentData);
          } catch (err) {
            this.result = err.message;
          }
          this.$refs.form.setAttribute("disabled", false);
          this.$refs.loadingOverlay.setAttribute("hidden", true);
        }
      },
      async savePreferences(data) {
        await PromptWindowBridge.setPreferences(data);
        await PromptWindowBridge.savePreferences(data);
      },
      async setPreferences(data) {
        await PromptWindowBridge.setPreferences(data || JSON.parse(JSON.stringify(this.$data)));
      },
      readFromClipboard() {
        return (PromptWindowBridge.readFromClipboard() || '').trim();
      },
      getPreferences() {
        const preferences = PromptWindowBridge.getPreferences();
        const clipboardAutoMode = preferences.clipboardAutoMode || false;

        if (clipboardAutoMode) {
          delete preferences.context;
          delete preferences.result;
        }

        if (!preferences.providerId) {
          delete preferences.providerId;
          delete preferences.modelId;
        } else if (!preferences.modelId) {
          delete preferences.modelId;
        }

        return preferences;
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
          this.context = this.readFromClipboard();
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
