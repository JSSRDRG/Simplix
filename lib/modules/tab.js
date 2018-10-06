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
    this._url = url
    this._title = ''
    this._favicon = ''
    this._fullscreen = false

    // Create webviews div.
    createWebviewsElement()

    // Create a webview.
    let webview = document.createElement('webview')
    webview.id = `tab${this.id}`
    webview.setAttribute('src', this.url)
    webviews.appendChild(webview)

    // Create a tab item in the tabbar.
    createTabbarItem(this.id)

    // Set this new tab as the active tab.
    Tab.setActive(this.id)

    // Add webview events.
    setEvents(this.id)
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

  // Return the tab object the user currently sees.
  static get active () {
    return tabList.activeTab
  }

  static add () {
    // Create unique id for Tab.
    let uuid = Math.random().toString(8).substr(2, 8)
    // Make a new class.
    tabList.tabArray['tab' + uuid] = new Tab(uuid, 'https://google.nl')
  }

  static close (id) {
    // Destroy the webview element & tabbar item.
    webviews.removeChild($(`#tab${id}`))
    tabbar.removeChild($(`#tab-item${id}`))
    delete tabList.tabArray[`tab${id}`]

    // Check if closed tab is currentTab. If so return
    if (id !== Tab.active) {
      return console.log('Tab closed')
    }

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
    for (let i = 0; i < tabbar.querySelectorAll('.tab').length; i++) {
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

// Function that adds Electrons webview eventlistener to the Tab class.
function setEvents (id) {
  // Update the title when changed.
  $(`#tab${id}`).addEventListener('page-title-updated', (event) => {
    tabList.tabArray[`tab${id}`].title = event.title
    // Update the title.
    $(`#tab-item${id}`).getElementsByClassName('title')[0].innerHTML = event.title
  })
  // Update the url when changed.
  $(`#tab${id}`).addEventListener('load-commit', (event) => {
    if (event.isMainFrame) {
      tabList.tabArray[`tab${id}`].url = event.url
    }
  })
  // REVIEW: Could be removed if it overlaps entirely with load-commit event.
  $(`#tab${id}`).addEventListener('did-navigate-in-page', (event) => {
    tabList.tabArray[`tab${id}`].url = event.url
  })
  // Update the favicon url when changed.
  $(`#tab${id}`).addEventListener('page-favicon-updated', (event) => {
    tabList.tabArray[`tab${id}`].favicon = event.favicons
    // Update favicon in tab item.
    $(`#tab-item${id}`).getElementsByClassName('favicon')[0].style.backgroundImage = `url(${event.favicons[0]})`
  })
  // Go fullscreen when html emits fullscreen.
  $(`#tab${id}`).addEventListener('enter-html-full-screen', () => {
    tabList.tabArray[`tab${id}`].fullscreen = true
    // Add fullscreen class.
    $(`#tab${id}`).classList.add('fullscreen')
  })
  // Leave fullscreen when html emits leave fullscreen.
  $(`#tab${id}`).addEventListener('leave-html-full-screen', () => {
    tabList.tabArray[`tab${id}`].fullscreen = false
    // Remove fullscreen class.
    $(`#tab${id}`).classList.remove('fullscreen')
  })
}

// Add button.
$('#addBtn').addEventListener('click', Tab.add)

module.exports = Tab
