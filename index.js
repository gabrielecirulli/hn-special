var self    = require('sdk/self'),
    pageMod = require('sdk/page-mod');

console.error( "I actually loaded, I promise." );

function notDataUrl( name )
{
  return self.data.url( name ).replace( "/data/", "/" );
}

function notDataRead( name )
{
  return self.data.load( "../" + name );
}

pageMod.PageMod({
    include: "*.ycombinator.com",
    attachTo: [ "top" ],
    onAttach: function( things ) {
      console.error( "Attached!" );
    },
    contentStyleFile: [ notDataUrl( "lib/extras/hn_theme.css" ) ],
    contentScriptFile: [
      notDataUrl( "lib/tools/utility.js" ),
      notDataUrl( "lib/settings.js" ),
      notDataUrl( "lib/modules/visual_theme.js" ),
      notDataUrl( "lib/modules/high_contrast.js" ),
      notDataUrl( "lib/modules/gray_visited_links.js" ),
      notDataUrl( "lib/modules/open_links_in_new_tabs.js" ),
      notDataUrl( "lib/modules/highlight_links_when_returning.js" ),
      notDataUrl( "lib/modules/infinite_scrolling.js" ),
      notDataUrl( "lib/modules/accurate_domain_names.js" ),
      notDataUrl( "lib/modules/mark_as_read.js" ),
      notDataUrl( "lib/modules/fold_comments.js" ),
      notDataUrl( "lib/modules/sticky_header.js" ),
      notDataUrl( "lib/modules/user_tooltips.js" )
    ],
    contentScriptOptions: {
      urlBase: notDataUrl( "" ),
      defaultOptions: notDataRead( "lib/defaults.json" )
    }
});
