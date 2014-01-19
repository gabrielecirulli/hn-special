/**
 * Called when a message is passed from the extension.
 *
 * Use this script to provide functionality that needs a background script to work.
 */

(function() {
  var modules = {
    mark_as_read: {
      toggle: function (params, end) {
        var self = this;
        chrome.history.getVisits(params, function (results) {
          if (results.length > 0) {
            self.delete(params);
          } else {
            self.add(params);
          }
        });
        end(); // Must call end to close the channel to the caller
      },
      delete: function (params, end) {
        chrome.history.deleteUrl(params);
        end(); // Must call end to close the channel to the caller
      },
      add: function (params, end) {
        chrome.history.addUrl(params);
        end(); // Must call end to close the channel to the caller
      }
    },
    permissions: {
      contains: function (params, end) {
        chrome.permissions.contains({ permissions: params.permissions }, function (isEnabled) {
          end(isEnabled); // Must call end to close the channel to the caller
        });
      },
      remove: function (params, end) {
        chrome.permissions.remove({ permissions: params.permissions }, function(isRemoved) {
          end(isRemoved);
        });
      },
      request: function (params, end) {
        chrome.permissions.request({ permissions: params.permissions }, function(isGranted) {
          end(isGranted);
        });
      },
    }
  };

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var module = modules[request.module];
    module[request.action].call(module, request.params, sendResponse);
    return true; // Keep connection alive until end (sendResponse) is called
  });
})();
