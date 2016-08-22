'use strict';
const electron = require('electron'),
      path = require("path");

class App{
  constructor(){
    this.app = electron.app;
    this.BrowserWindow = electron.BrowserWindow;   
    this._url = `file://${path.join(__dirname, '../views/', 'index.html')}`;
  }
  createWindow(width=800,height=600){
    this.win = new this.BrowserWindow({width : width, height : height});
    this.win.loadURL(this._url);
    this.win.webContents.openDevTools();
    this.win.on('closed', () => {this.win = null});
  }
  checkWindow(){
    this.app.on('ready', this.createWindow.bind(this));
    // Quit when all windows are closed.
    this.app.on('window-all-closed', () => {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        this.app.quit()
      }
    });
    this.app.on('activate', () => {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (this.win === null) {
        this.createWindow();
      }
    });
  }
}

module.exports = App;