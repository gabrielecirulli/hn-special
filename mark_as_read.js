HNSpecial.settings.registerModule("mark_as_read", function () {
  function editLinks() {
    var titles = _.toArray(document.getElementsByClassName("title"));

    titles.forEach(function (title) {
      if (!title.getAttribute("data-hnspecial-mark-as-read") && title.children.length > 0 && title.children[0].nodeName == "A") {
        title.setAttribute("data-hnspecial-mark-as-read", "true");

        // Create the Mark as read "button"
        var button = _.createElement("span", {
          classes: ["hnspecial-mark-as-read-button"],
          content: "&#10004;" // tick symbol
        });

        // Add the click listener
        button.addEventListener("click", function (e) {
          chrome.extension.sendRequest({
            module: "mark_as_read",
            action: "toggle",
            params: {
              url: e.target.parentElement.children[1].href
            }
          });
        });

        // Insert the button into the page
        title.insertBefore(button, title.children[0]);
      }
    });
  }

  // Run it
  editLinks();

  // Subscribe to the event emitted when new links are present
  HNSpecial.settings.subscribe("new links", editLinks);
});
