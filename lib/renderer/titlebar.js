// Titlebar script.

// Variables
let titlebar = $('#app-titlebar')

module.exports = {
  build(os) {
    if (os === 'win32') buildWin()
    else if (os === 'darwin') buildDarwin()
    else $('#app').innerHTML = 'Your operating system is not supported.'
  }
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

  // Append Tabbar & windowControls elements to titlebar.
  titlebar.appendChild(tabBar)
  titlebar.appendChild(windowControls)
}

// Function to create titlebar for MacOS.
function buildDarwin() {
  titlebar.classList.add('darwin')
}
