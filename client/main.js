const { app, BrowserWindow, Menu, screen } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    height,
    width,
    icon: path.join(__dirname, "src", "assets", "images", "favicon.ico"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(null);

  // mainWindow.loadURL(`http://localhost:3000`);
  mainWindow.loadFile(`${path.join(__dirname, "build", "index.html")}`);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
