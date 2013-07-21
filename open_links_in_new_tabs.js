HNSpecial.settings.registerModule("open_links_in_new_tabs", function () {
  function editLinks() {
    _.toArray(document.getElementsByTagName("a")).forEach(function (link) {
      //console.log(link.textContent);
      if (_.isTitleLink(link) || _.isCommentLink(link)) {
        console.log(link.textContent);
        link.setAttribute("target", "_blank");  
      }    
    });  
  }
  
  // Run it
  editLinks();

  // Subscribe to the event emitted when new links are present
  HNSpecial.settings.subscribe("new links", function () {
    editLinks();
  });
});
