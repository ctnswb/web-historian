var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  if (asset === '/') {
    wholePath = archive.paths.siteAssets + '/index.html';
  } else if (asset === '/loading.html') {
    wholePath = archive.paths.siteAssets + '/loading.html';
  } else {
    wholePath = archive.paths.archivedSites + '/' + asset;
  }
  fs.readFile(wholePath, function(err, data) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

