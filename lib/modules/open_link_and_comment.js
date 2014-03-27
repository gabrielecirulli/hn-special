HNSpecial.settings.registerModule("open_link_and_comment", function () {
  function addLinkAndCommentLink() {
    if (_.isCommentPage()) return;

    var subtexts = _.toArray(document.getElementsByClassName("subtext"));

    subtexts.forEach(function (subtext) {
      if (!subtext.getAttribute("data-hnspecial-linkcomment")) {
        var linkUrl = subtext.parentNode.previousSibling.lastChild.firstChild.href;
        var commentUrl = subtext.lastChild.href;

        var linkAndComment = document.createElement("a");
        linkAndComment.setAttribute("href", "#");
        linkAndComment.setAttribute("commentUrl", commentUrl);
        linkAndComment.setAttribute("linkUrl", linkUrl);
        linkAndComment.onclick = openMultipleLinks;
        linkAndComment.textContent = "[l+c]";

        var separator = document.createTextNode(" | ");
        subtext.appendChild(separator);
        subtext.appendChild(linkAndComment);
        subtext.setAttribute("data-hnspecial-linkcomment", "true");
      }
    });
  }

  function openMultipleLinks(e) {
    e.preventDefault();
    // Only open the link once for a text submission
    if(this.getAttribute('commentUrl') === this.getAttribute('linkUrl')) {
      window.open(this.getAttribute('commentUrl'));
    } else {
      window.open(this.getAttribute('commentUrl'));
      window.open(this.getAttribute('linkUrl'));
    }
  }

  // Run it
  addLinkAndCommentLink();

  // Subscribe to the event emitted when new links are present
  HNSpecial.settings.subscribe("new links", addLinkAndCommentLink);
});
