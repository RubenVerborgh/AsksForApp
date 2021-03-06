#!/usr/bin/env phantomjs
var USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
var APP_SIGNATURE = /apple-itunes-app|itunes.apple.com\S+app_id=|\bthe app\b|\b(mobile|native|iPhone|iOS|Android) app\b/i;
var SCREEN_SIZE = { width: 375, height: 667 }
var ACCEPT_LANGUAGE = 'en-US,en;q=0.8,fr;q=0.1';
var SKIPPED_RESOURCE = /\.(css|jpg|png|gif|woff2?)$/

var webPage = require('webpage'),
    system = require('system');

// Check all URLs passed as arguments
var urls = system.args.slice(1);
(function next() {
  if (urls.length) {
    var url = urls.shift();
    open(url, function () { check(url, next); });
  }
  else
    phantom.exit();
})();

function open(url, done) {
  var page = webPage.create();
  page.onError = function() {};
  page.onResourceRequested = function (requestData, request) {
    if (SKIPPED_RESOURCE.test(requestData.url))
      request.cancel();
  };
  page.open(url, function (status) {
    page.close();
    done();
  });
}

// Check the given URL
function check(url, done) {
  // Initialize page
  var page = webPage.create();
  page.viewportSize = SCREEN_SIZE;
  page.settings.loadImages = false;
  page.settings.resourceTimeout = 10000;
  page.customHeaders = getHeaders(url);

  // Ignore in-page errors
  page.onError = function() {};

  // Handle subresources
  page.onResourceRequested = function (requestData, request) {
    // Set correct headers
    var headers = getHeaders(requestData.url);
    for (var header in headers)
      request.setHeader(header, headers[header]);

    // Ignore non-relevant resources
    if (SKIPPED_RESOURCE.test(requestData.url))
      request.cancel();
  };

  // Open the page and inspect its source
  page.open(url, function (status) {
    var asksForApp;
    if (status === 'success')
      asksForApp = APP_SIGNATURE.test(page.content);
    console.log(url + '\t' + asksForApp);
    page.close();
    done();
  });
}

// Gets the headers for the given URL
function getHeaders(url) {
  return {
    'Host': url.match(/[^\/.]+\.[^\/]+/)[0],
    'Accept-Language': ACCEPT_LANGUAGE,
    'User-Agent': USER_AGENT,
  };
}
