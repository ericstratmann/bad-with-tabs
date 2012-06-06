class Window
    constructor: (chromeWindow) ->
        @chromeWindow = chromeWindow
        @id = chromeWindow.id
        @tabs = {}

    setBrowser: (browser) ->
        @browser = browser

    addTab: (tab) ->
        @tabs[tab.id] = tab
        tab.setWindow @
        @closeTabIfNecessary()

    removeTab: (tab) ->
        delete @tabs[tab.id]

    closeTab: (tab) ->
        chrome.tabs.remove tab.id

    getTabById: (id) ->
        @tabs.find (tab) ->
            tab.id == id

    closeTabIfNecessary: ->
        tab = @browser.policy.tabToClose @tabs
        @closeTab tab if tab
