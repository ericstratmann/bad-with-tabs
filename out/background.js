// Generated by CoffeeScript 1.3.3
(function() {
  var Browser, Tab, Window, browser;

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

  Browser = (function() {

    function Browser() {
      this.windows = [];
      this.initialize();
      this.addEventHandlers();
    }

    Browser.prototype.initialize = function() {
      var _this = this;
      return chrome.windows.getAll({
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
          return _this.addWindow(window);
        });
      });
    };

    Browser.prototype.addEventHandlers = function() {
      var _this = this;
      chrome.windows.onCreated.addListener(function(chromeWindow) {
        return _this.addWindow(new Window(chromeWindow));
      });
      chrome.tabs.onCreated.addListener(function(chromeTab) {
        var window;
        window = _this.getWindowById(chromeTab.windowId);
        return window.addTab(new Tab(chromeTab));
      });
      chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
        var tab;
        tab = _this.getTabById(tabId);
        return tab.window.removeTab(tab);
      });
      chrome.tabs.onSelectionChanged.addListener(function(tabId) {
        var tab;
        tab = _this.getTabById(tabId);
        return tab.updateLastAccess();
      });
      return chrome.tabs.onAttached.addListener(function(tabId, attachInfo) {
        var window;
        window = _this.getWindowById(attachInfo.newWindowId);
        return window.addTab(_this.getTabById(tabId));
      });
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

    return Browser;

  })();

  browser = new Browser;

  Window = (function() {

    function Window(chromeWindow) {
      this.chromeWindow = chromeWindow;
      this.tabs = [];
    }

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
          if (tab.lastAccess < candidate.lastAccess) {
            return candidate = tab;
          }
        });
        return this.closeTab(candidate);
      }
    };

    return Window;

  })();

  Tab = (function() {

    function Tab(chromeTab) {
      this.chromeTab = chromeTab;
      this.window = null;
      this.updateLastAccess();
    }

    Tab.prototype.setWindow = function(window) {
      if (this.window) {
        this.window.removeTab(this);
      }
      return this.window = window;
    };

    Tab.prototype.updateLastAccess = function() {
      return this.lastAccess = new Date().getTime();
    };

    return Tab;

  })();

}).call(this);