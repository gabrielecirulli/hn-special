HNSpecial.settings.registerModule("save_for_later", function () {
    function addSaveButtons() {
        // get the saved post id's
        chrome.storage.local.get('saved', function(result) {
            var saved = result.saved;
            var subtexts = document.getElementsByClassName('subtext');

            // add save/saved buttons to all subtexts
            for(var i = 0; i < subtexts.length; i++) {
                if(subtexts[i].getElementsByTagName('a').length) {
                    var flag = subtexts[i].getElementsByTagName('a')[1];
                    var link = document.createElement('a');

                    function configureLink() {
                        // configure link based on whether or not it's saved
                        link.href = 'javascript:void(0)';
                        link.onclick = toggleSave;
                        if(saved && saved[getId(subtexts[i])]) {
                            link.className = 'saved';
                            link.innerHTML = 'saved&#x2713;';
                        }
                        else {
                            link.innerHTML = 'save';
                        }
                    }
                    configureLink();

                    subtexts[i].insertBefore(link, flag);
                    subtexts[i].insertBefore(document.createTextNode(' | '), flag);
                }
            }
        });

        function getId(subtext) {
            var length = subtext.getElementsByTagName('a').length;
            var postId = subtext.getElementsByTagName('a')[length - 1].href;
            return postId.split('id=').pop();
        }
    }

    function toggleSave(e) {
        // are we removing or adding the post?
        var removed = e.srcElement.classList.contains('saved');

        var length = e.srcElement.parentNode.getElementsByTagName('a').length;
        var id = e.srcElement.parentNode.getElementsByTagName('a')
        [length - 1].href.split('id=').pop();

        length = e.srcElement.parentNode.parentNode.previousSibling
        .getElementsByClassName('title').length;
        var title = e.srcElement.parentNode.parentNode.previousSibling
        .getElementsByClassName('title')[length - 1].getElementsByTagName('a')[0]
        .innerHTML;

        // add/remove and update button accordingly
        _.sendMessage("save_for_later#toggle", {
            id: id, title: title
        }, function() {
            if(removed) {
                e.srcElement.className = '';
                e.srcElement.innerHTML = 'save';
            }
            else {
                e.srcElement.className = 'saved';
                e.srcElement.innerHTML = 'saved&#x2713;';
            }
        });
    }

    function viewSaved() {
        if(document.getElementById('saved-posts')) {
            var div = document.getElementById('saved-posts');
            div.parentNode.removeChild(div);
            moveTable();
        }
        else {
            var savedPosts = document.createElement('div');
            savedPosts.id = 'saved-posts';

            chrome.storage.local.get('saved', addPosts);
        }

        function addPosts(result) {
            var saved = result.saved;
            if(saved) {
                var href = 'https://news.ycombinator.com/item?id=';
                for(var id in saved) {
                    var title = saved[id];
                    savedPosts.innerHTML += '<a href="' + href + id + '">' +
                    title + '</a> <br>';
                }
            }
            else {
                savedPosts.innerHTML =
                'Click the "save" button under posts to save them.';
            }
            document.getElementsByTagName('center')[0].appendChild(savedPosts);
            moveTable();
        }

        function moveTable() {
            var posts = document.getElementById('saved-posts');
            var height;
            if(!posts) height = '0px';
            else {
                height = window.getComputedStyle(posts, null)
                .getPropertyValue("height");
            }

            var tbody = document.getElementsByTagName('tbody')[0];
            var tr = tbody.getElementsByTagName('tr')[3];
            var td = tr.getElementsByTagName('td')[0];
            var table = td.getElementsByTagName('table')[0];
            table.style.marginTop = height;
        }
    }




    // -----> THE PARTY STARTS HERE!!!! <-----

    // clear saved posts (for testing)
    // chrome.storage.local.clear();

    // Add the saved link to the header
    var pagetop = document.getElementsByClassName('pagetop')[0];
    var savedLink = document.createElement('a');
    savedLink.href = "javascript:void(0)";
    savedLink.onclick = viewSaved;
    var notVisualTheme = document.getElementsByClassName('logo').length == 0;
    if(notVisualTheme) savedLink.innerHTML = ' | [saved]';
    else savedLink.innerHTML = '[saved]';
    pagetop.appendChild(savedLink);

    // Add the first page of save buttons
    addSaveButtons();
    // Add save buttons every time new links are loaded
    HNSpecial.settings.subscribe("new links", addSaveButtons);
});
