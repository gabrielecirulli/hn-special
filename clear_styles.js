load(function () {
  // Removes the original HN CSS to avoid conflicts with the CSS added by the extension 
  $("link[rel=stylesheet], style").forEach(function (elem) {
      elem.remove();
  });
   
  // Removes all styling attributes
  $("table, tr, td, span, p, font, div").forEach(function (elem) {
      var attrs = elem.attributes;
      var names = [];

      // This is contrived because .length is changed, messing up the loop
      for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i].name;
        if (["colspan", "class", "id"].indexOf(attr) !== -1) continue; 
        names.push(attr);
      }

      names.forEach(function (attr) {
        elem.removeAttribute(attr);
      });
  });
});
