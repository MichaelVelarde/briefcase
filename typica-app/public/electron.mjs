import electron from "electron";
import path from "path";
import isDev from "electron-is-dev";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { ipcMain, app, BrowserWindow } = electron;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.resolve(app.getAppPath(), '../app.asar.unpacked/build/iconTypica.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      preload: path.resolve(app.getAppPath(), '../app.asar.unpacked/build/preload.mjs'),
    },
  })
  
  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

    win.loadURL(startURL);
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('print-command', async (e, arrHtmlContents) => {
  if (arrHtmlContents.length < 1) return "Sin contenido"
  
  let counterPrints = 0
  let printingInfoArr = []

  try {
    let printerWindow = new BrowserWindow({width: 800, height: 600, show: false });
    for (let htmlContent of arrHtmlContents) { 
      printerWindow.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(htmlContent))
      printerWindow.webContents.on('did-finish-load', () => {
          printerWindow.webContents.print({ margins: {
            marginType: 'printableArea',
          },printBackground: false, silent: true }, (status)=> {
            counterPrints++
            printingInfoArr.push({
              statusOfPrint: status,
              numOfPrint: counterPrints
            })
            if (counterPrints === arrHtmlContents.length) {
              e.sender.send('res-print', printingInfoArr)
            }
            printerWindow.close()
          })
      })
    }
    return 'Printing done'
  } catch (err) {
    return err }

})