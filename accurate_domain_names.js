HNSpecial.settings.registerModule("accurate_domain_names", function () {
  var titles = _.toArray(document.getElementsByClassName("title"));

  titles.forEach(function (title) {
    if (title.childElementCount === 2 && title.children[1].classList.contains("comhead")) {
      // Removes http/https, matches the domain name excluding www
      var url = title.children[0].getAttribute("href").replace(/http(?:s)?:\/\/(?:www.)?([a-z0-9.-]+)(?:\/\S*)/i, "$1").toLowerCase();
      var domain = title.children[1];
      domain.textContent = " (" + url + ") ";
    }
  });
});
