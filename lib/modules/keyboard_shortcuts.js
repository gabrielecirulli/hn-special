HNSpecial.settings.registerModule("keyboard_shortcuts", function () {

    /**
     * Enum of directions to move in.
     * 
     * @type {Enum}
     */
    Direction = {
        UP : 0,
        DOWN : 1
    };

    /**
     * The current position.
     */
    var currentPosition = 0;

    /**
     * The search position.
     */
    var searchPos = 0;

    /**
     * Reference to the article table
     */
    var articleTable = document.getElementsByTagName("table")[2];

    /**
     * The rows in the article table.
     */
    var rows = articleTable.getElementsByTagName("tr");

    /**
     * indicating whether key presses should be blocked.
     */
    var blocked = false;

    /**
     * Hook up key binding. Blocked if in help.
     */
    document.onkeypress = function (e) {
        var keyCode = e.keyCode;
        if (keyCode == 106 && !blocked) { // j
            highlight(Direction.DOWN);
        } else if (keyCode == 107 && !blocked) { // k
            highlight(Direction.UP);
        } else if (keyCode == 111 && !blocked) { // o
            clickLink();
        } else if (keyCode == 99 && !blocked) { // c
            viewComments();
        } else if (keyCode == 63) { // ?
            showHideHelp();
        }
    };

    /**
     * Highlight the next/previous article.
     * 
     * @param  {Direction} direction the direction to move in
     */
    function highlight(direction) {
        var previousPosition = currentPosition;

        if (direction == Direction.DOWN) {
            if (currentPosition + 1 < rows.length) {
                currentPosition = findNextArticle(searchPos);
                searchPos = currentPosition + 1;
            }
        } else if (direction == Direction.UP) {
            if (currentPosition - 1 > 0) {            
                searchPos = currentPosition - 1;
                currentPosition = findPrevArticle(searchPos);
            }
        }

        rows[previousPosition].classList.remove("hn-special-keyboard-hightlight");
        rows[currentPosition].classList.add("hn-special-keyboard-hightlight");
        rows[currentPosition].scrollIntoView(true);
        scrollElmVert(rows[currentPosition], -90);
    }

    /**
     * Find the next article.
     * 
     * @param  {integer} position the current position
     * @return {integer}          the next article position
     */
    function findNextArticle(position) {
        for (var index = position; index < rows.length; index++) {
            if (rows[index].getElementsByClassName("title").length == 2) {
                return index;
            }
        } 

        return position-1;
    }

    /**
     * Find the previous article.
     * 
     * @param  {integer} position the current position
     * @return {integer}          the previous article position
     */
    function findPrevArticle(position) {
        for (var index = position; index >= 0; index--) {
            if (rows[index].getElementsByClassName("title").length == 2) {
                return index;
            }
        } 

        return position;
    }

    /**
     * Open the selected article in a new tab.
     */
    function clickLink() {  
        var title = rows[currentPosition].getElementsByClassName("title")[1];
        var anchor = title.getElementsByTagName("a")[0];
        if (_.isTitleLink(anchor)) {
            var href = anchor.getAttribute("href");
            window.open(href);
        }
    }

    /**
     * Open the selected article's comments in a new tab.
     */
    function viewComments() {
        var anchor = rows[currentPosition+1].getElementsByTagName("a")[1];
        var href = anchor.getAttribute("href");
        window.open(href);
    }

    /**
     * Show or hide the help dialog.
     */
    function showHideHelp() {
        var helpDiv = document.body.getElementsByClassName("hn-special-overlay")[0];
        if (helpDiv === undefined) {
            helpDiv = injectHelp();
        }

        if (helpDiv.style.visibility == "visible") {
            helpDiv.style.visibility =  "hidden";
            blocked = false;
        } else {
            helpDiv.style.visibility = "visible";
            blocked = true;
        }
    }

    /**
     * Inject the help dialog into the page.
     * @return {element} the help div
     */
    function injectHelp() {
        var helpContent = 
        '<div class="outer"><div class="middle"><div class="inner"> \
            <h1>Keyboard shortcuts</h1> \
            <table> \
              <tbody> \
                <tr> \
                  <td class="keys"><span class="key">j</span></td> \
                  <td>Go down to the next item.</td> \
                </tr> \
                <tr> \
                  <td class="keys"><span class="key">k</span></td> \
                  <td>Go up to the next item.</td> \
                </tr> \
                <tr> \
                  <td class="keys"><span class="key">o</span></td> \
                  <td>Open selected item\'s link in a new tab.</td> \
                </tr> \
                <tr> \
                  <td class="keys"><span class="key">c</span></td> \
                  <td>Open selected item\'s comments in a new tab.</td> \
                </tr> \
                <tr> \
                  <td class="keys"><span class="key">?</span></td> \
                  <td>Display/hide this help message.</td> \
                </tr> \
              </tbody> \
            </table> \
            </div></div></div>';

        var helpDiv = document.createElement('div');
        helpDiv.innerHTML = helpContent;
        helpDiv.className = 'hn-special-overlay';
        document.body.appendChild(helpDiv);

        return helpDiv;
    }

    function scrollElmVert(el,num) { // to scroll up use a negative number
        var re=/html$/i;
        while(!re.test(el.tagName) && (1 > el.scrollTop)) el=el.parentNode;
        if(0 < el.scrollTop) el.scrollTop += num;
    }
});