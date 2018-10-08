// Require modules.
const $ = require('./../modules/shorts.js')

// Keep reference of the tab array.
let tabList = {
  tabArray: [],
  activeTab: {
    index: undefined,
    id: undefined
  }
}

// Tab variables.
let webviews
let tabbar

class Tab {
  // Tab constructor function.
  constructor (id, url) {
    this._id = id
    this._url = url
    this._title = ''
    this._favicon = ''
    this._fullscreen = false

    // Create webviews div.
    createWebviewsContainer()

    // Create a webview element.
    createWebview(this.id, this.url)

    // Create a tabbar item.
    createTabbarItem(this.id)

    // Add events to Tab.
    setEvents(this.id)
  }

  set id (input) {
    this._id = input
  }

  get id () {
    return this._id
  }

  set url (input) {
    this._url = input
  }

  get url () {
    return this._url
  }

  set title (input) {
    this._title = input
  }

  get title () {
    return this._title
  }

  set favicon (input) {
    this._favicon = input
  }

  get favicon () {
    return this._favicon
  }

  set fullscreen (input) {
    this._fullscreen = input
  }

  get fullscreen () {
    return this._fullscreen
  }

  // Return an array with all tabs.
  static get list () {
    return tabList.tabArray
  }

  // Return the Tab class the user currently sees.
  static get active () {
    return tabList.activeTab
  }

  static add () {
    // Create unique id for Tab.
    let uuid = Math.random().toString(8).substr(2, 8)
    // Make a new class.
    tabList.tabArray.push(new Tab(uuid, 'https://google.nl'))
    // Set new Tab as active.
    Tab.setActive(uuid)
  }

  static close (id) {
    // Get index of tab.
    let index = Tab.list.findIndex(i => i.id === id)
    console.log(index)

    // Destroy the webview element & tabbar item.
    webviews.removeChild($(`#tab${id}`))
    tabbar.removeChild($(`#tab-item${id}`))
    delete tabList.tabArray[`tab${id}`]

    // Check if closed tab is currentTab. If so return
    if (id !== Tab.active) {
      return console.log('Tab closed')
    }

  }

  static setActive (id) {
    // Change active tab id in tabList array.
    tabList.activeTab.id = id
    // Get index of tab.
    tabList.activeTab.index = Tab.indexOf(id)

    // Go through each webview element and remove the active class.
    for (let i = 0; i < webviews.querySelectorAll('webview').length; i++) {
      // Remove active class.
      webviews.querySelectorAll('webview')[i].classList.remove('active')
    }

    // Go through each tab element and remove the active class.
    for (let i = 0; i < tabbar.querySelectorAll('.tab').length; i++) {
      // Remove active class.
      tabbar.querySelectorAll('.tab')[i].classList.remove('active')
    }

    // Add active class to given tab.
    $(`#tab${id}`).classList.add('active')

    // Add active class to given tabbar item.
    $(`#tab-item${id}`).classList.add('active')
  }

  static indexOf (id) {
    for (let i = 0; i < tabList.tabArray.length; i++) {
      if (tabList.tabArray[i]['id'] === id) return i
    }
    console.error('[TAB] THIS TAB DOESN\'T EXCISTS.')
    return -1
  }
}

// Function to create the webviews div.
function createWebviewsContainer () {
  let children = $('#app-web-container').children
  let containerPresent = false
  // Check if #webviews is a child of #app-web-container.
  for (let i = 0; i < children.length; i++) {
    // If id is #webviews is then set present to true.
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

// Function to create webview element.
function createWebview (id, url) {
  let webview = document.createElement('webview')
  webview.id = `tab${id}`
  webview.setAttribute('src', url)
  webviews.appendChild(webview)
}

// Function to create a tabbar item.
function createTabbarItem (id) {
  let item = document.createElement('div')
  item.classList.add('tab')
  item.id = `tab-item${id}`
  // Create favicon div.
  let favicon = document.createElement('div')
  favicon.classList.add('favicon')
  item.appendChild(favicon)
  // Create title div.
  let title = document.createElement('div')
  title.classList.add('title')
  item.appendChild(title)
  // Create close div.
  let close = document.createElement('div')
  close.classList.add('close')
  let closeBtn = document.createElement('button')
  closeBtn.classList.add('btn')
  closeBtn.id = 'closeBtn'
  let closeSvg = document.createElement('div')
  closeSvg.classList.add('btnSvg')
  closeBtn.appendChild(closeSvg)
  close.appendChild(closeBtn)
  item.appendChild(close)
  // Append item to tabbar.
  tabbar.appendChild(item)

  // Create named function to be able to remove & add it with eventlisteners.
  let setActive = function() {
    Tab.setActive(id)
  }
  // Add click eventlistener. Set tab to active when it gets clicked.
  item.addEventListener('click', setActive)
  // Remove click eventlistener when mouse is over close div.
  close.addEventListener('mouseover', () => {
    item.removeEventListener('click', setActive)
  })
  close.addEventListener('mouseout', () => {
    item.addEventListener('click', setActive)
  })
  // Add click eventlistener. Close tab when close button is clicked.
  closeBtn.addEventListener('click', () => Tab.close(id))
}

// Function that adds Electrons webview eventlistener to the Tab.
function setEvents (id) {
  // Update the title when changed.
  $(`#tab${id}`).addEventListener('page-title-updated', (event) => {
    tabList.tabArray[Tab.indexOf(id)].title = event.title
    // Update the title.
    $(`#tab-item${id}`).getElementsByClassName('title')[0].innerHTML = event.title
  })
  // Update the url when changed.
  $(`#tab${id}`).addEventListener('load-commit', (event) => {
    if (event.isMainFrame) {
      tabList.tabArray[Tab.indexOf(id)].url = event.url
    }
  })
  // Update the favicon url when changed.
  $(`#tab${id}`).addEventListener('page-favicon-updated', (event) => {
    tabList.tabArray[Tab.indexOf(id)].favicon = event.favicons
    // Update favicon in tab item.
    $(`#tab-item${id}`).getElementsByClassName('favicon')[0].style.backgroundImage = `url(${event.favicons[0]})`
  })
  // Go fullscreen when html emits fullscreen.
  $(`#tab${id}`).addEventListener('enter-html-full-screen', () => {
    tabList.tabArray[Tab.indexOf(id)].fullscreen = true
    // Add fullscreen class.
    $(`#tab${id}`).classList.add('fullscreen')
  })
  // Leave fullscreen when html emits leave fullscreen.
  $(`#tab${id}`).addEventListener('leave-html-full-screen', () => {
    tabList.tabArray[Tab.indexOf(id)].fullscreen = false
    // Remove fullscreen class.
    $(`#tab${id}`).classList.remove('fullscreen')
  })
}

// Add button.
$('#addBtn').addEventListener('click', Tab.add)

module.exports = Tab
