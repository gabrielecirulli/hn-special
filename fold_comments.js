HNSpecial.settings.registerModule("fold_comments", function () {
  var baseWidth = 40;

  if (_.isCommentPage()) {
    _.toArray(document.getElementsByClassName("default")).forEach(function (comment) {
      var row = comment.parentElement;
      var depth = getCommentDepth(row);

      var comhead = comment.getElementsByClassName("comhead")[0];
      comhead.appendChild(document.createTextNode(" | "));

      var button = _.createElement("button", {
        content: "fold",
        classes: ["hnspecial-fold-comment-button"]
      });
      comhead.appendChild(button);

      button.addEventListener("click", function () {
        
      });
    });
  }

  function getCommentDepth(comment) {
    var spacer = comment.firstChild.firstChild;
    return parseInt(spacer.getAttribute("width"), 10) / baseWidth;
  }
});
