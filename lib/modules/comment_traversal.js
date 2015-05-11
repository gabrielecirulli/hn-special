HNSpecial.settings.registerModule("comment_traversal", function () {
  function isAComment(element) {
    // element is '.athing'
    var imgs = element.getElementsByTagName('img');
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].getAttribute('src') === 's.gif' && imgs[i].getAttribute('width') === '0')
        return true;
    }

    return false;
  };

  function setPositionToATopLevel(forward) {
    if (position === -1) {
      position = 0;
      return;
    }

    while (true) {
      if (forward)
        incrementPosition();
      else
        decrementPosition();

      if (isAComment(commentList[position]))
        return;
    }
  };

  function incrementPosition() {
    position = (position+1)%commentList.length;
  };

  function decrementPosition() {
    position = (position+commentList.length-1)%commentList.length;
  };

  function goToNextComment() {
    if (!checkvisible(commentList[position]))
      commentList[position].scrollIntoView(true);

    // Make it blink!
    var activeComments = document.getElementsByClassName('hn-special-comment-active');
    for (var i = 0; i < activeComments.length; i++)
      activeComments[i].classList.remove('hn-special-comment-active');

    commentList[position].classList.add('hn-special-comment-active');
  };

  function registerKeyEvents() {
    document.onkeydown = function (e) { 
      e = e || window.event;
      var keyCode = e.keyCode || e.which,
          arrow = {left: 37, up: 38, right: 39, down: 40 };

      if (e.ctrlKey) {
        switch (keyCode) {
          case arrow.up:
            e.preventDefault();
            setPositionToATopLevel(false);
            goToNextComment();
            break;
          case arrow.down:
            e.preventDefault();
            setPositionToATopLevel(true);
            goToNextComment();
            break;
          case arrow.left:
            e.preventDefault();
            decrementPosition();
            goToNextComment();
            break;
          case arrow.right:
            e.preventDefault();
            incrementPosition();
            goToNextComment();
            break;
        }
      }
    };
  };

  // Stolen+modified from http://stackoverflow.com/questions/5353934/check-if-element-is-visible-on-screen
  function checkvisible( elm ) {
      function posY(elm) {
      var test = elm, top = 0;

      while(!!test && test.tagName.toLowerCase() !== "body") {
          top += test.offsetTop;
          test = test.offsetParent;
      }

      return top;
    }

    function viewPortHeight() {
        var de = document.documentElement;

        if(!!window.innerWidth)
        { return window.innerHeight; }
        else if( de && !isNaN(de.clientHeight) )
        { return de.clientHeight; }

        return 0;
    }

    function scrollY() {
        if( window.pageYOffset ) { return window.pageYOffset; }
        return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    }

    var vpH = viewPortHeight(), // Viewport Height
        st = scrollY(), // Scroll Top
        yTop = posY(elm),
        yBot = elm.offsetHeight;

    return (yTop > st && yTop < st+vpH && yTop+yBot < st+vpH);
  }
  //////////

  if (_.isCommentPage()) {
    var position = -1; // Haven't moved yet
    var commentList = _.toArray(document.getElementsByClassName("athing"));
    commentList.shift(); // First is the title
        
    if (commentList.length > 0)
      registerKeyEvents();
  }    
});
