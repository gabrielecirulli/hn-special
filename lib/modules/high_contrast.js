HNSpecial.settings.registerModule("high_contrast", function () {
  var theme = document.createElement( "link" );
  theme.rel = "stylesheet";
  theme.type = "text/css";
  theme.href = HNSpecial.browser.getUrl( "lib/extras/hn_theme_light_contrast.css" );
  document.getElementsByTagName( "head" )[ 0 ].appendChild( theme );
});
