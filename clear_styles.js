// TODO: Add option to make links target _blank

var $ = function (selector) {
    return [].slice.call(document.querySelectorAll(selector));
};

// Removes the original HN CSS to avoid conflicts with the CSS added by the extension 
$("link[rel=stylesheet]").forEach(function (elem) {
    elem.remove();
});
 
// Removes all styling attributes
$("table, tr, td").forEach(function (elem) {
    var attrs = elem.attributes;
    var names = [];

    // This is contrived because .length is changed, messing up the loop
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i].name;
      if (attr === "colspan") continue; 
      names.push(attr);
    }

    names.forEach(function (attr) {
      elem.removeAttribute(attr);
    });
});
