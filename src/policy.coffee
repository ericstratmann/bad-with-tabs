class Policy
    DEFAULT_MAX_TABS_PER_WINDOW: 5

    constructor: ->
        @readPolicyFromLocal()

    tabToClose: (tabs) ->
        keys = Object.keys tabs
        if keys.length > @maxTabsPerWindow
            candidate = tabs[keys[0]]
            for own id, tab of tabs
                if tab.lastAccess < candidate.lastAccess
                    candidate = tab
        candidate

    readPolicyFromLocal: ->
        jsonPolicy = localStorage["policy"]
        if policy
            policy = JSON.parse jsonPolicy
        else
            policy = @initializePolicy()

        @maxTabsPerWindow = policy["maxTabsPerWindow"]

    initializePolicy: ->
        policy = {}
        policy["maxTabsPerWindow"] = @DEFAULT_MAX_TABS_PER_WINDOW
        localStorage["policy"] = JSON.stringify policy
        policy
