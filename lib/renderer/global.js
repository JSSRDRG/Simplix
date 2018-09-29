// Global renderer script.
const $ = require('./lib/modules/shorts.js');
const { remote } = require('electron')
const titlebar = require('./lib/renderer/titlebar.js')

// Get current window object.
const mainWindow = remote.getCurrentWindow()

// Init function.
function init(os) {
  // Built the titlebar for the right os.
  titlebar.build(os)
}
init(process.platform)
