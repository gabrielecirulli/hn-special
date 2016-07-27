function BrowserAbstraction() {
  this.firefoxOptions = self.options;
}

BrowserAbstraction.prototype.getUrl = function (name) {
  return HNSpecial.isChrome ?
    chrome.runtime.getURL( name ) :
    this.firefoxOptions.urlBase + name;
};

BrowserAbstraction.prototype.getDefaultOptions = function (cb) {
  return HNSpecial.isChrome ?
    _.request( HNSpecial.browser.getUrl("lib/defaults.json"), "GET", cb ) :
    cb(this.firefoxOptions.defaultOptions);
};

(function () {
  this.HNSpecial = {};

  if (this.chrome !== undefined) {
    this.HNSpecial.isChrome = true;
  }

  this.HNSpecial.browser = new BrowserAbstraction();
}).call(this);
