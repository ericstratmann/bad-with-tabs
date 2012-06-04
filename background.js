(function() {
  var Browser, Tab, Window, browser;
  Browser = function() {
    this.windows = [];
    return this;
  };
  Browser.prototype.addWindow = function(window) {
    return this.windows.push(window);
  };
  Window = function(chromeWindow) {
    this.chromeWindow = chromeWindow;
    this.tabs = [];
    return this;
  };
  Window.prototype.addTab = function(tab) {
    return this.tabs.push(tab);
  };
  Tab = function(chromeTab) {
    this.chromeTab = chromeTab;
    return this;
  };
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
