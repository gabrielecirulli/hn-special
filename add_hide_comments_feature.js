HNSpecial.settings.registerModule("add_hide_comments_feature", function () {
  function hideComments(){
    //if window.location contains the word "item" so we only run on comments page
    if (/item/.test(window.location.href)){
      var targs = document.getElementsByClassName('hnspecial-theme-spacer-container');
      for (i=0;i<targs.length;i++) {
        if (targs[i].style.width === "0px") {
          //god awful way to get to the full top level comment
          var topLevel = targs[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
          //give it a class name so we can access it easier
          topLevel.className += " topLevel";
        }
      }
    //add minimize link
    $('.topLevel').find('.comhead').parent().append('<span class="toggle">&nbsp;[-]</span>'); 
    } // endif url check
  };

  // Run it
  hideComments();

  // Subscribe to the event emitted when comments are present
  // HNSpecial.settings.subscribe("new links", hideComments);
});


