HNSpecial.settings.registerModule("fold_comments", function () {
  var baseWidth = 40;

  if (_.isCommentPage()) {
    _.toArray(document.getElementsByClassName("default")).forEach(function (comment) {
      var row = comment.parentElement.parentElement.parentElement.parentElement.parentElement; // Least horrible way to get to the comment row
      var depth = getCommentDepth(row);

      var comhead = comment.getElementsByClassName("comhead")[0];
      comhead.appendChild(document.createTextNode(" | "));

      var button = _.createElement("button", {
        content: "fold",
        classes: ["hnspecial-fold-comment-button"]
      });
      comhead.appendChild(button);

      button.addEventListener("click", function () {
        var folded = comment.classList.contains("hnspecial-folded-comment");
        var current = row;

        while (current = current.nextSibling) {
          if (getCommentDepth(current) <= depth) break;

          if (!folded) {
            current.classList.add("hnspecial-folded-row");
          } else {
            current.classList.remove("hnspecial-folded-row");
          }
        }

        // Fold/unfold the current comment
        comment.classList.toggle("hnspecial-folded-comment");

        button.innerText = folded ? "fold" : "unfold";
      });
    });
  }

  function getCommentDepth(comment) {
    var spacer = comment.getElementsByTagName("img")[0];
    return parseInt(spacer.getAttribute("width"), 10) / baseWidth;
  }
});
