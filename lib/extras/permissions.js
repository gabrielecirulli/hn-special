_.load(function () {
  var moduleName = null;                   // The module name
  var modulePermissions = null;            // The optional permissions for this module
  var modulePermissionsDescription = null; // The description of the optional permissions
  var isPermissionsEnabled = false;        // Are the permissions for this module enabled?

  // Lookup the state of the current permission
  var checkPermissionState = function () {
    chrome.permissions.contains({ permissions: modulePermissions }, function (isEnabled) {
      isPermissionsEnabled = isEnabled;

      document.querySelector(".permissions-state-inverse").innerHTML = (isEnabled ? "Disable" : "Enable");
      document.querySelector(".permissions-description").innerHTML = modulePermissionsDescription;
    });
  };

  // Toggle the current permission
  var togglePermission = function(e) {
    if (isPermissionsEnabled) {
      chrome.permissions.remove({ permissions: modulePermissions }, function(isRemoved) {
        if (isRemoved) {
          // The permissions have been removed.
          console.log("The permissions have been removed.");
        } else {
          // The permissions have not been removed (e.g., you tried to remove required permissions).
          console.log("The permissions have not been removed (e.g., you tried to remove required permissions).");
        }
      });
    } else {
      chrome.permissions.request({ permissions: modulePermissions }, function (isGranted) {
        if (isGranted) {
          // The permissions have been granted
          console.log("The permissions have been granted");
        } else {
          // The permissions have not been granted
          console.log("The permissions have not been granted");
        }
      });
    }

    checkPermissionState();
  };

  // Bind the events to the toggle button
  document.querySelector("#toggle-permissions").addEventListener("click", togglePermission);

  // Get the optional permissions details for this module
  _.request("/lib/defaults.json", "get", function (results) {
    var permissions = JSON.parse(results).permissions;

    // What module are we requesting optional permissions for?
    moduleName = window.location.hash.replace(/^#/, "");

    if (permissions[moduleName] !== undefined) {
      modulePermissions = permissions[moduleName].permissions;
      modulePermissionsDescription = permissions[moduleName].description;

      checkPermissionState();
    } else {
      throw "Could not find optional permissions for \"" + moduleName + "\" module";
    }
  });
});
