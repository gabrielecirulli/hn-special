HNSpecial.settings.registerModule("keyboard_shortcuts", function () {

    Direction = {
        UP : 0,
        DOWN : 1
    };

    var currentPosition = 0;
    var searchPos = 0;

    var articleTable = document.getElementsByTagName("table")[2];
    var rows = articleTable.getElementsByTagName("tr");

    document.onkeypress = function (e) {
        var keyCode = e.keyCode;
        if (keyCode == 106) { // j
            highlight(Direction.DOWN);
        } else if (keyCode == 107) { // k
            highlight(Direction.UP);
        } else if (keyCode == 111) { // o
            clickLink();
        } else if (keyCode == 99) { // c
            viewComments();
        }
    };

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

    function findNextArticle(position) {
        for (var index = position; index < rows.length; index++) {
            if (rows[index].getElementsByClassName("title").length == 2) {
                return index;
            }
        } 

        return position-1;
    }

    function findPrevArticle(position) {
        for (var index = position; index >= 0; index--) {
            if (rows[index].getElementsByClassName("title").length == 2) {
                return index;
            }
        } 

        return position;
    }

    function clickLink() {  
        var title = rows[currentPosition].getElementsByClassName("title")[1];
        var anchor = title.getElementsByTagName("a")[0];
        if (_.isTitleLink(anchor)) {
            var href = anchor.getAttribute("href");
            window.open(href);
        }
    }

    function viewComments() {
        var anchor = rows[currentPosition+1].getElementsByTagName("a")[1];
        var href = anchor.getAttribute("href");
        window.open(href);
    }

    function scrollElmVert(el,num) { // to scroll up use a negative number
        var re=/html$/i;
        while(!re.test(el.tagName) && (1 > el.scrollTop)) el=el.parentNode;
        if(0 < el.scrollTop) el.scrollTop += num;
    }
});