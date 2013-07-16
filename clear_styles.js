// Removes the original HN CSS to avoid conflicts with the CSS added by the extension
var links = document.getElementsByTagName('link');

for (var i = 0; i < links.length; i++) {
  var link = links[i];
  if (link.getAttribute("rel") === "stylesheet") {
    link.parentNode.removeChild(link);
  }
}
