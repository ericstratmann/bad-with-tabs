class Browser
    constructor: ->
        @windows = []

    addWindow: (window) ->
        @windows.push window

    removeWindow: (window) ->
        @windows.remove @windows.indexOf window

    getWindowById: (id) ->
        @windows.findFirst (window) ->
            window.chromeWindow.id == id

    getTabById: (id) ->
        window = @windows.findFirst (window) ->
            window.getTabById id
        window.getTabById id

class Window
    constructor: (chromeWindow) ->
        @chromeWindow = chromeWindow
        @tabs = []

    addTab: (tab) ->
        @tabs.push tab
        tab.setWindow @

    removeTab: (tab) ->
        @tabs.remove @tabs.indexOf tab

    getTabById: (id) ->
        @tabs.findFirst (tab) ->
            tab.chromeTab.id == id

class Tab
    constructor: (chromeTab) ->
        @chromeTab = chromeTab
        @window = null

    setWindow: (window) ->
        @window.removeTab @ if @window
        @window = window

Array.prototype.findFirst = (f) ->
    ret = this.filter (i) -> f i
    return ret[0] if ret.length > 0
    null

Array.prototype.remove = (i) ->
    this[i] = this[this.length - 1]
    delete this[this.length - 1]

onTabCreated = (chromeTab) ->
    window = browser.getWindowById chromeTab.windowId
    tab = new Tab chromeTab
    window.addTab tab

onTabAttached = (tabId, attachInfo) ->
    tab = browser.findTabBy tabId
    window = browser.findWindow attackInfo.newWindowId
    window.addTab tab

chrome.tabs.onAttached.addListener onTabAttached
chrome.tabs.onCreated.addListener onTabCreated

browser = new Browser

chrome.windows.getAll populate: true, (chromeWindows) ->
    chromeWindows.forEach (chromeWindow) ->
        window = new Window chromeWindow
        chromeWindow.tabs.forEach (chromeTab) ->
            tab = new Tab chromeTab
            window.addTab tab
        browser.addWindow window
