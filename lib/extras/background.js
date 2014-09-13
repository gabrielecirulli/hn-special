/**
 * Called when a message is passed from the extension.
 *
 * Use this script to provide functionality that needs a background script to work.
 */

(function() {
  var modules = {
    mark_as_read: {
      toggle: function (params) {
        var self = this;

        if (HNSpecial.isChrome)
        {
          chrome.history.getVisits(params, function (results) {
            if (results.length > 0) {
              self.delete(params);
            } else {
              self.add(params);
            }
          });
        }
        else
        {
          let { search } = require("sdk/places/history");
          search(
            params
          ).on("end", function (results) {
            if (results.length > 0) {
              self.delete(params);
            } else {
              self.add(params);
            }
          });
        }
      },
      delete: function (params) {
        HNSpecial.isChrome
        ? chrome.history.deleteUrl(params);
        : Components.classes["@mozilla.org/browser/nav-history-service;1"]
          .getService(Components.interfaces.nsIBrowserHistory).removePage(params);

      },
      add: function (params) {
        HNSpecial.isChrome
        ? chrome.history.addUrl(params);
        : Components.classes["@mozilla.org/browser/nav-history-service;1"]
          .getService(Components.interfaces.nsINavHistoryService).markPageAsFollowedLink(params);
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
    var canRespond = sendResponse !== undefined;

    var end = function (response) {
      if (canRespond) { sendResponse(response); }
    };

    module[request.action].call(module, request.params, end);
    if (canRespond) { return true; } // Keep connection alive until end (sendResponse) is called if required
  });
})();
