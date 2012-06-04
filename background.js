(function() {
  var Browser, Tab, Window, browser, onTabAttached, onTabCreated;
  Browser = function() {
    this.windows = [];
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
  Window = function(chromeWindow) {
    this.chromeWindow = chromeWindow;
    this.tabs = [];
    return this;
  };
  Window.prototype.addTab = function(tab) {
    this.tabs.push(tab);
    return tab.setWindow(this);
  };
  Window.prototype.removeTab = function(tab) {
    return this.tabs.remove(this.tabs.indexOf(tab));
  };
  Window.prototype.getTabById = function(id) {
    return this.tabs.findFirst(function(tab) {
      return tab.chromeTab.id === id;
    });
  };
  Tab = function(chromeTab) {
    this.chromeTab = chromeTab;
    this.window = null;
    return this;
  };
  Tab.prototype.setWindow = function(window) {
    if (this.window) {
      this.window.removeTab(this);
    }
    return (this.window = window);
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
    return delete this[this.length - 1];
  };
  onTabCreated = function(chromeTab) {
    var tab, window;
    window = browser.getWindowById(chromeTab.windowId);
    tab = new Tab(chromeTab);
    return window.addTab(tab);
  };
  onTabAttached = function(tabId, attachInfo) {
    var tab, window;
    tab = browser.findTabBy(tabId);
    window = browser.findWindow(attackInfo.newWindowId);
    return window.addTab(tab);
  };
  chrome.tabs.onAttached.addListener(onTabAttached);
  chrome.tabs.onCreated.addListener(onTabCreated);
  browser = new Browser();
  chrome.windows.getAll({
    populate: true
  }, function(chromeWindows) {
    return chromeWindows.forEach(function(chromeWindow) {
      var window;
      window = new Window(chromeWindow);
      chromeWindow.tabs.forEach(function(chromeTab) {
        var tab;
        tab = new Tab(chromeTab);
        return window.addTab(tab);
      });
      return browser.addWindow(window);
    });
  });
}).call(this);
