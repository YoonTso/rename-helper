/* global.d.ts */

export interface IelectronAPI {
    rename: (files: string[], separator: string) => Promise<void>;
    onRename: () => Promise<void>;
    restore: (files: string[], separator: string) => Promise<void>;
    onRestore: () => Promise<void>;
}

declare global {
    interface Window {
        electronAPI: IelectronAPI;
    }
}
