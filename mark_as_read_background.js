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
        this.is_visited(params, function (visited) {
          if (visited) {
            self.delete(params);
          } else {
            self.add(params);
          }
        });
      },
      is_visited: function (params, callback) {
        chrome.history.getVisits(params, function (results)) {
          callback(results.length > 0);
        }
      },
      delete: function (params) {
        chrome.history.deleteUrl(params);
      },
      add: function (params) {
        chrome.history.addUrl(params);
      }
    }
  };

  chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    var module = modules[request.module];
    var ret = module[request.action].call(module, request.params);

    // Return to let the connection be cleaned up even if there's no response to send.
    sendResponse(ret || {});
  });
})();

