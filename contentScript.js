if(window.location.href == "http://192.168.1.1/" && document.body.innerHTML.includes('<span class="load" style="display: none">for cache</span>')) {
    fetch(chrome.extension.getURL("code/indexx.html"))
    .then(response => response.text())
    .then(html => {
        // Replace the entire HTML content of the webpage with the fetched HTML
        document.open();
        document.write(html);
        document.close();
    })
    .catch(error => console.error('Error loading HTML file:', error));
}

// var newDoc = document.implementation.createHTMLDocument("New Document");
// newDoc.documentElement.innerHTML = `HTML`;
// document.open();
// document.write(newDoc.documentElement.innerHTML);
// document.close();