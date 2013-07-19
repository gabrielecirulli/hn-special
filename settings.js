// Settings management
load(function () {
  var container = $(".pagetop")[1];
  if (container) {
    var items = buildMenu(container);

    // The extension has never been used. Introduce it to the user.
    if (!localStorage.getItem("hnspecial-settings-initiated")) {
      localStorage.setItem("hnspecial-settings-initiated", true);

      // Show special welcome message
      items.inner.children[1].innerHTML = "<strong>Welcome to HN Special!</strong> This is the settings panel. Use it to enable or disable this extension's features. Make sure to apply the changes when you're done.";

      // Auto-open the menu for the first time
      // Move this to the end of the process
      setTimeout(function () {
        items.toggle.checked = true;  
      }, 1000);
    }

    request(chrome.extension.getURL("defaults.json"), "GET", function (code) {
      var defaults = JSON.parse(code);
      var version = parseInt(localStorage.getItem("hnspecial-settings-version"));

      console.log(typeof version);

      if (isNaN(version)) {
        // First time. Install the defaults.
        console.log("INITIAL");

        localStorage.setItem("hnspecial-settings-version", defaults.version);
        localStorage.setItem("hnspecial-settings", JSON.stringify(defaults.settings));
        localStorage.setItem("hnspecial-defaults", JSON.stringify(defaults.settings));
      } else if (version < defaults.version) {
        // New version: there are new settings in the default object
        localStorage.setItem("hnspecial-settings-version", defaults.version);
        localStorage.setItem("hnspecial-defaults", JSON.stringify(defaults.settings));
        // TODO: handle this case
      }

      // Build the settings items
      var current = JSON.parse(localStorage.getItem("hnspecial-settings"));
      var keys = Object.keys(current);
      
      keys.forEach(function (key, index) {
        var status = current[key];
        items.inner.appendChild(makeSettingsBlock(key, status));
      });

      var apply = makeElement("input", {
        classes: ["hnspecial-settings-submit-button"],
        attributes: {
          value: "Apply changes",
          type: "submit"
        }
      });
      apply.addEventListener("click", function () {
        updateSettings(current, toArray(items.inner.getElementsByClassName("hnspecial-settings-checkbox")));
      });

      items.inner.appendChild(apply);
    });  
  }
  
});

function buildMenu(container) {
  // Replace the menu container with a div
  var container = replaceTag(container, "div");

  var button = makeElement("div", {
    classes: ["hnspecial-settings-button"]
  });
  
  var toggle = makeElement("input", {
    classes: ["hnspecial-settings-button-checkbox"],
    attributes: {
      type: "checkbox"
    }
  });
  button.appendChild(toggle);

  button.appendChild(makeElement("img", {
    attributes: {
      src: chrome.extension.getURL("gear.svg")
    }
  }));

  var menu = makeElement("div", {
    classes: ["hnspecial-settings-menu-container"]
  });
  
  var inner = makeElement("div", {
    classes: ["hnspecial-settings-menu-inner"]
  });
  
  inner.appendChild(makeElement("strong", {
    content: "HN Special — Settings"
  }));

  inner.appendChild(makeElement("p", {
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
}

function makeSettingsBlock(key, status) {
  var id = "hnspecial_" + key;

  var block = makeElement("div", {
    classes: ["hnspecial-settings-block"],
    attributes: {
      "data-key": key
    }
  });

  block.appendChild(makeElement("label", {
    content: naturalWords(key),
    classes: ["hnspecial-settings-label"],
    attributes: {
      "for": id
    }
  }));

  var checkboxContainer = makeElement("div", {
    classes: ["hnspecial-settings-checkbox-container"]
  });

  var checkbox = makeElement("input", {
    classes: ["hnspecial-settings-checkbox"],
    attributes: {
      id: id,
      type: "checkbox",
      "data-key": key
    }
  });
  checkbox.checked = status;
  checkboxContainer.appendChild(checkbox);

  checkboxContainer.appendChild(makeElement("span", {
    content: "on",
    classes: ["hnspecial-settings-checkbox-indicator", "on"]
  }));

  checkboxContainer.appendChild(makeElement("span", {
    content: "off",
    classes: ["hnspecial-settings-checkbox-indicator", "off"]
  }));

  block.appendChild(checkboxContainer);

  return block;
}

function updateSettings(current, checkboxes) {
  console.log(current);
  checkboxes.forEach(function (checkbox) {
    var key = checkbox.getAttribute("data-key");
    current[key] = checkbox.checked;
  });

  localStorage.setItem("hnspecial-settings", JSON.stringify(current));
  location.reload();
}
