function Settings() {
  var self = this;

  this.loaded = false;
  this.moduleQueue = [];
  this.events = {};

  // Load the settings
  _.request(chrome.extension.getURL("defaults.json"), "GET", function (code) {
    var defaults = JSON.parse(code);
    self.tips = defaults.tips;

    self.defaults = JSON.parse(localStorage.getItem("hnspecial-defaults")); // Used when the version changes
    self.version = parseInt(localStorage.getItem("hnspecial-settings-version"));

    self.currentSettings = JSON.parse(localStorage.getItem("hnspecial-settings"));

    var added = []; // Tracks which features have been added in a settings version

    if (isNaN(self.version)) {
      self.version = defaults.settings_version;
      self.defaults = defaults.settings;
      self.currentSettings = _.clone(self.defaults);
    } else if (self.version < defaults.settings_version) {
      self.version = defaults.settings_version;

      // Rebuild the settings object from the defaults (respects the ordering)
      var old = self.currentSettings;
      self.defaults = defaults.settings;
      self.currentSettings = _.clone(self.defaults);
      added = Object.keys(self.currentSettings);

      for (var key in self.currentSettings) {
        if (old[key] !== undefined) {
          self.currentSettings[key] = old[key];
          added.splice(added.indexOf(key), 1); // Remove existing features from added
        }
      }
    }

    self.save();

    // Build the menu and launch the rest of the modules when the DOM is ready
    _.load(function () {
      self.buildMenu(added, defaults.requirements);
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

Settings.prototype.subscribe = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

Settings.prototype.emit = function (event) {
  if (this.events[event]) {
    this.events[event].forEach(function (callback) {
      callback();
    });
  }
};

Settings.prototype.buildMenu = function (added, requirements) {
  var self = this;
  var container = _.$(".pagetop")[1];

  if (container) {
    var items = this.buildMenuFrame(container, !added.length);

    // Build the settings items
    var keys = Object.keys(this.currentSettings);
    var map = {};

    keys.forEach(function (key) {
      var block = self.createSettingsBlock(key, self.currentSettings[key], added.indexOf(key) !== -1);
      map[key] = block;
      items.inner.appendChild(block);
    });

    // Apply requirements
    self.applyRequirements(requirements, map);

    // Apply button
    var apply = _.createElement("input", {
      classes: ["hnspecial-settings-submit-button"],
      attributes: {
        value: "Apply changes",
        type: "submit"
      }
    });
    apply.addEventListener("click", self.updateAndReload.bind(self));

    items.inner.appendChild(apply);

    // First time use: display the menu to the user
    var isFirstTime = !localStorage.getItem("hnspecial-settings-introduced");

    if (isFirstTime) {
      localStorage.setItem("hnspecial-settings-introduced", true);

      // Insert welcome message
      items.inner.children[1].innerHTML = "<strong>Welcome to HN Special!</strong> This is the settings panel. You can use it to enable or disable this extension's features. Make sure to apply the changes when you're done.";
    }

    var wrap = function (feature) {
      return "<strong>" + _.naturalWords(feature) + "</strong>";
    };

    if (added.length) {
      var count = added.length === 1 ? "<strong>a new feature</strong> has been added" : "<strong>" + added.length + " new features</strong> have been added";
      var list = added.length === 1 ? wrap(added[0]) : added.slice(0, -1).map(function (feature) { return wrap(feature); }).join(", ") + " and " + wrap(added.slice(-1)[0]);

      items.inner.children[1].innerHTML = "<strong>Hey there!</strong> This is a quick notification to let you know that " + count + ": " + list + ".";
    }

    // Auto-open the menu for the first time or if there's an update
    if (isFirstTime || added.length) {
      setTimeout(function () {
        items.toggle.checked = true;  
      }, 1000);
    }      
  }
};

Settings.prototype.buildMenuFrame = function (container, showTip) {
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

  if (showTip) {
    inner.appendChild(_.createElement("p", {
      content: "<strong>Tip:</strong> " + _.lowerFirst(this.tips[Math.floor(Math.random() * this.tips.length)]),
      classes: ["hnspecial-settings-tip"]
    }));  
  }  

  menu.appendChild(inner);
  button.appendChild(menu);
  container.insertBefore(button, container.children[0]);

  return {
    toggle: toggle,
    inner: inner
  };
};

Settings.prototype.createSettingsBlock = function (key, status, flash) {
  var id = "hnspecial_" + key;

  var classes = ["hnspecial-settings-block"];
  if (flash) classes.push("hnspecial-settings-flash");
  var block = _.createElement("div", {
    classes: classes,
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

Settings.prototype.applyRequirements = function(requirements, map) {
  var self = this;
  Object.keys(requirements).forEach(function (key) {
    if (map[key]) {
      var subordinate = map[key].getElementsByTagName("input")[0]; // Checkbox that can't be activated if the others aren't
      var mandatory = requirements[key].map(function (requirement) { return map[requirement].getElementsByTagName("input")[0]; });

      // Preliminary check (to prevent invalid conditions)
      if (subordinate.checked) {
        var enabled = true;
        mandatory.forEach(function (current) {
          enabled = enabled && current.checked; // If any mandatory switch is disabled, subordinate is disabled too
        });

        subordinate.checked = enabled;
        _.dispatch("change", subordinate);
        self.updateSettings();
      }

      subordinate.addEventListener("change", function () {
        if (this.checked) { // All mandatory checkboxes must be enabled too
          mandatory.forEach(function (current) {
            current.checked = true;
            _.dispatch("change", current);
          });
        }
      });

      mandatory.forEach(function (current) {
        current.addEventListener("change", function () {
          if (!this.checked) {
            subordinate.checked = false;
            _.dispatch("change", subordinate);
          }
        });
      });     
    }
  });
};

Settings.prototype.updateSettings = function () {
  var self = this;
  var checkboxes = _.toArray(document.getElementsByClassName("hnspecial-settings-checkbox"));

  checkboxes.forEach(function (checkbox) {
    var key = checkbox.getAttribute("data-key");
    self.currentSettings[key] = checkbox.checked;
  });

  this.save();
};

Settings.prototype.updateAndReload = function () {
  this.updateSettings();

  var button = document.getElementsByClassName("hnspecial-settings-submit-button")[0];
  var toggle = document.getElementsByClassName("hnspecial-settings-button-checkbox")[0];

  button.value = "Saved. Reloading page...";
  setTimeout(function () {
    toggle.checked = false;
    location.reload();
  }, 500);
};

(function () {
  // Run the settings module as soon as possible
  this.HNSpecial = {};
  this.HNSpecial.settings = new Settings();  
}).call(this);
