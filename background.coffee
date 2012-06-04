class Browser
    constructor: ->
        @windows = []

    addWindow: (window) ->
        @windows.push window
class Window
    constructor: (chromeWindow) ->
        @chromeWindow = chromeWindow
        @tabs = []

    addTab: (tab) ->
        @tabs.push tab

class Tab
    constructor: (chromeTab) ->
        @chromeTab = chromeTab
