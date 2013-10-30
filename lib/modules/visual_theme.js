// Tweaks the content of the pages to allow for better styling
// TODO: refactor code
HNSpecial.settings.registerModule("visual_theme", function () {
  var ignore = ["/rss", "/bigrss"];

  if (ignore.indexOf(location.pathname) === -1) {
    // Removes the original HN CSS to avoid conflicts with the CSS added by the extension
    _.$("link[rel=stylesheet], style").forEach(function (elem) {
        elem.remove();
    });

    // Get rid of styling attributes embedded in code
    stripAttributes();

    document.documentElement.classList.add("hnspecial-theme");
    var body = document.body;

    // Main container (contains header and content)
    var container = _.$("body > center > table > tbody")[0];

    // Apply to pages with a container
    if (container) {
      // TD with content (after the header)
      var content = container.children[2].children[0];

      // If the content TD is empty, add all of the following TDs into it (happens in threads page)
      if (!content.textContent.trim().length) {
        // Empty the element completely
        content.innerHTML = "";

        // New table to hold comments (mimics comment page structure)
        var table = _.createElement("table");
        var tbody = _.createElement("tbody");

        var i = 3; // First stray row is at index 3
        while (!container.children[i].getElementsByClassName("yclinks").length) { // Stop at the footer
          tbody.appendChild(container.children[i]);
        }

        table.appendChild(tbody);
        content.appendChild(table);
      }

      // Add a class to the body if it's a form page
      // Get the form in the content td
      var form = content.getElementsByTagName("form")[0];
      var title = document.getElementsByClassName("title")[0];
      var isCommentPage = _.isCommentPage();

      if (form && !isCommentPage) {
        body.classList.add("hnspecial-form-page");
        var form = document.getElementsByTagName("form")[0];
        _.toArray(form.getElementsByTagName("textarea")).forEach(function (textarea) {
          textarea.parentElement.parentElement.children[0].classList.add("hnspecial-textarea-label");
        });

        // Fix up stray text near P tags in form pages
        _.toArray(form.getElementsByTagName("p")).forEach(function (paragraph) {
          var container = paragraph.parentElement;
          var unwrapped = container.childNodes[0];
          var text = unwrapped.nodeValue;
          unwrapped.remove();

          var paragraph = _.createElement("p");
          paragraph.textContent = text;

          container.insertBefore(paragraph, container.children[0]);
        });
      }

      // Make the logo go to the home of hacker news
      _.$("img[src='y18.gif']")[0].parentElement.setAttribute("href", location.origin);

      // Remove some of the vertical bars
      _.$(".pagetop, span.yclinks").forEach(function (elem) {
        _.toArray(elem.childNodes).forEach(function (node) {
          if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(/\|/g, "");
          }
        })
      });

      // Applied to comment pages
      if (isCommentPage) {
        var tableContainer = title.parentElement.parentElement;
        if (tableContainer.childElementCount >= 4) {
          var textContainer = title.parentElement.parentElement.children[3].children[1];

          // If the post has textual content, wrap stray text in a paragraph
          if (textContainer.textContent.trim().length) {
            var nodes = _.toArray(textContainer.childNodes).filter(function (node) { return node.nodeType === Node.TEXT_NODE; });

            // Replaced each stray text node with a paragraph
            nodes.forEach(function (node) {
              var paragraph = _.createElement("p");
              paragraph.textContent = node.nodeValue;
              textContainer.insertBefore(paragraph, node);
              node.remove();
            });
          }
        }
      }

      // Wrap the stray pieces of text in comments into their own <p> and add a class to the upvote td
      _.$("span.comment").forEach(function (elem) {
        // Remove font tags and take out the inner elements
        _.toArray(elem.getElementsByTagName("font")).forEach(function (font) {
          _.toArray(font.childNodes).forEach(function (child) {
            font.parentElement.insertBefore(child, font);
          });
          font.remove();
        });

        // Make sure each stray piece (stuff that is not in a paragraph) gets grouped in paragraphs
        var stops = ["p", "pre"]; // Elements that should not be joined in the same paragraph
        var current = elem.childNodes[0]; // Start from the first node
        while (current) {
          if (stops.indexOf(current.nodeName.toLowerCase()) !== -1) { // Jump to the next stray node
            current = current.nextSibling;
            continue;
          }

          var group = [current]; // Elements to be grouped in the same paragraph
          var sibling = current.nextSibling;

          while (sibling && stops.indexOf(sibling.nodeName.toLowerCase()) === -1) {
            group.push(sibling);
            sibling = sibling.nextSibling;
          }

          var paragraph = _.createElement("p");
          elem.insertBefore(paragraph, current);
          group.forEach(function (element) {
            paragraph.appendChild(element);
          });

          current = paragraph;
        }

        // Add a class to the upvote button
        var container = elem.parentElement.parentElement;

        var index = 1;
        if (container.childElementCount === 2) index = 0; // page /newcomments has two tds instead of three
        container.children[index].classList.add("hnspecial-upvote-button");

        // Replace the s.gif spacer image
        var cell = container.firstChild
        var img = container.firstChild.firstChild;
        if (img.tagName.toLowerCase() === "img") {
          var div = _.createElement("div", {
            classes: ["hnspecial-theme-spacer-container"],
            attributes: {
              style: "width: " + img.getAttribute("width") + "px"
            }
          });

          div.appendChild(_.createElement("div", {
            classes: ["hnspecial-theme-spacer"]
          }));

          cell.classList.add("hnspecial-theme-spacer-cell");
          cell.appendChild(div);

          // Hide the spacer image but don't remove it
          img.setAttribute("style", "display: none");
        }
      });

      // Add a class to the upvote buttons on poll items
      _.$("td.comment").forEach(function (elem) {
        var row = elem.parentElement;
        row.classList.add("hnspecial-poll-row");
        var arrow = row.children[0];
        arrow.classList.add("hnspecial-upvote-button", "poll");
        arrow.parentElement
      });

      // Replace the default HN arrows
      replaceArrows();

      // Don't display the topcolors page
      if (location.pathname.match(/^\/topcolors/)) {
        var cell = container.children[2].firstChild;
        cell.firstChild.remove();
        cell.appendChild(_.createElement("p", {
          content: "Sorry, topcolors isn't supported by the visual theme of HN Special. Please disable the visual theme in order to use topcolors."
        }));
      }
    } else {
      // The page has no container. It's either the login page or an error page

      // Style error pages (ignoring the rss page)
      if ((!body.childElementCount || body.children[0].nodeName.toLowerCase() === "pre")) {
        body.classList.add("error");

        // Set the page title
        document.title = body.textContent.trim();

        // Dirty hack to remove the <pre> element shown on 404 pages
        body.innerHTML = body.textContent;

        // Back link
        var link = _.createElement("a");
        link.setAttribute("href", location.origin);
        link.textContent = "Back home";
        body.appendChild(link);
      }

      // Select log in form
      if (_.$("body > form")[0]) {
        body.classList.add("hnspecial-form-page", "login");

        // Wrap everything in the body in a div
        var loginContainer = _.createElement("div");
        loginContainer.classList.add("hnspecial-form-container");

        while (body.firstChild) {
          loginContainer.appendChild(body.firstChild);
        }

        body.appendChild(loginContainer);
      }
    }
  }

  // Utility functions
  function stripAttributes(data) {
    var set;

    if (data) {
      data = data.map(function (element) {
        return _.$("body, table, tr, td, span, p, font, div", element);
      });
      set = Array.prototype.concat.apply([], data);
    } else {
      set = _.$("body, table, tr, td, span, p, font, div");
    }

    // Removes all styling attributes
    set.forEach(function (elem) {
        var attrs = elem.attributes;
        var names = [];

        // This is contrived because .length changes, messing up the loop
        for (var i = 0; i < attrs.length; i++) {
          var attr = attrs[i].name;
          if (["colspan", "class", "id"].indexOf(attr) !== -1) continue;
          names.push(attr);
        }

        names.forEach(function (attr) {
          if (attr.match(/^data-hnspecial/i)) return; // Skip attributes added by HN Special
          elem.removeAttribute(attr);
        });
    });
  }

  function replaceArrows() {
    // Change the image of the upvote button
    var upArrow = chrome.extension.getURL("resources/arrow-up.svg");
    var downArrow = chrome.extension.getURL("resources/arrow-down.svg");
    var arrowPicture;
    _.$("div.votearrow").forEach(function (arrow) {
      arrowPicture = arrow.parentElement.getAttribute("id").match(/^up_/) ? upArrow : downArrow;
      arrow.style.backgroundImage = "url(" + arrowPicture + ")";
    });
  }

  // Subscribe to new links
  HNSpecial.settings.subscribe("new links", function (data) {
    stripAttributes(data);
    replaceArrows();
  });
});
