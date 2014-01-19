HNSpecial.settings.registerModule("user_tooltips", function () {
  var container;
  var timeout;
  var request;
  var tooltip;
  var cache = {};

  function remove(){
    clearTimeout(timeout);

    if (request) {
      request.abort();
      request = null;
    }

    if (container) {
      container.remove();
      container = null;
      tooltip = null;
    }
  }

  window.addEventListener("scroll", remove);

  _.$('a[href^="user?id="]').forEach(function (link) {
    var href = link.href;

    function offset(key) {
      // Walk up link parent tree and increment offset
      var elem = link;
      var num = 0;
      do {
        if (!isNaN(elem[key])) {
          num += elem[key];
        }
      } while(elem = elem.offsetParent);
      return num;
    }

    function display(page) {
      // Create dummy element so we can query it
      var dummy = _.createElement("div");
      dummy.innerHTML = page;

      tooltip.innerHTML = "";
      container.classList.add("hn-special-tooltip-loaded");

      _.$("td[valign=top]", dummy).forEach(function (td) {
        var key = td.textContent.slice(0, -1); // Remove trailing colon

        var valField = td.parentNode.children[1];

        // Sanitize contents of the about section or similar
        _.$("font", valField).forEach(function (elem) { elem.remove(); }); // Clear out unwanted elements

        var val = "";

        // Gather the text from the children elements in the <td>, adding newlines as needed
        _.toArray(valField.childNodes).forEach(function (node) {
          if (node.nodeType === 1) {
            var nodeName = node.nodeName.toLowerCase();
            if (nodeName === "p") {
              val += node.textContent + "\n";
            } else {
              if (nodeName !== "select") {
                val += node.textContent;
              }
            }
          } else if (node.nodeType === 3) { // Text node
            val += node.nodeValue + "\n";
          }
        });

        val = val.trim();
        if (!val) return;

        // Cut the value if it's too long
        if (val.length >= 100) { val = val.slice(0, 100).trim() + "..."; }
        val = val.replace("\n", "<br>"); // Replace newlines with <br>

        var row = _.createElement("div", {
          classes: ["hn-special-tooltip-row"],
        });
        tooltip.appendChild(row);

        var keyElem = _.createElement("div", {
          classes: ["hn-special-tooltip-key"],
          content: _.naturalWords(key)
        });
        row.appendChild(keyElem);

        var valElem = _.createElement("div", {
          classes: ["hn-special-tooltip-value"],
          content: val
        });
        row.appendChild(valElem);

        var clear = _.createElement("div", {
          classes: ["hn-special-tooltip-clear"]
        });
        tooltip.appendChild(clear);
      });

      // Check if the tooltip is too big to fit on the screen and invert if it is
      var lowestPoint = offset("offsetTop") + container.offsetHeight;
      if (lowestPoint > window.innerHeight) {
        container.style.top = offset("offsetTop") - container.offsetHeight;
        container.classList.add("hn-special-tooltip-inverted");
      }
    }

    link.onmouseover = function () {
      remove();

      timeout = setTimeout(function () {
        // Create the container here so the user has feedback that it's loading
        container = _.createElement("div", {
          classes: ["hn-special-tooltip-container"]
        });
        document.body.appendChild(container);

        // Position the tooltip container right underneath the user link
        container.style.top = offset("offsetTop") + link.offsetHeight;
        container.style.left = offset("offsetLeft");

        tooltip = _.createElement("div", {
          classes: ["hn-special-tooltip"],
          content: "Loading..."
        });
        container.appendChild(tooltip);

        var cached = cache[href];
        if (cached) {
          display(cached);
        } else {
          request = _.request(link.href, "GET", function(page){
            cache[href] = page;
            display(page);
          });
        }
      }, 500);
    };

    link.onmouseout = remove;
  });
});
