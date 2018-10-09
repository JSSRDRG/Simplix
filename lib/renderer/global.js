// Disable eval() function.
window.eval = global.eval = function () {
  throw new Error(`Sorry, we don't support window.eval().`)
}

// Global renderer script.
const $ = require('./lib/modules/shorts.js')
const { remote } = require('electron')
const titlebar = require('./lib/renderer/titlebar.js')
const Tab = require('./lib/modules/tab.js')

// Get current window object.
const mainWindow = remote.getCurrentWindow()

// Init function.
function init (os) {
  // Built the titlebar for the right os.
  titlebar.build(os)
}
init(process.platform)
