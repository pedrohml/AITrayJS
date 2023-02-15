// @ts-nocheck

import { app, ipcMain, clipboard, globalShortcut, Menu, Tray } from 'electron';
import { UserData, PromptWindowPrefs } from './UserData';
import { ProviderFactory } from './providers/ProviderFactory';
import { SplashWindow } from './ui-controls/SplashWindow';
import { PromptWindow } from './ui-controls/PromptWindow';
import { SetupWindow } from './ui-controls/SetupWindow';
import path from 'path';

const appState = { macros: [] };

async function openSetupWindow() {
    const userData = await UserData.load();
    const setupWindow = new SetupWindow(userData);
    setupWindow.show();
    return setupWindow;
}

const createMainPromptWindow = async (userData) => {
    // Create the browser window.
    const promptWindow = new PromptWindow(
        new ProviderFactory(),
        { ...userData.mainPromptWindowPrefs, ...{ hideOnClose: true } },
        { show: false });

    promptWindow.on('close', async (event) => {
        promptWindow.setPreferences(promptWindow.prefs);
    });

    promptWindow.onSavePreferences = async (prefs) => {
        const userData = await UserData.load();
        userData.mainPromptWindowPrefs = prefs;
        await userData.save();
    };

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    return promptWindow;
}

async function showSplashWindow() {
    const splashWindow = new SplashWindow();

    return SplashWindow;
}

const executeMacro = async (macroIdx) => {
    const userData = await UserData.load();

    appState.macros[macroIdx] && 
        !appState.macros[macroIdx].isDestroyed() && 
        appState.macros[macroIdx].close();

    const promptWindow = new PromptWindow(
        new ProviderFactory(),
        { ...userData.macros[macroIdx], ...userData.mainPromptWindowPrefs.getBounds() },
        { show: true, title: `AI Prompt (Macro ${macroIdx+1})` },
        true);

    promptWindow.onSavePreferences = async (prefs) => {
        const userData = await UserData.load();
        userData.mainPromptWindowPrefs = new PromptWindowPrefs({ ...userData.mainPromptWindowPrefs, ...prefs.getBounds() });
        userData.macros[macroIdx] = prefs;
        await userData.save();
    };

    appState.macros[macroIdx] = promptWindow;

    return promptWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.whenReady().then(async () => {
    showSplashWindow();

    const userData = await UserData.load();
    const promptWindow = await createMainPromptWindow(userData);
    const tray = new Tray(path.join(__dirname, process.platform === 'win32' ? '../public/images/logo.ico' : '../public/images/logo.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Prompt', accelerator: 'CTRL+ALT+P', registerAccelerator: false, click: () => { promptWindow.show(); } },
        { type: 'separator' },
        { label: 'Macro 1', accelerator: 'CTRL+ALT+8', registerAccelerator: false, click: () => executeMacro(0) },
        { label: 'Macro 2', accelerator: 'CTRL+ALT+9', registerAccelerator: false, click: () => executeMacro(1) },
        { label: 'Macro 3', accelerator: 'CTRL+ALT+0', registerAccelerator: false, click: () => executeMacro(2) },
        { type: 'separator' },
        { label: 'Setup...', click: () => { openSetupWindow() } },
        { label: 'Quit', click: () => { app.exit(); } }
    ]);
    
    tray.setToolTip('AI Tray');
    tray.setContextMenu(contextMenu);

    globalShortcut.register('CTRL+ALT+8', () => executeMacro(0));
    globalShortcut.register('CTRL+ALT+9', () => executeMacro(1));
    globalShortcut.register('CTRL+ALT+0', () => executeMacro(2));
    globalShortcut.register("CTRL+ALT+P", () => promptWindow.show());

    ipcMain.on('clipboard:read-text', (event) => {
        event.returnValue = clipboard.readText();
    });

    ipcMain.handle('userdata:read', async (evt) => {
        return JSON.stringify(await UserData.load());
    });

    ipcMain.handle('userdata:write', async (evt, userData) => {
        userData = JSON.parse(userData);
        delete userData.providers;
        await UserData.fromObject(userData).save();
    });

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        // if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    app.on('before-quit', async (evt) => {});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});
