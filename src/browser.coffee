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

browser = new Browser
