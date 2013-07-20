HNSpecial.settings.loadConditional("open_links_in_new_tabs", function () {
  _.toArray(document.getElementsByTagName("a")).forEach(function (link) {
    var parent = link.parentElement;
    if (parent.classList.contains("title") && parent.parentElement.childElementCount === 3) {
      console.log(link.textContent);
      link.setAttribute("target", "_blank");  
    }    
  });

});
