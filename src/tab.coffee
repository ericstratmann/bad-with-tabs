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

