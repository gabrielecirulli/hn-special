HNSpecial.settings.registerModule("comment_traversal", function () {
  var position = -1;
  var commentList;

  var markTopLevelComments = function(allComments) {
    var commentsList = [];
    var comment;

    for (var i in allComments) {
      comment = allComments[i].getElementsByTagName('img')[0];
      if (comment.getAttribute('src') === 's.gif' && comment.getAttribute('width') === '0') {
        commentsList.push({
          comment: allComments[i].getElementsByClassName('default')[0],
          topLevel: true
        });
      } else {
        commentsList.push({
          comment: allComments[i].getElementsByClassName('default')[0],
          topLevel: false
        });
      }
    }

    return commentsList;
  };

  var setNextComment = function(topLevel, forward) {
    if (position === -1) {
      position = 0;
      return;
    }

    if (topLevel) {
      if (forward) {
        while (true) {
          incrementPosition();

          if (commentList[position].topLevel)
            return
        }
      } else {
        while (true) {
          decrementPosition();

          if (commentList[position].topLevel)
            return
        }
      }
    } else {
      if (forward) {
        incrementPosition();
      } else {
        decrementPosition();
      }
    }
  };

  var incrementPosition = function() {
    position = (position+1)%commentList.length;
  };

  var decrementPosition = function() {
    position = (position+commentList.length-1)%commentList.length;
  };

  var goToNextComment = function() {
    commentList[position].comment.scrollIntoView(true);
  };

  var registerKeyEvents = function() {
    document.onkeydown = function (e) { 
      e = e || window.event;
      var keyCode = e.keyCode || e.which,
          arrow = {left: 37, up: 38, right: 39, down: 40 };

      if (e.ctrlKey) {
        switch (keyCode) {
          case arrow.up:
            e.preventDefault();
            setNextComment(true, false);
            goToNextComment();
            break;
          case arrow.down:
            e.preventDefault();
            setNextComment(true, true);
            goToNextComment();
            break;
          case arrow.left:
            e.preventDefault();
            setNextComment(false, false);
            goToNextComment();
            break;
          case arrow.right:
            e.preventDefault();
            setNextComment(false, true);
            goToNextComment();
            break;
        }
      }
    };
  };

  if (_.isCommentPage()) {
    var allComments = [].slice.call(document.getElementsByClassName("athing"));
    allComments.shift(); // First is the title
    commentList = markTopLevelComments(allComments);
    
    if (commentList.length > 0)
      registerKeyEvents();
  }
    
});
