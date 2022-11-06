import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    rename: (files: string[], separator: string) => {
        console.log("preload");
        console.log(files);
        console.log(separator);
        ipcRenderer.send("rename", files, separator);
    },
    onRename: () => {
        ipcRenderer.on("done", (event, oldName, newName) => {
            console.log("oldName:", oldName);
            console.log("newName:", newName);
        });
    }
});
