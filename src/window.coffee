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
