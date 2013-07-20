HNSpecial.settings.registerModule("infinite_scrolling", function () {
  // document.height
  // window.innerHeight + window.scrollY

  var button = getButton();
  var threshold = getThreshold();

  var loading = false;

  document.addEventListener("scroll", function () {
    if (!loading && window.scrollY + window.innerHeight > threshold) {
      console.log("Load");
      loadLinks();
    }
  });

  function getThreshold() {
    return button.getBoundingClientRect().bottom + 30;
  }

  function getButton(context) {
    return _.$("a[href^='/x']", context)[0];
  }

  function loadLinks() {
    loading = true;

    var label = button.textContent;
    button.textContent = "Loading more items...";

    var last = button.parentElement.parentElement.previousSibling;
    var container = last.parentElement;
    var url = button.getAttribute("href");
    
    console.log("Loading " + url);
    _.request(url, "GET", function (page) {
      var dummy = _.createElement("div");
      dummy.innerHTML = page;
      _.toArray(dummy.getElementsByTagName("a")).forEach(function (link) {
        if (_.isLink(link)) {
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
      console.log(getThreshold());

      loading = false;
    });
  }
});
