(function() {
  var Browser, Tab, Window, browser, onTabAttached, onTabCreated, onTabRemoved, onTabSelected, onWindowCreated;
  var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  Browser = function() {
    this.windows = [];
    this.initialize();
    return this;
  };
  Browser.prototype.addWindow = function(window) {
    return this.windows.push(window);
  };
  Browser.prototype.removeWindow = function(window) {
    return this.windows.remove(this.windows.indexOf(window));
  };
  Browser.prototype.getWindowById = function(id) {
    return this.windows.findFirst(function(window) {
      return window.chromeWindow.id === id;
    });
  };
  Browser.prototype.getTabById = function(id) {
    var window;
    window = this.windows.findFirst(function(window) {
      return window.getTabById(id);
    });
    return window.getTabById(id);
  };
  Browser.prototype.initialize = function() {
    return chrome.windows.getAll({
      populate: true
    }, __bind(function(chromeWindows) {
      return chromeWindows.forEach(__bind(function(chromeWindow) {
        var window;
        window = new Window(chromeWindow);
        chromeWindow.tabs.forEach(__bind(function(chromeTab) {
          var tab;
          tab = new Tab(chromeTab);
          return window.addTab(tab);
        }, this));
        return this.addWindow(window);
      }, this));
    }, this));
  };
  Window = function(chromeWindow) {
    this.chromeWindow = chromeWindow;
    this.tabs = [];
    return this;
  };
  Window.prototype.addTab = function(tab) {
    this.tabs.push(tab);
    tab.setWindow(this);
    return this.closeTabIfNecessary();
  };
  Window.prototype.removeTab = function(tab) {
    return this.tabs.remove(this.tabs.indexOf(tab));
  };
  Window.prototype.closeTab = function(tab) {
    return chrome.tabs.remove(tab.chromeTab.id);
  };
  Window.prototype.getTabById = function(id) {
    return this.tabs.findFirst(function(tab) {
      return tab.chromeTab.id === id;
    });
  };
  Window.prototype.closeTabIfNecessary = function() {
    var candidate;
    if (this.tabs.length > 5) {
      candidate = this.tabs[0];
      this.tabs.forEach(function(tab) {
        return tab.lastAccess < candidate.lastAccess ? (candidate = tab) : null;
      });
      return this.closeTab(candidate);
    }
  };
  Tab = function(chromeTab) {
    this.chromeTab = chromeTab;
    this.window = null;
    this.updateLastAccess();
    return this;
  };
  Tab.prototype.setWindow = function(window) {
    if (this.window) {
      this.window.removeTab(this);
    }
    return (this.window = window);
  };
  Tab.prototype.updateLastAccess = function() {
    return (this.lastAccess = new Date().getTime());
  };
  Array.prototype.findFirst = function(f) {
    var ret;
    ret = this.filter(function(i) {
      return f(i);
    });
    if (ret.length > 0) {
      return ret[0];
    }
    return null;
  };
  Array.prototype.remove = function(i) {
    this[i] = this[this.length - 1];
    return this.length -= 1;
  };
  onTabCreated = function(chromeTab) {
    var tab, window;
    window = browser.getWindowById(chromeTab.windowId);
    tab = new Tab(chromeTab);
    return window.addTab(tab);
  };
  onTabAttached = function(tabId, attachInfo) {
    var tab, window;
    tab = browser.getTabById(tabId);
    window = browser.getWindowById(attachInfo.newWindowId);
    return window.addTab(tab);
  };
  onTabRemoved = function(tabId, removeInfo) {
    var tab;
    tab = browser.getTabById(tabId);
    return tab.window.removeTab(tab);
  };
  onTabSelected = function(tabId) {
    var tab;
    tab = browser.getTabById(tabId);
    return tab.updateLastAccess();
  };
  onWindowCreated = function(chromeWindow) {
    var window;
    window = new Window(chromeWindow);
    return browser.addWindow(window);
  };
  chrome.tabs.onAttached.addListener(onTabAttached);
  chrome.tabs.onCreated.addListener(onTabCreated);
  chrome.tabs.onSelectionChanged.addListener(onTabSelected);
  chrome.tabs.onRemoved.addListener(onTabRemoved);
  chrome.windows.onCreated.addListener(onWindowCreated);
  browser = new Browser();
}).call(this);
