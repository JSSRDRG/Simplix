// Require modules.
const $ = require('./../modules/shorts.js')

// Keep reference of the tab array.
let tabList = {
  tabArray: [],
  activeTab: undefined
}

// Tab variables.
let webviews
let tabbar

class Tab {
  // Tab constructor function.
  constructor (id, url) {
    this.id = id
    this.url = url
    this.title = ''
    this.favicon = ''

    // Create webviews div.
    Tab.createContainer()
  }

  static add () {
    // Create unique id for Tab.
    let uuid = Math.random().toString(8).substr(2, 8)
    // Make a new class.
    tabList.tabArray['tab' + uuid] = new Tab(uuid, 'https://google.nl')
  }

  // Return an array with all tabs.
  static get list () {
    return tabList.tabArray
  }

  // Return the tab object the user currently sees.
  static get active () {
    return tabList.activeTab
  }

  // Set the given tab as the active tab.
  static setActive (id) {
    // Change active tab in tabList array.
    tabList.activeTab = id

    // Go through each webview element and remove the active class.
    for (let i = 0; i < webviews.querySelectorAll('webview').length; i++) {
      // Remove active class.
      webviews.querySelectorAll('webview')[i].classList.remove('active')
    }

    // Go through each tab element and remove the active class.
    for (let i =0; i < tabbar.querySelectorAll('.tab').length; i++) {
      // Remove active class.
      tabbar.querySelectorAll('.tab')[i].classList.remove('active')
    }

    // Add active class to given tab.
    $(`#tab${id}`).classList.add('active')

    // Add active class to given tabbar item.
    $(`#tab-item${id}`).classList.add('active')
  }
}

// Function to create the webviews div.
function createWebviewsElement () {
  let children = $('#app-web-container').children
  let containerPresent = false
  // Check if #webviews is a child of #app-web-container.
  for (let i = 0; i < children.length; i++) {
    // If id is #webviews is then set presents to true.
    if (children[i].id === 'webviews') {
      containerPresent = true
    }
  }
  // If containerPresent is false then create it.
  if (containerPresent === false) {
    let container = document.createElement('div')
    container.id = 'webviews'
    $('#app-web-container').appendChild(container)
  }
  // Set the Tab variable webviews to the created element.
  webviews = $('#webviews')
  tabbar = $('#tab-bar')
}

// Function to create a tabbar item.
function createTabbarItem (id) {
  let item = document.createElement('div')
  item.classList.add('tab')
  item.id = `tab-item${id}`
  tabbar.appendChild(item)

  // Add click eventlistener. Set tab to active when it gets clicked.
  item.addEventListener('click', () => Tab.setActive(id))
}


module.exports = Tab
