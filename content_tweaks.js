load(function () {
  // Makes a few tweaks to the content of the page
  $("span.pagetop, span.yclinks").forEach(function (elem) {
    toArray(elem.childNodes).forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = node.nodeValue.replace(/\|/g, "");
      }
    })
  });

  // Add p tags to the first paragraph of self posts
  var title = document.getElementsByClassName("title")[0];

  // If the first title in the page contains an A tag we're hopefully in an item page
  // I'm not sure if there's a better way to match this.
  if (title && title.children.length && title.children[0].nodeName === "A" && !title.children[0].getAttribute("href").match(/^\/x\?.+/)) {
    var container = title.parentElement.parentElement.children[3].children[1];

    // Don't do this when the post has no textual content

    if (container.textContent.trim().length) {
      var unwrapped = container.childNodes[0];
      var text = unwrapped.nodeValue;
      unwrapped.remove();

      var paragraph = document.createElement("p");
      paragraph.textContent = text;

      if(container.getElementsByTagName("p").length) {
        container.insertBefore(paragraph, container.children[0]);  
      } else {
        container.appendChild(paragraph);
      }      
    }
  }

  // Wrap the first piece of text in each comment into its own p and add a class to the upvote td
  $("span.comment").forEach(function (elem) {
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
  $("td.comment").forEach(function (elem) {
    var row = elem.parentElement;
    row.classList.add("hnspecial-poll-row");
    var arrow = row.children[0];
    arrow.classList.add("hnspecial-upvote-button", "poll");
    arrow.parentElement
  });

  // Style error pages (and ignore the rss page)
  var body = document.body;
  if (location.pathname !== "/rss" && (!body.children.length || body.children[0].nodeName === "PRE")) {
    body.classList.add("error");

    // Dirty hack to remove the <pre> element shown on 404 pages
    body.innerHTML = body.textContent;

    // Back link
    var link = document.createElement("a");
    link.setAttribute("href", location.origin);
    link.textContent = "Back home";
    body.appendChild(link);
  }

  // Make the logo go to the home of hacker news
  $("img[src='y18.gif']")[0].parentElement.setAttribute("href", location.origin);

  // If the third TD is empty, add all of the following TDs into it (happens in threads page)
  var container = $("body > center > table > tbody")[0];
  var cell = container.children[2].children[0];

  if (!cell.textContent.trim().length) {
    // Empty the element completely
    cell.innerHTML = "";

    // New table to hold comments (mimics comment page structure)
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    
    var i = 3; // First stray row is at index 3
    while (!container.children[i].getElementsByClassName("yclinks").length) { // Stop at the footer
      tbody.appendChild(container.children[i]);
    }

    table.appendChild(tbody);
    cell.appendChild(table);
  }
});
