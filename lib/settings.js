function Settings() {
  var self = this;

  this.loaded = false;
  this.moduleQueue = [];
  this.events = {};

  // Load the settings
  HNSpecial.browser.getDefaultOptions( function (code) {
    var defaults = JSON.parse(code);
    self.tips = defaults.tips;
    self.permissions = defaults.permissions;

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

    // Quick hack to hide the document before the theme is fully loaded (to avoid the ugly jump)
    // It's animated in by the visual theme
    if (self.currentSettings.visual_theme ||
        self.currentSettings.high_contrast ||
        self.currentSettings.gray_visited_links ||
        self.currentSettings.sticky_header) {
      document.documentElement.classList.add("hnspecial-theme-preload");
    }

    // Build the menu and launch the rest of the modules when the DOM is ready
    _.load(function () {
      self.buildMenu(added, defaults.requirements, defaults.permissions);
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
  if (this.moduleEnabled(module.key)) module.callback();
};

Settings.prototype.moduleEnabled = function(module) {
  return !!this.currentSettings[module];
};

Settings.prototype.subscribe = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

Settings.prototype.emit = function (event, data) {
  if (this.events[event]) {
    this.events[event].forEach(function (callback) {
      callback(data);
    });
  }
};

Settings.prototype.buildMenu = function (added, requirements, permissions) {
  var self = this;
  var pageTop = _.$(".pagetop");
  var container = pageTop[1] || pageTop[0];

  if (container) {
    var items = this.buildMenuFrame(container, !added.length);

    if (container === pageTop[0]) items.button.classList.add("hnspecial-settings-container-cell");

    // Build the settings items
    var keys = Object.keys(this.currentSettings);
    var map = {};

    keys.forEach(function (key) {
      var block = self.createSettingsBlock(key, self.currentSettings[key], added.indexOf(key) !== -1);
      map[key] = block;
      items.inner.appendChild(block);
    });

    // Apply permissions
    self.applyPermissions(permissions, map);

    // Apply requirements
    self.applyRequirements(requirements, map);

    // Apply button
    var apply = _.createElement("input", {
      classes: ["hnspecial-settings-submit-button"],
      attributes: {
        value: "Apply",
        type: "submit"
      }
    });
    apply.addEventListener("click", self.updateAndReload.bind(self));

    var reset = _.createElement("input", {
      classes: ["hnspecial-settings-cancel-button"],
      attributes: {
        value: "Cancel",
        type: "button"
      }
    });
    reset.addEventListener("click", self.cancel.bind(self));

    items.inner.appendChild(apply);
    items.inner.appendChild(reset);

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

    // Listen to events to automatically close the menu when clicking outside
    document.addEventListener("click", function (e) {
      var target = e.target;
      var position = items.inner.compareDocumentPosition(target);
      var inside = position & Node.DOCUMENT_POSITION_CONTAINED_BY || target === items.inner;

      // items.inner.compareDocumentPosition(target);
      if (!inside && items.toggle.checked && target !== items.toggle) {
        items.toggle.checked = false;
      }
    });

    // Auto-open the menu for the first time or if there's an update
    if (isFirstTime || added.length) {
      setTimeout(function () {
        items.toggle.checked = true;
      }, 1000);
    }
  }
};

Settings.prototype.buildMenuFrame = function (container, showTip) {
  var self = this;

  function randomTip () {
    return " " + _.lowerFirst(self.tips[Math.floor(Math.random() * self.tips.length)]);
  }

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
    classes: ["hnspecial-settings-button-gear-icon"],
    attributes: {
      src: HNSpecial.browser.getUrl("resources/gear.svg")
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
    var currentTip = randomTip();

    var tipContainer = _.createElement("div", {
      content: "<strong>ProTip&trade;:</strong>",
      classes: ["hnspecial-settings-tip"]
    });

    tipContainer.appendChild(_.createElement("span", {
      content: currentTip,
      classes: ["hnspecial-settings-tip-body"]
    }));

    var nextButton = _.createElement("button", {
      content: "Next tip",
      classes: ["hnspecial-settings-tip-next"]
    });
    nextButton.addEventListener("click", function () {
      var newTip;

      do {
        newTip = randomTip();
      } while (newTip === currentTip);

      currentTip = newTip;
      this.previousSibling.innerHTML = currentTip;
    });
    tipContainer.appendChild(nextButton);

    inner.appendChild(tipContainer);
  }

  menu.appendChild(inner);
  button.appendChild(menu);
  container.insertBefore(button, container.children[0]);

  return {
    button: button,
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
      "data-hnspecial-key": key
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
      "data-hnspecial-key": key
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

Settings.prototype.applyPermissions = function (permissions, map) {
  if (HNSpecial.isChrome) {
    var self = this;

    // Add permission features
    Object.keys(permissions).forEach(function (key) {
      if (map[key]) {
        var checkbox = map[key].getElementsByTagName("input")[0];
        checkbox.addEventListener("change", function (e) {
          // Add the permissions iframe to the page
          var permissionsContainer = checkbox.parentNode.parentNode;
          self.setupOptionalPermissions(permissionsContainer, key, checkbox.checked);
        });
      }
    });

    window.addEventListener("message", function(e) {
      if (e.origin.match(/^chrome-extension:\/\//) && e.data.type === "shrink") {
        var iframe = _.$("#hnspecial-permissions-" + e.data.module)[0];
        iframe.classList.add("hnspecial-permissions-iframe-small");
      }
    }, false);
  }
};

Settings.prototype.setupOptionalPermissions = function (container, moduleName, moduleActivated) {
  var self = this;

  if (HNSpecial.isChrome) {
    // Remove the iframe if it exists
    var element = document.getElementById("hnspecial-permissions-" + moduleName);
    if (element) {
      element.remove();
    }

    var complete = function () {
      // Add the iframe, passing in the module name
      var themeModifier = self.currentSettings.dark_theme ? "dark" : "light";

      var iframe = _.createElement("iframe", {
        classes: ["hnspecial-permissions-iframe"],
        attributes: {
          id: "hnspecial-permissions-" + moduleName,
          src: HNSpecial.browser.getUrl("lib/extras/permissions.html#" + moduleName + "~" + themeModifier)
        }
      });
      container.appendChild(iframe);
    };


    // Only show the iframe when turning on or off respectively with permissions disabled or enabled
    var modulePermissions = this.permissions[moduleName].permissions;

    // Check permissions
    _.sendMessage("permissions#contains", { permissions: modulePermissions }, function (isEnabled) {
      if (isEnabled !== moduleActivated) {
        complete();
      }
    });
  }
};

Settings.prototype.applyRequirements = function (requirements, map) {
  var self = this;

  Object.keys(requirements).forEach(function (key) {
    if (map[key]) {
      var subordinate = map[key].getElementsByTagName("input")[0]; // Checkbox that can't be activated if the others aren't
      var mandatory = requirements[key].map(function (requirement) { return map[requirement].getElementsByTagName("input")[0]; });

      // Preliminary check to prevent invalid conditions
      if (subordinate.checked) {
        var status = true; // Starts enabled
        mandatory.forEach(function (current) {
          status = status && current.checked; // If any mandatory switch is disabled, subordinate is disabled too
        });

        subordinate.checked = status;
        _.dispatch("change", subordinate);
        self.updateSettings();
      }

      // Add the change lisneners to propagate changes to mandatory switches
      subordinate.addEventListener("change", function () {
        if (this.checked) { // All mandatory checkboxes must be enabled too
          mandatory.forEach(function (current) {
            current.checked = true;
            _.dispatch("change", current);
          });
        }
      });

      // Add the change listeners to propagate changes to subordinate switches
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

// Buttons
Settings.prototype.cancel = function () {
  var self = this;
  var changed = 0;
  var checkboxes = _.toArray(document.getElementsByClassName("hnspecial-settings-checkbox"));
  checkboxes.forEach(function (checkbox) {
    var key = checkbox.getAttribute("data-hnspecial-key");
    var setting = self.currentSettings[key];
    changed += checkbox.checked !== setting;
    checkbox.checked = setting;
  });


  var toggle = document.getElementsByClassName("hnspecial-settings-button-checkbox")[0];
  var close = function () { toggle.checked = false; };

  if (changed) return setTimeout(close, 300);
  close();
};

Settings.prototype.updateSettings = function () {
  var self = this;
  var checkboxes = _.toArray(document.getElementsByClassName("hnspecial-settings-checkbox"));
  var remaining = checkboxes.length;

  // Save after all of the cycles have gone through
  function done() {
    if (!--remaining) { self.save(); }
  }

  checkboxes.forEach(function (checkbox) {
    var key = checkbox.getAttribute("data-hnspecial-key");

    if (self.defaults[key] !== undefined) {
      self.currentSettings[key] = checkbox.checked;
    } else {
      delete self.currentSettings[key]; // Sanity check: nuke ghost settings
    }

    if( !HNSpecial.isChrome ) {
      done();
      return;
    }

    // If a module is enabled but without the permissions, disable it
    var modulePermissions = self.permissions[key];

    if (modulePermissions !== undefined) {
      // Check permissions
      _.sendMessage("permissions#contains", { permissions: modulePermissions.permissions }, function (isEnabled) {
        if (!isEnabled) {
          self.currentSettings[key] = false;
        }

        done();
      });
    } else {
      done();
    }
  });
};

Settings.prototype.updateAndReload = function () {
  this.updateSettings();

  var button = document.getElementsByClassName("hnspecial-settings-submit-button")[0];
  var toggle = document.getElementsByClassName("hnspecial-settings-button-checkbox")[0];

  button.value = "Saved";
  setTimeout(function () {
    toggle.checked = false;
    location.reload();
  }, 500);
};

(function () {
  // Run the settings module as soon as possible
  this.HNSpecial.settings = new Settings();
}).call(this);
