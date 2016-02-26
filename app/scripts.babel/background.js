'use strict';

chrome.runtime.onInstalled.addListener(details => {
  // console.log('previousVersion', details.previousVersion);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.replacementCount > 0){
        chrome.browserAction.setBadgeBackgroundColor({color:[230, 67, 49, 230]});
        chrome.browserAction.setBadgeText({text:request.replacementCount});
    }
});
