# HN Special — A Hacker News extension
A theme and extension for [Hacker News](http://news.ycombinator.com) that improves the look and feel and adds some interesting features.

The available features can be enabled or disabled based on your personal preference. New feature contributions are welcome!

You can install this extension [from the Chrome Web Store](https://chrome.google.com/webstore/detail/hn-special-an-addition-to/cchaceegbflphbdpfocjalgjhjoahiia).

## Features
 - A modern looking visual theme
 - Infinite scrolling
 - Open links in new tab
 - More accurate domain names
 - Comment folding
 - Mark as read (thanks to [@taeram](https://twitter.com/taeram/))
 - Sticky header (thanks to [@obeattie](https://twitter.com/obeattie))
 - Grey visited links (thanks to bjenik)
 - User information tooltips (thanks to sebmck)

#### Potential future features
 - Hide articles with certain keywords

## Installing
Go ahead and install HN Special [from the Chrome Web Store](https://chrome.google.com/webstore/detail/hn-special-an-addition-to/cchaceegbflphbdpfocjalgjhjoahiia).  
Please avoid installing it from the *Releases* section of this repository because the latest release isn't the most up-to-date one.

## Contributing
The CSS is built using [Stylus](http://learnboost.github.io/stylus/). If you'd like to contribute, you should first install [Node](http://nodejs.org/), and then get `stylus`:
```
npm install -g stylus
```

You can then edit `lib/extras/hn_theme.styl` and tell Stylus to watch the changes to the `.styl` file and recompile automatically:
```
stylus -c -w lib/extras/hn_theme.styl
```

### A note about the CSS
Some of the selectors in the CSS are very contrived. I found it was the only way to select what I wanted in a document made of tables within tables with barely any classes. I tried to use class selectors wherever I could, but it's mostly unavoidable to go down a long chain of selectors. If you spot any ways to improve any of the selectors, please make a pull request and I'll be glad to take it in!

### Adding a module
If you want to add a new module, please edit `lib/defaults.json` and add a descriptive key for your module (it will be used as the actual module name in the settings panel) and increment the `settings_version` key. If the module depends on another module to run, please also make sures to add it to `requirements` properly.  
Please keep your new module disabled by default if it's a change that could overwhelm some users. There is also some code in place that will notify the users of the presence of a new module whenever their installation of the extension is auto-updated.

For the actual code, create a JavaScript file in `lib/modules` with the same name as the module, and subscribe to the settings object through the module's key (take a look at `lib/modules/open_links_in_new_tabs.js` for an example). This will make the code in your module execute only if the setting is enabled from the interface. **NOTE**: don't forget to add your JS file to `manifest.json` and uninstall/reinstall the extension from the `chrome://extensions` page before you begin developing, or else your module won't be loaded. Simply pressing the reload button in the extensions page should work fine for all subsequent changes (or you can install the [Extension Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) for easier access).

## Contributions and mentions
Many thanks to [@taeram](https://twitter.com/taeram/), [@obeattie](https://twitter.com/obeattie), bjenik, sebmck and [@messaged](https://twitter.com/messaged) for the contributions!

## License
HN Special is licensed under the MIT License:
```
The MIT License (MIT)

Copyright (c) 2013 Gabriele Cirulli

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
