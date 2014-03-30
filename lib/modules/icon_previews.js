HNSpecial.settings.registerModule("icon_previews", function () {
    function loadIcons() {
        var table = document.getElementsByTagName('table')[2];
        var titles = table.getElementsByClassName('title');
        var posts = [];
        for(var i = 0, count = 0; i < titles.length; i++) {
            var isLink = titles[i].firstChild.tagName == 'A';
            var notMore = titles[i].innerText.indexOf('More') != 0;
            var newLink = titles[i].className.indexOf('with-icon') == -1;
            if(isLink && notMore && newLink) {
                titles[i].className += ' with-icon';
                titles[i].innerHTML = '<div class="with-icon">' +
                titles[i].innerHTML + '</div>';

                var subtext = titles[i].parentNode.nextSibling
                .getElementsByClassName('subtext')[0];
                subtext.className += ' with-icon';
                changeTag(subtext, 'span');
                
                var icon = document.createElement('div');
                icon.className = 'icon';
                var iconLoad = document.createElement('img');
                iconLoad.className = 'icon-load';
                iconLoad.src = chrome.runtime.getURL('resources/icon-load.gif');

                titles[i].insertBefore(icon, titles[i].firstChild);
                icon.appendChild(iconLoad);

                function loadImage(count, src, icon) {
                    var imgEl = new Image();
                    imgEl.className = 'icon-img';
                    imgEl.onload = function() {
                        icon.appendChild(imgEl);
                        icon.firstChild.style.opacity = '0';
                        setTimeout(function() {
                            icon.removeChild(icon.firstChild);
                        }, 500);
                    }
                    imgEl.src = src;
                }
                var link = titles[i].children[1].firstChild.href;
                var base = 'http://www.coffeecodecou.ch/hn-special/icon?url=';
                var askUrl = 'https://news.ycombinator.com/item?id=';
                var text = chrome.runtime.getURL('resources/text-icon.jpg');
                if(link.indexOf(askUrl) != 0) {
                    loadImage(count, base + encodeURIComponent(link), icon);
                }
                else {
                    loadImage(count, text, icon);
                }

                count++;
            }
        }

        function changeTag(element, newTag) {
            var newEl = document.createElement(newTag);
            newEl.innerHTML = element.innerHTML;
            newEl.id = element.id;
            newEl.className = element.className;
            element.parentNode.insertBefore(newEl, element);
            element.parentNode.removeChild(element);
        }
    }

    function runOnCorrectPages() {
        var isAsk = location.pathname == '/item';
        var isItem = document.title.indexOf('Ask') == 0;
        if(!isAsk && !isItem) loadIcons();
    }

    // Run it
    runOnCorrectPages();

    // Subscribe to the event emitted when new links are present
    HNSpecial.settings.subscribe("new links", runOnCorrectPages);
});
