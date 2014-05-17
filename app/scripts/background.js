'use strict';

OAuth.initBackgroundPage();

chrome.browserAction.onClicked.addListener(function( /*info, tab*/ ) {
});

chrome.runtime.onInstalled.addListener(function( details ) {
    console.log('previousVersion', details.previousVersion);
});
