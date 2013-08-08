/**
 * Called when a message is passed from the extension.
 *
 * Since we don't have direct access to the chrome.history object in our
 * content scripts, we use a background script with a listener.
 *
 * This listener looks for messages from the mark_as_read module, and ignores
 * all others.
 */
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    if (request.module == "mark_as_read" && request.action == "toggle") {
        // Test if we've visited this url before
        chrome.history.getVisits(request.params, function (results) {
            if (results.length > 0) {
                // Remove the url from the browser history
                chrome.history.deleteUrl(request.params);
            } else {
                // Add the url to the browser history
                chrome.history.addUrl(request.params);
            }
        });
    }

    // Return null to let the connection be cleaned up.
    sendResponse({});
});
