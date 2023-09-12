const redirects = {
    "google": "https://www.bing.com/",
    "youtube": "https://vimeo.com/",
    "facebook": "https://www.myspace.com/",
    "amazon": "https://www.ebay.com/",
    "netflix": "https://archive.org/details/movies",
    "twitter": "https://www.tumblr.com/",
    "linkedin": "https://www.monster.com/",
    "apple": "https://www.microsoft.com/",
    "instagram": "https://www.flickr.com/",
    "wikipedia": "https://www.uncyclopedia.ca/",
    // ... add more here
};

const REDIRECT_GRACE_PERIOD = 5000;  // 5 seconds; adjust as needed

chrome.webNavigation.onCommitted.addListener((details) => {
    const currentDomain = new URL(details.url).hostname;

    chrome.storage.local.get([`lastRedirect_${details.tabId}`], function (result) {
        const lastRedirect = result[`lastRedirect_${details.tabId}`];

        if (Date.now() - lastRedirect < REDIRECT_GRACE_PERIOD) {
            return;  // Too soon after the last redirect; do nothing
        }

        for (let keyword in redirects) {
            if (currentDomain.includes(keyword)) {
                console.log("Redirecting from", details.url, "to", redirects[keyword]);
                chrome.tabs.update(details.tabId, { url: redirects[keyword] });

                const obj = {};
                obj[`lastRedirect_${details.tabId}`] = Date.now();
                chrome.storage.local.set(obj);  // Store the timestamp of this redirect

                return;
            }
        }
    });
});