# Contributing

## Reporting an issue

Thanks for taking the time to report an issue. Please describe the issue in as much detail as possible and include, if possible, your Chrome version and the steps needed to reproduce the issue (if needed).

## Building the extension

### Chrome

See [this Stack Overflow answer](https://stackoverflow.com/questions/11480985/can-a-greasemonkey-type-userscript-be-packaged-as-a-chrome-extension/11481476#11481476) on how to package an extension.

### Firefox

If you haven't installed [Node.JS](http://nodejs.org/) and [jpm](https://github.com/mozilla/jpm), do so:

```
npm install -g web-ext
```

From here you have two options for testing. One, you can run the addon in Firefox test mode. To do this, run:

```
web-ext run
```

To create a release package, simply run:

```
web-ext build
```

## Modifying the style

The CSS is built using [Stylus](http://learnboost.github.io/stylus/). If you'd like to contribute, you should first install [Node](http://nodejs.org/), and then get `stylus`:

```
npm install -g stylus
```

You can then edit `lib/extras/_theme.styl` or whatever theme you are changing and tell Stylus to watch the changes to the `.styl` file and recompile automatically:

```
stylus -c -w lib/extras/hn_theme_light.styl
```

### A note about the CSS

Some of the selectors in the CSS are very contrived. I found it was the only way to select what I wanted in a document made of tables within tables with barely any classes. I tried to use class selectors wherever I could, but it's mostly unavoidable to go down a long chain of selectors. If you spot any ways to improve any of the selectors, please make a pull request and I'll be glad to take it in!

## Adding a module

If you want to add a new module, please edit `lib/defaults.json` and add a descriptive key for your module (it will be used as the actual module name in the settings panel) and increment the `settings_version` key. If the module depends on another module to run, please also make sures to add it to `requirements` properly.  
Please keep your new module disabled by default if it's a change that could overwhelm some users. There is also some code in place that will notify the users of the presence of a new module whenever their installation of the extension is auto-updated.

For the actual code, create a JavaScript file in `lib/modules` with the same name as the module, and subscribe to the settings object through the module's key (take a look at `lib/modules/open_links_in_new_tabs.js` for an example). This will make the code in your module execute only if the setting is enabled from the interface. **NOTE**: don't forget to add your JS file to `manifest.json` and uninstall/reinstall the extension from the `chrome://extensions` page before you begin developing, or else your module won't be loaded. Simply pressing the reload button in the extensions page should work fine for all subsequent changes (or you can install the [Extension Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) for easier access).
