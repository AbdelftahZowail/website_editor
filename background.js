//chrome-extension://pfbmdbafgdgdpolfkjicnnnebggglfbm/

var on = true;
var exact = false;
var sites = ["https://onemillioncheckboxes.com/index.375cad65.js"];
var names = ['toggle.js'];

var got = [];
// var sitesExact = [
//     "https://todoist.b-cdn.net/assets/1482.8f68f006dc74ba8526c70996684b23cb.js",
//     "https://todoist.b-cdn.net/assets/5860.7f845edb6225eea757a17e6c1251b6bf.js", 
//     "https://todoist.b-cdn.net/assets/app-d91a9049.16f3661e76a8c5064acfd0e4700ac43f.js"];
// var namesExact = [ "todo1.js", "todo2.js", "todo3.js"];
var sitesExact = [];
var namesExact = [];

console.log("lmaoooooooooooaksoak");
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        console.log("asddsa: ", details.url)    
        if (containsString(details.url) && on) {
            const localScriptUrl = !exact?
            chrome.extension.getURL("code/"+names[sites.indexOf(containsString(details.url))]):
            chrome.extension.getURL("code/"+namesExact[sitesExact.indexOf(containsString(details.url))]);
            console.log("lolol: ", details.url, localScriptUrl)    
            return { redirectUrl: localScriptUrl };
        }
    },
    { urls: ["<all_urls>"]},
    ["blocking"]
);
// chrome.webRequest.onHeadersReceived.addListener(
//     function(details) {
//         if(details.url.includes("my.brain.fm/assets/index-rYFkB5KL.js")){
//             console.log('looooooool', details.responseHeaders);
//             for (var i = 0; i < details.responseHeaders.length; ++i) {
//                 if (details.responseHeaders[i].name.toLowerCase() === 'content-type') {
//                     // Set the correct MIME type for JavaScript
//                     details.responseHeaders[i].value = 'application/javascript';
//                     break;
//                 }
//             }
//             return { responseHeaders: details.responseHeaders };    
//         }
//     },
//     { urls: ["<all_urls>"] },
//     ["blocking", "responseHeaders"]
// );

function containsString(searchString) {
    var print = false;
    if(searchString.includes("my.brain.fm/assets/index-rYFkB5KL.js")){
        console.log("searchString")
        print = true;
    }
    if (sitesExact.includes(searchString)) {
        exact = true;
        return searchString;
    }
    if(print) console.log("searchString", searchString);
    for (let i = 0; i < sites.length; i++) {
        if (searchString.includes(sites[i])) {
            if(print) console.log(searchString, "==", sites[i]);
            exact = false;
            return sites[i];
        }
        if(print) console.log(searchString, "!=", sites[i]);
    }
    return null;
}
