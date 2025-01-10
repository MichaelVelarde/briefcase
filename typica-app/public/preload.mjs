import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ipcRenderer', {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
});