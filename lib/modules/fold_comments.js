HNSpecial.settings.registerModule("fold_comments", function () {
  var baseWidth = 40;

  if (_.isCommentPage() || location.pathname.match(/^\/(item|threads)/)) {
    _.toArray(document.getElementsByClassName("default")).forEach(function (comment) {
      var row = comment.parentElement.parentElement.parentElement.parentElement.parentElement; // Least horrible way to get to the comment row

      // Skip this row if we're on a comment permalink page and it's the comment at the top
      if (row.nextElementSibling && row.nextElementSibling.getElementsByClassName("yclinks").length) return;

      var comhead = comment.getElementsByClassName("comhead")[0];
      comhead.appendChild(document.createTextNode(" | "));

      var button = _.createElement("button", {
        content: "fold",
        classes: ["hnspecial-fold-comment-button"]
      });
      comhead.appendChild(button);

      button.addEventListener("click", function () {
        var folded = comment.classList.contains("hnspecial-folded-comment");
        var method = folded ? "remove" : "add";

        // Fold/unfold the current comment
        comment.classList[method]("hnspecial-folded-comment");
        button.innerText = folded ? "fold" : "unfold";

        // Depth of the current comment
        var baseDepth = getCommentDepth(row);

        var current = row;

        // The comments are not organised in a tree so we have to cycle through
        // each row and find the nesting manually, then also skip appropriately
        // if some of the comments below the one we're folding are already folded
        var foldedDepth = null; // Depth of the topmost folded comment in the tree we're folding

        // Fold nested comments (if present)
        while (current = current.nextElementSibling) {
          var depth = getCommentDepth(current);

          if (depth <= baseDepth) {
            break;
          }

          // Check if we need to skip the comment because it's under a folded one
          if (foldedDepth !== null) {
            if (depth > foldedDepth) {
              continue;
            } else {
              // We're out of the comments nested under the hidden one so we can stop skipping
              foldedDepth = null;
            }
          }

          // If the current comment is folded, set foldedDepth to avoid touching the nested ones
          if (current.getElementsByClassName("hnspecial-folded-comment").length) {
            foldedDepth = depth;
          }

          // Fold/unfold the current comment
          current.classList[method]("hnspecial-folded-row");
        }
      });
    });
  }

  function getCommentDepth(comment) {
    var spacer = comment.getElementsByTagName("img")[0];
    return parseInt(spacer.getAttribute("width"), 10) / baseWidth;
  }
});
