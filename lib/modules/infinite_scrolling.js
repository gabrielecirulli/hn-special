// The code in this module is ugly. It could use a rewrite.

HNSpecial.settings.registerModule("infinite_scrolling", function () {
  function getThreshold() {
    return window.scrollY + button.getBoundingClientRect().bottom + 50; // getBoundingClientRect returns coordinates relative to the viewport
  }

  function getButton(context) {
    return _.$("td.title > a[href^='/x'], td.title > a[href^='news2']", context)[0];
  }

  function replaceButton(message) {
    button.textContent = message;
    button.nextSibling.remove(); // Remove the pause button
    _.replaceTag(button, "span");
    disabled = true;
  }

  function pauseLoading(e) {
    if (e) e.preventDefault();
    disabled = !disabled;
    pause.textContent = labels[disabled ? 1 : 0];
    checkScroll();
  }

  function checkScroll() {
    if (!disabled && window.scrollY + window.innerHeight > threshold) {
      loadLinks();

      nextLoads = loads - 3;

      if (loads === 1) {
        if (!notice) {
          var elem = _.createElement("div", {
            classes: ["hnspecial-infinite-search-notice"],
            content: "Please keep scrolling if you want to access the search field and the footer. <span>(click to close)</span>"
          });
          elem.addEventListener("click", function () { this.classList.add("hnspecial-infinite-search-notice-hidden"); });
          document.body.appendChild(elem);
          notice = true;
        }
      } else if (loads === 3 || (nextLoads > 0 && nextLoads % 5 === 0)) {
        pauseLoading();

        setTimeout(function () {
          // Remove the notice
          var elem = document.getElementsByClassName("hnspecial-infinite-search-notice")[0];
          if (elem) {
            elem.classList.add("hnspecial-infinite-search-notice-hidden");
          }
        }, 1000);
      }
    }
  }

  function loadLinks() {
    if (loading) return;
    loading = true;
    loads++;

    var label = button.textContent;
    button.textContent = "Loading more items...";

    var last = button.parentElement.parentElement.previousSibling;
    var container = last.parentElement;
    var url = button.getAttribute("href");

    _.request(url, "GET", function (page) {
      var dummy = _.createElement("div");
      dummy.innerHTML = page;

      if (dummy.getElementsByClassName("title").length) {
        // Create a separator
        var separator = _.createElement("tr", {
          classes: ["hnspecial-infinite-scroll-separator"]
        });
        var cell = _.createElement("td", {
          attributes: {
            colspan: 3
          }
        });

        cell.appendChild(_.createElement("span", {
          content: "Page " + (loads + 1)
        }));
        separator.appendChild(cell);
        container.insertBefore(separator, last);

        // Add in the rows
        var additions = [];

        _.toArray(dummy.getElementsByTagName("a")).forEach(function (link) {
          if (_.isTitleLink(link)) {
            var row = link.parentElement.parentElement;
            var sub = row.nextSibling;
            var empty = sub.nextSibling;

            container.insertBefore(row, last);
            container.insertBefore(sub, last);
            container.insertBefore(empty, last);

            additions.push(row, sub, empty);
          }
        });

        var newButton = getButton(dummy);

        if (newButton) {
          button.textContent = label;
          button.setAttribute("href", newButton.getAttribute("href"));
          threshold = getThreshold();
        } else {
          replaceButton("No more links to load.");
        }

        loading = false;
        HNSpecial.settings.emit("new links", additions); // Notify other modules about the presence of new links

      } else {
        replaceButton("Couldn't load the page. Please try refreshing.");
      }
    });
  }

  // Set up the thing
  var button = getButton();

  if (_.isListingPage() && button) {
    var threshold = getThreshold();

    var loading = false;
    var loads = 0;
    var nextLoads;
    var disabled = false;
    var notice = false;

    var labels = ["Pause infinite scrolling", "Resume infinite scrolling"];

    var pause = _.createElement("a", {
      content: labels[0],
      classes: ["hnspecial-infinite-pause"],
      attributes: {
        "href": "#"
      }
    });
    pause.addEventListener("click", pauseLoading);
    button.parentElement.appendChild(pause);

    button.addEventListener("click", function (e) {
      e.preventDefault();
      loadLinks();
    });

    document.addEventListener("scroll", checkScroll);
  }
});
