const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { ipcMain } = require('electron');
const Account = require('./models/account.js');
const Role = require('./models/role.js');
const Payee = require('./models/payee.js')
const ProductType = require('./models/productType.js');
const Product = require('./models/product.js');
const PriceDefinition = require('./models/priceDefinition.js');
const CommisionReciever = require('./models/commisionReceiver.js');
const OrganizationCustomer = require('./models/organizationCustomer.js');
const Order = require('./models/order.js');
const TitleOrders = require('./models/titleOrders.js');
const AccrualRule = require('./models/accrualRule.js');

require('./models/associations/associations.js');
require('./database/connection.js');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


ipcMain.handle('check-database-connection', async () => {
  try {
     await checkDatabaseConnection();
     return { success: true };
  } catch (error) {
     return { success: false, error: error.message };
  }
 });


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('C:\\Users\\koval\\electron-store-app\\electron-app\\src\\index.html');

  mainWindow.webContents.openDevTools()
};

async function syncModels() {
  try {
     await Role.sync();
     await Account.sync();
     await Payee.sync();
     await ProductType.sync();
     await OrganizationCustomer.sync();
     await Product.sync();
     await PriceDefinition.sync();
     await CommisionReciever.sync();
     await Order.sync({ alter: true });
     await TitleOrders.sync({ alter: true });
     await AccrualRule.sync();
     console.log('Syncronized successfully');
  } catch (error) {
     console.error('Error due to failed sycnronization:', error);
  }
 }
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then( () => {
  
  syncModels();

  
   
  
  createWindow();
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Запуск сервера
const server = require('./server/app.js');

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


