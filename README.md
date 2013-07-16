# HN Special
A theme and extension for [Hacker News](http://news.ycombinator.com).
Improves the look and feel and adds some interesting features.

The available features can be enabled or disabled based on your personal preference.

## Planned features
 - A modern looking visual theme
 - Infinite scrolling
 - Open links in new tab
 - Hide articles with certain keywords
 - More accurate domain names
 - (Maybe) Mark all as read

## Contributing
The CSS is built using [Stylus](http://learnboost.github.io/stylus/). If you'd like to contribute, you should first install [Node](http://nodejs.org/), and then get `stylus`:
```
npm install -g stylus
```

You can then tell Stylus to watch the changes to the `.styl` file and compile automatically:
```
stylus -c -w hn_theme.styl
```

### A note about the CSS
Some of the selectors in the CSS are very contrived. I found it was the only way to select what I wanted in a document made of tables within tables with barely any classes. I tried to use class selectors wherever I could, but it's mostly unavoidable to go down a long chain of selectors. If you spot any ways to improve any of the selectors, please make a pull request and I'll be glad to take it in!

## License
HN Special is licensed under the MIT License:
```
The MIT License (MIT)
Copyright (c) 2013 Gabriele Cirulli
 
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
