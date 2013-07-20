HNSpecial.settings.loadConditional("open_links_in_new_tabs", function () {
  function tweakLinks() {
    _.toArray(document.getElementsByTagName("a")).forEach(function (link) {
      if (link.parentElement.classList.contains("title") && !link.getAttribute("href").match(/^\/x\S+/)) {
        console.log(link.textContent);
        link.setAttribute("target", "_blank");  
      }    
    });  
  }
  
  // Run it
  tweakLinks();

  // Used by other modules to notify the presence of new links
  HNSpecial.notifyLinks = function () {
    tweakLinks();
  };
});
