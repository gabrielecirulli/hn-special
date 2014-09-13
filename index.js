var self    = require('sdk/self'),
    pageMod = require('sdk/page-mod');

console.error( "I actually loaded, I promise." );

pageMod.PageMod({
    include: "*.ycombinator.com",
    attachTo: [ "top" ],
    onAttach: function( things ) {
        console.error( "Attached!" );
    },
    contentStyleFile: [ self.data.url( "lib/extras/hn_theme.css" ) ],
    contentScriptFile: [
        self.data.url( "lib/tools/utility.js" ),
        self.data.url( "lib/settings.js" ),
        self.data.url( "lib/modules/visual_theme.js" ),
        self.data.url( "lib/modules/high_contrast.js" ),
        self.data.url( "lib/modules/gray_visited_links.js" ),
        self.data.url( "lib/modules/open_links_in_new_tabs.js" ),
        self.data.url( "lib/modules/highlight_links_when_returning.js" ),
        self.data.url( "lib/modules/infinite_scrolling.js" ),
        self.data.url( "lib/modules/accurate_domain_names.js" ),
        self.data.url( "lib/modules/mark_as_read.js" ),
        self.data.url( "lib/modules/fold_comments.js" ),
        self.data.url( "lib/modules/sticky_header.js" ),
        self.data.url( "lib/modules/user_tooltips.js" )
    ],
});
