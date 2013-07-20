function Settings() {
  var self = this;

  this.loaded = false;
  this.moduleQueue = [];

  // Load the settings
  _.request(chrome.extension.getURL("defaults.json"), "GET", function (code) {
    var defaults = JSON.parse(code);
    self.defaults = JSON.parse(localStorage.getItem("hnspecial-defaults")); // Used when the version changes
    self.version = parseInt(localStorage.getItem("hnspecial-settings-version"));

    self.currentSettings = JSON.parse(localStorage.getItem("hnspecial-settings"));

    if (isNaN(self.version)) {
      self.version = defaults.version;
      self.defaults = defaults.settings;
      self.currentSettings = _.clone(self.defaults);
    } else if (self.version < defaults.version) {
      self.version = defaults.version;
      var currentKeys = Object.keys(self.currentSettings);
      for (var key in defaults.settings) {
        if (currentKeys.indexOf(key) === -1) {
          self.currentSettings[key] = defaults.settings[key];
        }
      }
      self.defaults = defaults.settings;
    }

    self.save();

    // Build the menu and launch the rest of the modules when the DOM is ready
    _.load(function () {
      self.buildMenu();
      self.loaded = true;
      self.moduleQueue.forEach(function (module) {
        self.runModule(module);
      });
    });    
  });
}

Settings.prototype.save = function () {
  localStorage.setItem("hnspecial-defaults", JSON.stringify(this.defaults));
  localStorage.setItem("hnspecial-settings-version", this.version);
  localStorage.setItem("hnspecial-settings", JSON.stringify(this.currentSettings));
};

Settings.prototype.registerModule = function (key, callback) {
  var module = { key: key, callback: callback };

  if (!this.loaded) {
    this.moduleQueue.push(module);
  } else {
    this.runModule(module);
  }
};

Settings.prototype.runModule = function (module) {
  if (this.currentSettings[module.key]) module.callback();
};

Settings.prototype.buildMenu = function (container) {
  var self = this;
  var container = _.$(".pagetop")[1];

  if (container) {
    var items = this.buildMenuFrame(container);

    // Build the settings items
    var keys = Object.keys(this.currentSettings);

    keys.forEach(function (key) {
      items.inner.appendChild(self.makeSettingsBlock(key, self.currentSettings[key]));
    });

    // Apply button
    var apply = _.createElement("input", {
      classes: ["hnspecial-settings-submit-button"],
      attributes: {
        value: "Apply changes",
        type: "submit"
      }
    });
    apply.addEventListener("click", function () {
      self.updateSettings.call(self, {
        button: this,
        current: self.currentSettings,
        checkboxes: _.toArray(items.inner.getElementsByClassName("hnspecial-settings-checkbox")),
        toggle: items.toggle
      });
    });

    items.inner.appendChild(apply);

    // First time use: display the menu to the user
    if (!localStorage.getItem("hnspecial-settings-introduced")) {
      localStorage.setItem("hnspecial-settings-introduced", true);

      // Show special welcome message
      items.inner.children[1].innerHTML = "<strong>Welcome to HN Special!</strong> This is the settings panel. You can use it to enable or disable this extension's features. Make sure to apply the changes when you're done.";

      // Auto-open the menu for the first time
      // Move this to the end of the process
      setTimeout(function () {
        items.toggle.checked = true;  
      }, 1000);
    }
  }
};

Settings.prototype.buildMenuFrame = function (container) {
  container = _.replaceTag(container, "div");

  var button = _.createElement("div", {
    classes: ["hnspecial-settings-button"]
  });
  
  var toggle = _.createElement("input", {
    classes: ["hnspecial-settings-button-checkbox"],
    attributes: {
      type: "checkbox"
    }
  });
  button.appendChild(toggle);

  button.appendChild(_.createElement("img", {
    attributes: {
      src: chrome.extension.getURL("gear.svg")
    }
  }));

  var menu = _.createElement("div", {
    classes: ["hnspecial-settings-menu-container"]
  });
  
  var inner = _.createElement("div", {
    classes: ["hnspecial-settings-menu-inner"]
  });
  
  inner.appendChild(_.createElement("strong", {
    content: "HN Special — Settings"
  }));

  inner.appendChild(_.createElement("p", {
    content: "Use this menu to enable or disable features. Press Apply when you're done.",
    classes: ["hnspecial-settings-info"]
  }));

  menu.appendChild(inner);
  button.appendChild(menu);
  container.insertBefore(button, container.children[0]);

  return {
    toggle: toggle,
    inner: inner
  };
};

Settings.prototype.makeSettingsBlock = function (key, status) {
  var id = "hnspecial_" + key;

  var block = _.createElement("div", {
    classes: ["hnspecial-settings-block"],
    attributes: {
      "data-key": key
    }
  });

  block.appendChild(_.createElement("label", {
    content: _.naturalWords(key),
    classes: ["hnspecial-settings-label"],
    attributes: {
      "for": id
    }
  }));

  var checkboxContainer = _.createElement("div", {
    classes: ["hnspecial-settings-checkbox-container"]
  });

  var checkbox = _.createElement("input", {
    classes: ["hnspecial-settings-checkbox"],
    attributes: {
      id: id,
      type: "checkbox",
      "data-key": key
    }
  });
  checkbox.checked = status;
  checkboxContainer.appendChild(checkbox);

  checkboxContainer.appendChild(_.createElement("span", {
    content: "on",
    classes: ["hnspecial-settings-checkbox-indicator", "on"]
  }));

  checkboxContainer.appendChild(_.createElement("span", {
    content: "off",
    classes: ["hnspecial-settings-checkbox-indicator", "off"]
  }));

  block.appendChild(checkboxContainer);

  return block;
};

Settings.prototype.updateSettings = function (options) {
  options.checkboxes.forEach(function (checkbox) {
    var key = checkbox.getAttribute("data-key");
    options.current[key] = checkbox.checked;
  });

  this.save();

  options.button.value = "Saved. Reloading page...";

  setTimeout(function () {
    options.toggle.checked = false;
    location.reload();
  }, 500);
};

(function () {
  // Run the settings module as soon as possible
  this.HNSpecial = {};
  this.HNSpecial.settings = new Settings();  
}).call(this);
