class Window
    constructor: (chromeWindow) ->
        @chromeWindow = chromeWindow
        @id = chromeWindow.id
        @tabs = {}

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
        keys = Object.keys @tabs
        if keys.length > 5
            candidate = @tabs[keys[0]]
            for own id, tab of @tabs
                if tab.lastAccess < candidate.lastAccess
                    candidate = tab
            @closeTab candidate
