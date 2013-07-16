// Makes a few tweaks to the content of the page
$("span.pagetop, span.yclinks").forEach(function (elem) {
  toArray(elem.childNodes).forEach(function (node) {
    if (node.nodeName === "#text") {
      node.nodeValue = node.nodeValue.replace(/\|/g, "");
    }
  })
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
