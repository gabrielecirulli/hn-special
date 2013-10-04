_.load(function () {
    // The module name
    var moduleName = null;

    // The optional permissions for this module
    var modulePermissions = [];

    // The description of the optional permissions
    var modulePermissionsDescription = null;

    // Are the permissions for this module enabled?
    var isPermissionsEnabled = false;

    // Lookup the state of the history permission
    var lookupPermissions = function () {
        chrome.permissions.contains({permissions: modulePermissions}, function (isEnabled) {
            isPermissionsEnabled = isEnabled;

            document.querySelector('.permissions-state-inverse').innerHTML = (isEnabled ? 'Disable' : 'Enable');
            document.querySelector('.permissions-description').innerHTML = modulePermissionsDescription;
        });
    };

    // Toggle the history permission
    var togglePermission = function(e) {
        if (isPermissionsEnabled) {
            chrome.permissions.remove({ permissions: ['history'] }, function(isRemoved) {
                if (isRemoved) {
                    // The permissions have been removed.
                    console.log("The permissions have been removed.");
                } else {
                    // The permissions have not been removed (e.g., you tried to remove required permissions).
                    console.log("The permissions have not been removed (e.g., you tried to remove required permissions).");
                }

                lookupPermissions();
            });
        } else {
            chrome.permissions.request({permissions: ['history']}, function (isGranted) {
                if (isGranted) {
                    // The permissions have been granted
                    console.log('The permissions have been granted');
                } else {
                    // The permissions have not been granted
                    console.log('The permissions have not been granted');
                }

                lookupPermissions();
            });
        }
    };

    // Bind the events to the toggle button
    document.querySelector('#toggle-permissions').addEventListener('click', togglePermission);

    // Get the optional permissions details for this module
    _.request('/lib/defaults.json', 'get', function (results) {
        var defaultsJson = JSON.parse(results);

        // What module are we requesting optional permissions for?
        moduleName = window.location.hash.replace(/^#/, '');

        if (defaultsJson.permissions[moduleName] !== undefined) {
            modulePermissions = defaultsJson.permissions[moduleName].permissions;
            modulePermissionsDescription = defaultsJson.permissions[moduleName].description;

            lookupPermissions();
        } else {
            throw "Could not find optional permissions for \"" + moduleName + "\" module";
        }
    });
});
