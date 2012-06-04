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

browser = new Browser
 
chrome.windows.getAll populate: true, (chromeWindows) ->
    chromeWindows.forEach (chromeWindow) ->
        window = new Window chromeWindow
        chromeWindow.tabs.forEach (chromeTab) ->
            tab = new Tab chromeTab
            window.addTab tab
        browser.addWindow window
