import { app, BrowserWindow, ipcMain } from "electron";
import { CustomScheme } from "./CustomScheme";
import path from "path";
import { stat, rename, readdir, opendir } from "node:fs/promises";
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
let mainWindow: BrowserWindow;

app.whenReady().then(() => {
    let config = {
        webPreferences: {
            nodeIntegration: true,
            // webSecurity: false,
            // allowRunningInsecureContent: true,
            // contextIsolation: true,
            // webviewTag: true,
            // spellcheck: false,
            // disableHtmlFullscreenWindowResize: true,
            preload: path.join(__dirname, "preload.js"),
        },
    };
    mainWindow = new BrowserWindow(config);
    mainWindow.webContents.openDevTools({ mode: "undocked" });
    if (process.argv[2]) {
        mainWindow.loadURL(process.argv[2]);
    } else {
        CustomScheme.registerScheme();
        mainWindow.loadURL(`app://index.html`);
    }
});

async function renameAll(files: string[], separator: string, cb: Function) {
    files.forEach(async (item) => {
        const stats = await stat(item);
        console.log(path.parse(item));
        if (stats.isDirectory()) {
            const newName = (await renameFolder(item, separator)) as string;
            const files = await readdir(newName);
            const childFiles = files.map((item) => path.join(newName, item));
            await renameAll(childFiles, separator, cb);
        } else {
            const newName = await renameFile(item, separator);
            cb(item, newName);
        }
    });
}

async function renameFolder(
    folderName: string,
    separator: string
): Promise<string> {
    try {
        const { dir, name } = path.parse(folderName);
        const newFolderName = name.split("").join(separator);
        const newName = path.join(dir, newFolderName);
        await rename(folderName, newName);
        return newName;
    } catch (err) {
        console.log(err);
        return "error";
    }
}

async function renameFile(
    fileName: string,
    separator: string
): Promise<string> {
    try {
        const { dir, name, ext } = path.parse(fileName);
        const newFileName = name.split("").join(separator);
        const newName = path.join(dir, newFileName + ext);
        await rename(fileName, newName);
        return newFileName;
    } catch (err) {
        console.log(err);
        return "error";
    }
}

ipcMain.on("rename", async (event, files: string[], separator: string) => {
    await renameAll(
        files,
        separator,
        function (oldName: string, newName: string) {
            event.sender.send("onRename", oldName, newName);
        }
    );
});
