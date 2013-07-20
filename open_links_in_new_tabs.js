HNSpecial.settings.registerModule("open_links_in_new_tabs", function () {
  function editLinks() {
    _.toArray(document.getElementsByTagName("a")).forEach(function (link) {
      if (_.isLink(link)) {
        console.log(link.textContent);
        link.setAttribute("target", "_blank");  
      }    
    });  
  }
  
  // Run it
  editLinks();

  // Used by other modules to notify the presence of new links
  HNSpecial.notifyLinks = function () {
    editLinks();
  };
});
