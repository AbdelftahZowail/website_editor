# Simple Webpage Interceptor/Editor - Chrome Extension

This Chrome extension is a developer tool designed to intercept specific web requests (primarily for JavaScript files) and redirect them to local versions stored within the extension package. It also includes functionality to replace the entire HTML content of a specific predefined webpage.

Its primary purpose is for **development, testing, debugging, and customization** of live websites by allowing developers to inject or replace scripts/pages without modifying the remote server.

## Problem Solved

*   **Testing Local Changes:** Test modifications to a JavaScript library or script on a live website without needing to deploy the changes first.
*   **Debugging:** Substitute a production script with a debug version containing more logging or instrumentation.
*   **Bypassing Scripts:** Prevent certain third-party or problematic scripts from loading by redirecting them (potentially to an empty local file).
*   **Customizing Specific Pages:** Replace the content of a known (often local network) webpage with custom HTML for a tailored interface (as seen with the `192.168.1.1` example).

## Features

*   **JavaScript Redirection:** Intercepts network requests for specified JavaScript file URLs.
*   **Local File Substitution:** Redirects intercepted requests to load local JavaScript files packaged within the extension's `/code` directory.
*   **Matching Modes:** Supports both:
    *   **Partial URL Matching:** Redirects if the request URL *contains* a string from the `sites` list.
    *   **Exact URL Matching:** Redirects only if the request URL *exactly* matches a string from the `sitesExact` list.
*   **HTML Page Replacement:** Replaces the entire content of a *specifically configured* URL (`http://192.168.1.1/` in the example) with local HTML (`code/indexx.html`) if a marker element is found.
*   **Configurable Targets:** All target URLs and corresponding local replacement filenames are configured directly within the `background.js` script.
*   **(Intended) On/Off Toggle:** Includes a variable (`on`) in `background.js` intended to enable/disable the interception (currently hardcoded to `true`).

## How It Works

1.  **Background Script (`background.js`):**
    *   Uses the `chrome.webRequest.onBeforeRequest` API with the `blocking` permission to intercept outgoing network requests before they are sent.
    *   For each request, it checks the URL against the `sitesExact` and `sites` arrays defined within the script.
    *   If a match is found and the `on` variable is true:
        *   It determines the corresponding local filename from the `namesExact` or `names` array based on the match type.
        *   It constructs the full URL to the local file within the extension's `/code` directory using `chrome.extension.getURL()`.
        *   It returns a `{ redirectUrl: ... }` object to Chrome, instructing the browser to fetch the local file instead of the original remote URL.
2.  **Content Script (`contentScript.js`):**
    *   Runs on all pages loaded in the browser.
    *   Checks if the current page's URL exactly matches a predefined target (`http://192.168.1.1/` in the example) AND if the page's HTML contains a specific marker string (`<span class="load" style="display: none">for cache</span>`).
    *   If both conditions are met, it fetches the content of a local HTML file (`code/indexx.html`) packaged with the extension.
    *   It then completely replaces the current page's `document` content with the fetched local HTML.
3.  **Manifest (`manifest.json`):**
    *   Declares necessary permissions (`webRequest`, `webRequestBlocking`, `<all_urls>`).
    *   Registers the background script.
    *   Registers the content script to run everywhere.
    *   **Crucially**, declares the local files in the `/code` directory as `web_accessible_resources`, allowing external websites (via the redirection) or the content script to load them.

## Configuration (Manual - Edit Files)

**This extension requires manual configuration before use.**

1.  **Edit `background.js`:**
    *   **`sites` array:** Add URL *fragments* or full URLs of remote scripts you want to intercept using partial matching.
    *   **`names` array:** Add the corresponding *local filenames* (found in the `/code` directory) for each entry in the `sites` array. **The order must match `sites`.**
    *   **`sitesExact` array:** Add *exact* full URLs of remote scripts you want to intercept using exact matching.
    *   **`namesExact` array:** Add the corresponding *local filenames* for each entry in the `sitesExact` array. **The order must match `sitesExact`.**
    *   **(Optional)** Modify the `on` variable (`true` or `false`) to enable/disable interception globally (requires extension reload).

2.  **Create `/code` Directory:**
    *   In the same folder as `manifest.json`, create a subdirectory named `code`.
    *   Place all your local replacement JavaScript files (e.g., `toggle.js`) and HTML files (e.g., `indexx.html`) inside this `code` directory.

3.  **Edit `manifest.json`:**
    *   **Update `web_accessible_resources`:** Ensure **every** local file within the `/code` directory that you intend to use as a replacement is listed here.
        *Example:*
        ```json
        "web_accessible_resources": [
          "code/toggle.js",
          "code/another_script.js",
          "code/indexx.html"
        ]
        ```

4.  **Edit `contentScript.js` (for HTML replacement):**
    *   Modify the `window.location.href == "..."` check if you want to target a different URL for HTML replacement.
    *   Modify the `document.body.innerHTML.includes('...')` check if the target page uses a different marker or no marker is needed.
    *   Change `code/indexx.html` if your local replacement HTML file has a different name.

## Installation

Since this extension modifies network requests and is intended for development, it's not suitable for the Chrome Web Store and must be loaded manually:

1.  **Download/Clone Files:** Place all files (`manifest.json`, `background.js`, `contentScript.js`) and the configured `/code` directory together in a single folder (e.g., `web-interceptor`).
2.  **Open Chrome Extensions:** Open Google Chrome, type `chrome://extensions` in the address bar, and press Enter.
3.  **Enable Developer Mode:** Toggle the "Developer mode" switch in the top-right corner **on**.
4.  **Load Unpacked:** Click the "Load unpacked" button that appears.
5.  **Select Folder:** Navigate to and select the folder containing the extension files (e.g., `web-interceptor`).
6.  **Done:** The extension should now appear in your list. Reload the extension after any configuration changes.

## Usage

1.  Configure the extension files (`background.js`, `manifest.json`, `contentScript.js`) and place your local replacement files in the `/code` directory as described above.
2.  Install or Reload the extension via `chrome://extensions`.
3.  Navigate to the website(s) containing the JavaScript files you configured for interception, or navigate to the specific URL configured for HTML replacement.
4.  The extension will automatically intercept matching requests and load your local files instead, or replace the HTML content as configured.
5.  Use your browser's Developer Tools (Network tab, Console) to verify the redirection or replacement and debug issues.
