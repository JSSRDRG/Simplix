// Require modules.
const $ = require('./../modules/shorts.js')
const { remote } = require('electron')

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
    console.warn(`[Tab] ID can't be overwritten.`)
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
    // Update the tab element.
    $(`#tab-item${this.id}`).getElementsByClassName('title')[0].innerHTML = input
  }

  get title () {
    return this._title
  }

  set favicon (input) {
    this._favicon = input
    // Update favicon in tab item.
    $(`#tab-item${this.id}`).getElementsByClassName('favicon')[0].style.backgroundImage = `url(${input[0]})`
  }

  get favicon () {
    return this._favicon
  }

  set fullscreen (input) {
    this._fullscreen = input
    // Add fullscreen class when true.
    if (input) $(`#view${this.id}`).classList.add('fullscreen')
    // Remove fullscreen class when false.
    else $(`#view${this.id}`).classList.remove('fullscreen')
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

  static add (url) {
    // Create unique id for Tab.
    let uuid = Math.random().toString(8).substr(2, 8)
    // Make a new class.
    tabList.tabArray.push(new Tab(uuid, url || 'https://google.nl'))
    // Set new Tab as active.
    Tab.setActive(uuid)
  }

  static close (id) {
    // Get index of tab.
    let index = Tab.indexOf(id)

    // If this is the only Tab, then close the window.
    if (Tab.list.length === 1) remote.getCurrentWindow().close()

    // If tab is activeTab, then a different tab has to become active.
    if (id === Tab.active.id) {
      // Check for a tab on the right of this one.
      if (typeof Tab.list[index + 1] === 'undefined') {
        // Check for a tab on the left of this one.
        if (typeof Tab.list[index - 1] === 'undefined') {
          console.error(`[Tab] Couldn't find a tab to set active.`)
        } else Tab.setActive(Tab.list[index - 1].id)
      } else Tab.setActive(Tab.list[index + 1].id)
    }

    // Destroy the webview element & tabbar item.
    webviews.removeChild($(`#view${id}`))
    tabbar.removeChild($(`#tab-item${id}`))
    tabList.tabArray.splice(index, 1)
  }

  // Set the given tab as the active tab.
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
    $(`#view${id}`).classList.add('active')

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
  webview.id = `view${id}`
  webview.setAttribute('src', url)
  webview.setAttribute('webpreferences', 'scrollBounce')
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
  let setActive = function () {
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
  $(`#view${id}`).addEventListener('page-title-updated', (event) => {
    Tab.list[Tab.indexOf(id)].title = event.title
  })
  // Update the url when changed.
  $(`#view${id}`).addEventListener('load-commit', (event) => {
    if (event.isMainFrame) {
      Tab.list[Tab.indexOf(id)].url = event.url
      Tab.list[Tab.indexOf(id)].title = $(`#view${Tab.list[Tab.indexOf(id)].id}`).getTitle()
    }
  })
  // Update the favicon url when changed.
  $(`#view${id}`).addEventListener('page-favicon-updated', (event) => {
    Tab.list[Tab.indexOf(id)].favicon = event.favicons
  })
  // Go fullscreen when html emits fullscreen.
  $(`#view${id}`).addEventListener('enter-html-full-screen', () => {
    Tab.list[Tab.indexOf(id)].fullscreen = true
  })
  // Leave fullscreen when html emits leave fullscreen.
  $(`#view${id}`).addEventListener('leave-html-full-screen', () => {
    Tab.list[Tab.indexOf(id)].fullscreen = false
  })

  // LOG ALL WEBVIEW DOM EVENTS.
  $(`#view${id}`).addEventListener('load-commit', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('did-finish-load', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('did-fail-load', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('did-frame-finish-load', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('did-start-loading', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('did-stop-loading', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('dom-ready', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('page-title-updated', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('page-favicon-updated', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('enter-html-full-screen', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('leave-html-full-screen', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('console-message', (event) => {
    console.log(event.type)
    console.log(`[LOG] ${event.message}`)
  })
  $(`#view${id}`).addEventListener('new-window', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('will-navigate', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('did-navigate', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('did-navigate-in-page', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('close', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('ipc-message', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('crashed', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('gpu-crashed', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('plugin-crashed', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('deystroyed', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('media-started-playing', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('media-paused', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('did-change-theme-color', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('update-target-url', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('devtools-opened', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('devtools-closed', (event) => {
    console.log(event.type)
  })
  $(`#view${id}`).addEventListener('devtools-focused', (event) => {
    console.log(event.type)
  })
}

// Add button.
$('#addBtn').addEventListener('click', () => {
  Tab.add()
})

module.exports = Tab
