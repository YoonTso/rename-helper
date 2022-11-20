import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    rename: (files: string[], separator: string) => {
        ipcRenderer.send("rename", files, separator);
    },
    onRename: () => {
        ipcRenderer.on("onRename", (event, oldName, newName) => {
            console.log("oldName:", oldName);
            console.log("newName:", newName);
        });
    },
    restore: (files: string[], separator: string) => {
        ipcRenderer.send("restore", files, separator);
    },
    onRestore: () => {
        ipcRenderer.on("onRestore", (event, oldName, newName) => {
            console.log("oldName:", oldName);
            console.log("newName:", newName);
        });
    },
});
