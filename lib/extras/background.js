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
        chrome.history.getVisits(params, function (results) {
          if (results.length > 0) {
            self.delete(params);
          } else {
            self.add(params);
          }
        });
      },
      delete: function (params) {
        chrome.history.deleteUrl(params);
      },
      add: function (params) {
        chrome.history.addUrl(params);
      }
    },
    save_for_later: {
      toggle: function(params, callback) {
        chrome.storage.local.get('saved', function(result) {
            var saved = result.saved;
            if(!Array.isArray(saved)) saved = [];
            if(saved.indexOf(params.postId) < 0) saved.push({
                title: params.title,
                id: params.postId
            });
            else saved.splice(saved.indexOf(params.postId), 1);
            chrome.storage.local.set({'saved': saved}, callback);
        });
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
