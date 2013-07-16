// Makes a few tweaks to the content of the page
$("span.pagetop").forEach(function (elem) {
  toArray(elem.childNodes).forEach(function (node) {
    if (node.nodeName === "#text") {
      node.nodeValue = node.nodeValue.replace(/\|/g, "");
    }
  })
});
