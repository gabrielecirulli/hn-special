HNSpecial.settings.registerModule("infinite_scrolling", function () {
  // document.height
  // window.innerHeight + window.scrollY
  var button = getButton();

  if (_.isListingPage() && button) {
    var threshold = getThreshold();

    var loading = false;
    var disabled = false;

    var labels = ["Pause infinite scrolling", "Resume infinite scrolling"];

    var pause = _.createElement("a", {
      content: labels[0],
      classes: ["hnspecial-infinite-pause"],
      attributes: {
        "href": "#"
      }
    });
    pause.addEventListener("click", function (e) {
      e.preventDefault();
      disabled = !disabled;
      pause.textContent = labels[disabled ? 1 : 0];
      checkScroll();
    });
    button.parentElement.appendChild(pause);

    button.addEventListener("click", function (e) {
      e.preventDefault();
      loadLinks();
    });

    document.addEventListener("scroll", checkScroll);

    function getThreshold() {
      return window.scrollY + button.getBoundingClientRect().bottom + 50; // getBoundingClientRect returns coordinates relative to the viewport
    }

    function getButton(context) {
      return _.$("a[href^='/x']", context)[0];
    }

    function checkScroll() {
      if (!disabled && window.scrollY + window.innerHeight > threshold) {
        loadLinks();
      }
    }

    function loadLinks() {
      if (loading) return;
      loading = true;

      var label = button.textContent;
      button.textContent = "Loading more items...";

      var last = button.parentElement.parentElement.previousSibling;
      var container = last.parentElement;
      var url = button.getAttribute("href");

      _.request(url, "GET", function (page) {
        var dummy = _.createElement("div");
        dummy.innerHTML = page;
        _.toArray(dummy.getElementsByTagName("a")).forEach(function (link) {
          if (_.isTitleLink(link)) {
            var row = link.parentElement.parentElement;
            var sub = row.nextSibling;
            var empty = sub.nextSibling;

            container.insertBefore(row, last);
            container.insertBefore(sub, last);
            container.insertBefore(empty, last);
          }
        });

        var newButton = getButton(dummy);

        button.textContent = label;
        button.setAttribute("href", newButton.getAttribute("href"));
        threshold = getThreshold();
        loading = false;
        HNSpecial.settings.emit("new links"); // Notify other modules about the presence of new links
      });
    }
  }
});
