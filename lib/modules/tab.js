// Require modules.
const $ = require('./../modules/shorts.js')

// Keep reference of the tab array.
let tabList = {
  tabArray: [],
  activeTab: undefined
}

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
  }

  static createContainer () {
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
  }

  static get list () {
    return tabList.tabArray
  }
}

module.exports = Tab
