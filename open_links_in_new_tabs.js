HNSpecial.settings.registerModule("open_links_in_new_tabs", function () {
  function editLinks() {
    _.toArray(document.getElementsByTagName("a")).forEach(function (link) {
      if (_.isLink(link)) {
        link.setAttribute("target", "_blank");  
      }    
    });  
  }
  
  // Run it
  editLinks();

  // Subscribe to the event emitted when new links are present
  HNSpecial.settings.subscribe("new links", function () {
    console.log("(open_links_in_new_tabs: got new links)");
    editLinks();
  });
});
