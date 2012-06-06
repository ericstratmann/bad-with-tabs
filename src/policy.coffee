class Policy
    constructor: ->
        @maxTabs = 5

    tabToClose: (tabs) ->
        keys = Object.keys tabs
        if keys.length > @maxTabs
            candidate = tabs[keys[0]]
            for own id, tab of tabs
                if tab.lastAccess < candidate.lastAccess
                    candidate = tab
        candidate
