HNSpecial.settings.registerModule("accurate_domain_names", function () {
  function editLinks() {
    var titles = _.toArray(document.getElementsByClassName("title"));

    titles.forEach(function (title) {
      if (!title.getAttribute("data-hnspecial-accurate") && title.childElementCount === 2 && title.children[1].classList.contains("comhead")) {
        // Removes http/https, matches the domain name excluding www
        var url = title.children[0].host.replace("www.", "");
        var domain = title.children[1];
        domain.textContent = " (" + url + ") ";
        title.setAttribute("data-hnspecial-accurate", "true");
      }
    });
  }

  // Run it
  editLinks();

  // Subscribe to the event emitted when new links are present
  HNSpecial.settings.subscribe("new links", editLinks);
});
