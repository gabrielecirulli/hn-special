HNSpecial.settings.registerModule("highlight_op_comments", function () {
  if (_.isCommentPage() || location.pathname.match(/^\/(item|threads)/)) {
    var op = document.getElementsByClassName('subtext')[0]
      .getElementsByTagName('a')[0]
      .innerText;

    _.toArray(document.getElementsByClassName("default")).forEach(function (comment) {
      var name = comment.getElementsByTagName('a')[0];
      if (name.innerText === op) {
        name.classList.add('op');
      }
    });
  }
});
