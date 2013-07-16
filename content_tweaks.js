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
if (title.children.length && title.children[0].nodeName === "A") {
  var container = title.parentElement.parentElement.children[3].children[1];
  var unwrapped = container.childNodes[0];
  var text = unwrapped.nodeValue;
  unwrapped.remove();

  var paragraph = document.createElement("p");
  paragraph.textContent = text;
  container.insertBefore(paragraph, container.children[0]);
}

// Wrap the first piece of text in each comment into its own p
$("span.comment").forEach(function (elem) {
  var paragraph = document.createElement("p");
  paragraph.appendChild(elem.children[0]);
  elem.insertBefore(paragraph, elem.children[0]);  
});

// Style error pages (and ignore the rss page)
var body = document.body;
if (location.pathname !== "/rss" && (!body.children.length || body.children[0].nodeName === "PRE")) {
  body.classList.add("error");

  // Dirty hack to remove the <pre> element shown on 404 pages
  body.innerHTML = body.textContent;

  // Back link
  var link = document.createElement("a");
  link.href = location.origin;
  link.textContent = "Back home";
  body.appendChild(link);
}
