HNSpecial.settings.registerModule("add_hide_comments_feature", function () {
  function hideComments(){
    //if window.location contains the word "item" so we only run on comments page
    if (/item/.test(window.location.href)){

      var dataLevel = 0, 
          targs = document.getElementsByClassName('hnspecial-theme-spacer-container');

      for (i=0;i<targs.length;i++) {      
        //god awful way to get to the full top level comment
        var topLevel = targs[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        if (targs[i].style.width === "0px") {
          //give it a class name so we can access it easier
          topLevel.className += " topLevel";
          dataLevel++;
          topLevel.dataset.level = dataLevel;
        } else {
          //give it a class name so we can access it easier
          topLevel.className += " subLevel thread-"+dataLevel;
        }
      }

      //add minimize link and click event
      $('.topLevel').find('.comhead').parent().append('<span class="toggleThread">&nbsp;[-]</span>'); 
      $('.toggleThread').click(function(e){
        var thread = $(this).closest('.topLevel').data('level');
        $('.thread-'+thread).slideToggle();
        $(this).parent().siblings().slideToggle();
      });  
    } // endif url check
  };

  // Run it
  hideComments();
});


