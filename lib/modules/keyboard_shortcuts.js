HNSpecial.settings.registerModule("keyboard_shortcuts", function () {

	Direction = {
		UP : 0,
		DOWN : 1
	};

	var currentPosition = 0;
    var searchPos = 0;

	var articleTable = document.getElementsByTagName("table")[2];

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
    	var rows = articleTable.getElementsByTagName("tr");

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
        var rows = articleTable.getElementsByTagName("tr");
        for (var index = position; index < rows.length; index++) {
            if (rows[index].getElementsByClassName("title").length == 2) {
                return index;
            }
        } 

        return position-1;
    }

    function findPrevArticle(position) {
        var rows = articleTable.getElementsByTagName("tr");
        for (var index = position; index >= 0; index--) {
            if (rows[index].getElementsByClassName("title").length == 2) {
                return index;
            }
        } 

        return position;
    }


    function clickLink() {	
        if (currentPosition >= 0) {
            var tr = articleTable.getElementsByTagName("tr")[currentPosition];
            var title = tr.getElementsByClassName("title")[1];
            var anchor = title.getElementsByTagName("a")[0];
            var href = anchor.getAttribute("href");
        	window.open(href);
        }
    }

    function viewComments() {
        // TODO: Implement
    }


    function scrollElmVert(el,num) { // to scroll up use a negative number
        var re=/html$/i;
        while(!re.test(el.tagName) && (1 > el.scrollTop)) el=el.parentNode;
        if(0 < el.scrollTop) el.scrollTop += num;
    }
});