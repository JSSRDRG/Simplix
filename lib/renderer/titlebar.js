// Titlebar script.

// Require modules.
const $ = require('./../modules/shorts.js')
const { remote } = require('electron')

// Get current window object.
const mainWindow = remote.getCurrentWindow()

// Variables
let titlebar = $('#app-titlebar')

// Windowcontrols icons
let closeSVG = {
  icon: '<svg width="10" height="10"><path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z"></path></svg>',
  id: 'close'
}
let minimizeSVG = {
  icon: '<svg width="10" height="10"><path d="M 0,5 10,5 10,6 0,6 Z"></path></svg>',
  id: 'minimize'
}
let maximizeSVG = {
  icon: '<svg width="10" height="10"><path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z"></path></svg>',
  id: 'maximize'
}
let maximizedSVG = {
  icon: '<svg width="10" height="10"><path d="m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z"></path></svg>'
}

// Function to create titlebar for Windows.
function buildWin () {
  titlebar.classList.add('win32')
  // Tabbar element.
  let tabBar = document.createElement('div')
  tabBar.id = 'tab-bar'
  // Window controls element.
  let windowControls = document.createElement('div')
  windowControls.id = 'window-controls'

  // Windows-button function.
  function windowsWindowControls (svg, id) {
    let button = document.createElement('button')
    button.id = id
    button.classList.add('windows-button')
    // Add svg icon.
    button.innerHTML = svg
    windowControls.appendChild(button)
  }
  [minimizeSVG, maximizeSVG, closeSVG].forEach((svg) => {
    windowsWindowControls(svg.icon, svg.id)
  })

  // Append Tabbar & windowControls elements to titlebar.
  titlebar.appendChild(tabBar)
  titlebar.appendChild(windowControls)

  // Add click event to windowControls
  $('#minimize').addEventListener('click', () => {
    mainWindow.minimize()
  })
  $('#maximize').addEventListener('click', () => {
    if (!mainWindow.isMaximized()) {
      mainWindow.maximize()
    } else {
      mainWindow.unmaximize()
    }
  })
  $('#close').addEventListener('click', () => {
    mainWindow.close()
  })

  // Change maximize button icon depending on state.
  mainWindow.on('maximize', () => {
    $('#maximize').innerHTML = maximizedSVG.icon
  })
  mainWindow.on('unmaximize', () => {
    $('#maximize').innerHTML = maximizeSVG.icon
  })
}

// Function to create titlebar for MacOS.
function buildDarwin () {
  titlebar.classList.add('darwin')
  // Tabbar element.
  let tabBar = document.createElement('div')
  tabBar.id = 'tab-bar'

  // Window controls element.
  let windowControls = document.createElement('div')
  windowControls.id = 'window-controls'

  // Append Tabbar & windowControls elements to titlebar.
  titlebar.appendChild(windowControls)
  titlebar.appendChild(tabBar)
}

module.exports = {
  build (os) {
    if (os === 'win32') buildWin()
    else if (os === 'darwin') buildDarwin()
    else $('#app').innerHTML = 'Your operating system is not supported.'
  }
}
