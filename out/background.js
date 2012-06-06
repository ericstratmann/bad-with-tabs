// Generated by CoffeeScript 1.3.3
(function() {
  var Browser, Policy, Tab, Window, browser,
    __hasProp = {}.hasOwnProperty;

  Object.prototype.find = function(f) {
    var k, v;
    for (k in this) {
      if (!__hasProp.call(this, k)) continue;
      v = this[k];
      if (f(v)) {
        return v;
      }
    }
  };

  Policy = (function() {

    function Policy() {
      this.maxTabs = 5;
    }

    Policy.prototype.tabToClose = function(tabs) {
      var candidate, id, keys, tab;
      keys = Object.keys(tabs);
      if (keys.length > this.maxTabs) {
        candidate = tabs[keys[0]];
        for (id in tabs) {
          if (!__hasProp.call(tabs, id)) continue;
          tab = tabs[id];
          if (tab.lastAccess < candidate.lastAccess) {
            candidate = tab;
          }
        }
      }
      return candidate;
    };

    return Policy;

  })();

  Browser = (function() {

    function Browser() {
      this.windows = {};
      this.initialize();
      this.addEventHandlers();
      this.policy = new Policy();
    }

    Browser.prototype.initialize = function() {
      var _this = this;
      return chrome.windows.getAll({
        populate: true
      }, function(chromeWindows) {
        var chromeTab, chromeWindow, tab, window, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = chromeWindows.length; _i < _len; _i++) {
          chromeWindow = chromeWindows[_i];
          window = new Window(chromeWindow);
          _this.addWindow(window);
          _results.push((function() {
            var _j, _len1, _ref, _results1;
            _ref = chromeWindow.tabs;
            _results1 = [];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              chromeTab = _ref[_j];
              tab = new Tab(chromeTab);
              _results1.push(window.addTab(tab));
            }
            return _results1;
          })());
        }
        return _results;
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
      this.windows[window.id] = window;
      return window.setBrowser(this);
    };

    Browser.prototype.removeWindow = function(window) {
      return this.windows.remove(this.windows.indexOf(window));
    };

    Browser.prototype.getWindowById = function(id) {
      return this.windows.find(function(window) {
        return window.id === id;
      });
    };

    Browser.prototype.getTabById = function(id) {
      var window;
      window = this.windows.find(function(window) {
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
      this.id = chromeWindow.id;
      this.tabs = {};
    }

    Window.prototype.setBrowser = function(browser) {
      return this.browser = browser;
    };

    Window.prototype.addTab = function(tab) {
      this.tabs[tab.id] = tab;
      tab.setWindow(this);
      return this.closeTabIfNecessary();
    };

    Window.prototype.removeTab = function(tab) {
      return delete this.tabs[tab.id];
    };

    Window.prototype.closeTab = function(tab) {
      return chrome.tabs.remove(tab.id);
    };

    Window.prototype.getTabById = function(id) {
      return this.tabs.find(function(tab) {
        return tab.id === id;
      });
    };

    Window.prototype.closeTabIfNecessary = function() {
      var tab;
      tab = this.browser.policy.tabToClose(this.tabs);
      if (tab) {
        return this.closeTab(tab);
      }
    };

    return Window;

  })();

  Tab = (function() {

    function Tab(chromeTab) {
      this.chromeTab = chromeTab;
      this.id = chromeTab.id;
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
