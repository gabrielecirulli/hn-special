HNSpecial.settings.registerModule("mark_as_read", function () {
  function editLinks() {
    var subtexts = _.toArray(document.getElementsByClassName("subtext"));

    subtexts.forEach(function (subtext) {
      if (!subtext.getAttribute("data-hnspecial-mark-as-read")) {
        subtext.setAttribute("data-hnspecial-mark-as-read", "true");

        // Create the Mark as read "button"
        var button = _.createElement("span", {
          classes: ["hnspecial-mark-as-read-button"],
          content: "&#10004;" // tick symbol
        });

        // Add the click listener
        button.addEventListener("click", function (e) {
          // Well, that escalated quickly
          var url = e.target.parentElement.parentElement.previousSibling.childNodes[2].children[0].href;

          chrome.extension.sendRequest({
            module: "mark_as_read",
            action: "toggle",
            params: {
              url: url
            }
          });
        });

        // Insert the button into the page
        subtext.insertBefore(button, subtext.childNodes[0]);
      }
    });
  }

  // Run it
  editLinks();

  // Subscribe to the event emitted when new links are present
  HNSpecial.settings.subscribe("new links", editLinks);
});
