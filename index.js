var self    = require('sdk/self'),
    pageMod = require('sdk/page-mod');

function notDataUrl( name )
{
  return self.data.url( name ).replace( "/data/", "/" );
}

function notDataRead( name )
{
  return self.data.load( "../" + name );
}

let { Cc, Ci } = require('chrome');

var modules = {
  mark_as_read: {
    toggle: function (params) {
      var self = this;
      let { search } = require("sdk/places/history");

      search(params)
        .on("end", function (results) {
        if (results.length > 0) {
          self.delete(params);
        } else {
          self.add(params);
        }
      });
    },
    delete: function (params) {
      console.error( "Removing: ", params.url );
      Cc["@mozilla.org/browser/nav-history-service;1"]
        .getService(Ci.nsIBrowserHistory).removePage(params);

    },
    add: function (params) {
      console.error( "Adding: ", params.url );
      Cc["@mozilla.org/browser/history;1"]
        .getService(Ci.mozIAsyncHistory).updatePlaces( {
          uri: params.url,
          visitDate: new Date().toJSON().slice(0,10)
        } );
    }
  }
};

pageMod.PageMod({
  include: "*.ycombinator.com",
  attachTo: [ "top" ],
  contentStyleFile: [ 
    notDataUrl( "lib/extras/hn_theme.css" ),
    notDataUrl( "lib/extras/hn_theme_dark.css" )
  ],
  contentScriptFile: [
    notDataUrl( "lib/tools/utility.js" ),
    notDataUrl( "lib/settings.js" ),
    notDataUrl( "lib/modules/visual_theme.js" ),
    notDataUrl( "lib/modules/dark_theme.js" ),
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
  },
  onAttach: function(worker) {
    for( var moduleName in modules )
    {
      var module = modules[ moduleName ];

      for( var actionName in modules[ moduleName ] )
      {
        worker.port.on( moduleName + "#" + actionName, function( params ) {
          module[ actionName ].call( module, params );
        } );
      }
    }
  }
});
