HNSpecial.settings.registerModule( "dark_theme", function() {
  var theme = document.createElement( "link" );
  theme.rel = "stylesheet";
  theme.type = "text/css";
  theme.href = HNSpecial.browser.getUrl( "lib/extras/hn_theme_dark.css" );
  document.getElementsByTagName( "head" )[ 0 ].appendChild( theme );
} );
