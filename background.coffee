class Browser
    constructor: ->
        @windows = []
        @initialize()
        @addEventHandlers()

    initialize: ->
        chrome.windows.getAll populate: true, (chromeWindows) =>
            chromeWindows.forEach (chromeWindow) =>
                window = new Window chromeWindow
                chromeWindow.tabs.forEach (chromeTab) =>
                    tab = new Tab chromeTab
                    window.addTab tab
                @addWindow window

    addEventHandlers: ->
        chrome.windows.onCreated.addListener (chromeWindow) =>
            @addWindow new Window chromeWindow

        chrome.tabs.onCreated.addListener (chromeTab) =>
            window = @getWindowById chromeTab.windowId
            window.addTab new Tab chromeTab

        chrome.tabs.onRemoved.addListener (tabId, removeInfo) =>
            tab = @getTabById tabId
            tab.window.removeTab tab

        chrome.tabs.onSelectionChanged.addListener (tabId) =>
            tab = @getTabById tabId
            tab.updateLastAccess()

        chrome.tabs.onAttached.addListener (tabId, attachInfo) =>
            window = @getWindowById attachInfo.newWindowId
            window.addTab @getTabById tabId

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
        @closeTabIfNecessary()

    removeTab: (tab) ->
        @tabs.remove @tabs.indexOf tab

    closeTab: (tab) ->
        chrome.tabs.remove tab.chromeTab.id

    getTabById: (id) ->
        @tabs.findFirst (tab) ->
            tab.chromeTab.id == id

    closeTabIfNecessary: ->
        if @tabs.length > 5
            candidate = @tabs[0]
            @tabs.forEach (tab) ->
                if tab.lastAccess < candidate.lastAccess
                    candidate = tab
            @closeTab candidate

class Tab
    constructor: (chromeTab) ->
        @chromeTab = chromeTab
        @window = null
        @updateLastAccess()

    setWindow: (window) ->
        @window.removeTab @ if @window
        @window = window

    updateLastAccess: ->
        @lastAccess = new Date().getTime()

Array.prototype.findFirst = (f) ->
    ret = this.filter (i) -> f i
    return ret[0] if ret.length > 0
    null

Array.prototype.remove = (i) ->
    this[i] = this[this.length - 1]
    this.length -= 1

browser = new Browser
