/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(url);
    });
}

/**
 * Load the extension when the dom content is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    getCurrentTabUrl(function(url) {

        var x = new XMLHttpRequest();
        x.open('GET', url);
        x.onload = function() {
            // Parse and process the response from Google Image Search.
            var d = x.responseText;
            var base64 = d.split('files="')[1].split('"')[0];
            var json = atob(base64);
            var object = JSON.parse(json);
            var ul = document.getElementById('downloads');
            document.getElementById('title').innerHTML = '';

            for (var download in object) {
                if (object.hasOwnProperty(download) && download != 'still') {
                    ul.innerHTML += '<li><a href="'+object[download]+'" download="download">Download '+download+'</a></li>';
                }
            }

        };
        x.onerror = function() {
            console.log('error');
        };
        x.send();
    });
});
