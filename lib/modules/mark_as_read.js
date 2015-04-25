HNSpecial.settings.registerModule("mark_as_read", function () {
  var urls = [];

  function editLinks() {
    var subtexts = _.toArray(document.getElementsByClassName("subtext"));

    subtexts.forEach(function (subtext) {
      if (!subtext.getAttribute("data-hnspecial-mark-as-read")) {
        subtext.setAttribute("data-hnspecial-mark-as-read", "true");

        // Create the Mark as read button
        var button = _.createElement("button", {
          classes: ["hnspecial-mark-as-read-button"],
          content: "&#10004;" // tick symbol
        });

        // Well, that escalated quickly
        var url = subtext.parentElement.previousSibling.lastChild.querySelector(".title a").href;
        urls.push(url);

        // Add the click listener
        button.addEventListener("click", function () {
          console.log("hey", url, typeof url);
          _.sendMessage("mark_as_read#toggle", { url: url });
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

  // Build the "mark all as read" button
  if (_.isListingPage()) {
    var header = _.$("body > center > table > tbody")[0].firstChild.firstChild;
    var container = _.createElement("div", {
      classes: ["hnspecial-mark-all-as-read-container"],
      content: "Mark all as:"
    });
    var readButton = _.createElement("button", {
      classes: ["hnspecial-mark-all-as-read-button"],
      content: "read"
    });
    var unreadButton = _.createElement("button", {
      classes: ["hnspecial-mark-all-as-unread-button"],
      content: "not read"
    });

    function buttonListener(e) {
      var action = e.target === readButton ? "add" : "delete";
      var target = "mark_as_read#" + action;
      urls.forEach(function (url) {
        _.sendMessage(target, { url: url });
      });
    }

    readButton.addEventListener("click", buttonListener);
    unreadButton.addEventListener("click", buttonListener);

    container.appendChild(readButton);
    container.appendChild(unreadButton);
    header.appendChild(container);

    HNSpecial.settings.emit("mark as read added");
  }
});
