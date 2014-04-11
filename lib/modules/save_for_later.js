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
                        if(saved.indexOf(getId(subtexts[i])) > -1) {
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
            var postId = subtext.getElementsByTagName('a')[2].href;
            return postId.split('id=').pop();
        }
    }

    function toggleSave(e) {
        // are we removing or adding the post?
        var removed = e.srcElement.classList.contains('saved');

        var postId = e.srcElement.parentNode.getElementsByTagName('a')[3].href
        .split('id=').pop();

        var title = e.srcElement.parentNode.parentNode.previousSibling
        .getElementsByClassName('title')[1].getElementsByTagName('a')[0]
        .innerHTML;

        // add/remove and update button accordingly
        _.sendMessage("save_for_later#toggle", {
            postId: postId, title: title
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
        console.log('view saved...');
    }




    // -----> THE PARTY STARTS HERE!!!! <-----

    // Add the saved link to the header
    var pagetop = document.getElementsByClassName('pagetop')[0];
    var savedLink = '<a href="javascript:void(0)" onclick=viewSaved()">[saved]</a>';
    var notVisualTheme = document.getElementsByClassName('logo').length == 0;
    if(notVisualTheme) savedLink = ' | ' + savedLink;
    pagetop.innerHTML += savedLink

    // Add the first page of save buttons
    addSaveButtons();
    // Add save buttons every time new links are loaded
    HNSpecial.settings.subscribe("new links", addSaveButtons);
});
