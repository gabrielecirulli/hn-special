// Tweaks the content of the pages to allow for better styling
// TODO: refactor code
settings.loadConditional("visual_theme", function () {
  // Main container (contains header and content)
  var body = document.body;
  body.classList.add("hnspecial-theme");
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
      var table = document.createElement("table");
      var tbody = document.createElement("tbody");
      
      var i = 3; // First stray row is at index 3
      while (!container.children[i].getElementsByClassName("yclinks").length) { // Stop at the footer
        tbody.appendChild(container.children[i]);
      }

      table.appendChild(tbody);
      content.appendChild(table);
    }

    // Add a class to the body if it's a form page
    // Get the post title
    var title = document.getElementsByClassName("title")[0];
    var isCommentPage = title && title.children.length && title.children[0].nodeName === "A" && !title.children[0].getAttribute("href").match(/^\/x\?.+/);

    // Get the form in the content td
    var form = content.getElementsByTagName("form")[0];

    if (form && !isCommentPage) {

      document.body.classList.add("hnspecial-form-page");
      var form = document.getElementsByTagName("form")[0];
      _.toArray(form.getElementsByTagName("textarea")).forEach(function (textarea) {
        textarea.parentElement.parentElement.children[0].classList.add("hnspecial-textarea-label");
      });

      // Fix up stray text near P tags in form pages
      _.toArray(form.getElementsByTagName("p")).forEach(function (paragraph) {
        // Refactor: this code is the same as below
        
        var container = paragraph.parentElement;
        var unwrapped = container.childNodes[0];
        var text = unwrapped.nodeValue;
        unwrapped.remove();

        var paragraph = document.createElement("p");
        paragraph.textContent = text;

        container.insertBefore(paragraph, container.children[0]);
      });
    }

    // Make the logo go to the home of hacker news
    _.$("img[src='y18.gif']")[0].parentElement.setAttribute("href", location.origin);

    // Remove some of the vertical bars
    _.$("span.pagetop, span.yclinks").forEach(function (elem) {
      _.toArray(elem.childNodes).forEach(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          node.nodeValue = node.nodeValue.replace(/\|/g, "");
        }
      })
    });

    // If the first title in the page contains an A tag we're hopefully in an item page
    // I'm not sure if there's a better way to match this.
    if (isCommentPage) {
      var textContainer = title.parentElement.parentElement.children[3].children[1];

      // Only apply this when the post has textual content
      if (textContainer.textContent.trim().length) {
        var unwrapped = textContainer.childNodes[0];
        var text = unwrapped.nodeValue;
        unwrapped.remove();

        var paragraph = document.createElement("p");
        paragraph.textContent = text;

        if (textContainer.getElementsByTagName("p").length) {
          textContainer.insertBefore(paragraph, textContainer.children[0]);  
        } else {
          textContainer.appendChild(paragraph);
        }      
      }
    }

    // Wrap the first piece of text in each comment into its own p and add a class to the upvote td
    _.$("span.comment").forEach(function (elem) {
      var paragraph = document.createElement("p");

      if (elem.children.length) {
        paragraph.appendChild(elem.children[0]);
        elem.insertBefore(paragraph, elem.children[0]);    
      } else {
        paragraph.textContent = elem.textContent;
        elem.textContent = "";
        elem.appendChild(paragraph);
      } 

      var container = elem.parentElement.parentElement;

      var index = 1;
      if (container.children.length === 2) index = 0; // page /newcomments has two tds instead of three
      container.children[index].classList.add("hnspecial-upvote-button");
    });

    // Add a class to the upvote buttons on poll items
    _.$("td.comment").forEach(function (elem) {
      var row = elem.parentElement;
      row.classList.add("hnspecial-poll-row");
      var arrow = row.children[0];
      arrow.classList.add("hnspecial-upvote-button", "poll");
      arrow.parentElement
    });
  } else {
    // The page has no container. It's either the login page or an error page

    // Style error pages (ignoring the rss page)
    if ((!body.children.length || body.children[0].nodeName === "PRE") && location.pathname !== "/rss") {
      body.classList.add("error");

      // Dirty hack to remove the <pre> element shown on 404 pages
      body.innerHTML = body.textContent;

      // Back link
      var link = document.createElement("a");
      link.setAttribute("href", location.origin);
      link.textContent = "Back home";
      body.appendChild(link);
    }

    // Select log in form
    if (_.$("body > form")[0]) {
      body.classList.add("hnspecial-form-page", "login");

      // Wrap everything in the body in a div
      var loginContainer = document.createElement("div");
      loginContainer.classList.add("hnspecial-form-container");

      while (body.firstChild) {
        loginContainer.appendChild(body.firstChild);
      }

      body.appendChild(loginContainer);
    }
  }
});
