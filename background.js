(function() {
  var Browser, Tab, Window;
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
}).call(this);
