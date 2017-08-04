var path = require('path');
var fs = require('fs');
var httpHelpers = require('./http-helpers.js');
var archive = require('../helpers/archive-helpers');
var querystring = require('querystring');

// require more modules/folders here!
var readFile = function(path, callback) {
  if (path === '/') {
    wholePath = archive.paths.siteAssets + '/index.html';
  } else if (path === '/loading.html') {
    wholePath = archive.paths.siteAssets + '/loading.html';
  } else {
    wholePath = archive.paths.archivedSites + '/' + path;
  }
  fs.readFile(wholePath, function(err, data) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

var respond = function (res, statusCode, data) {
  res.writeHead(statusCode, httpHelpers.headers);
  res.end(data);
};

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    readFile(req.url, function(err, data) {
      if (err) {
        respond(res, 404, err.message);
      } else {
        respond(res, 200, data);
      }
    });
  } else if (req.method === 'POST') {
    var receivingData = '';
    req.on('data', function(chunk) {
      receivingData += chunk;
    });
    req.on('end', function() {
      var receivedUrl = querystring.parse(receivingData).url;
      archive.addUrlToList(receivedUrl, function() {
        archive.isUrlArchived(receivedUrl, function(archived) {
          var readUrl = '/loading.html';
          if (archived) {
            readUrl = receivedUrl;
          }
          readFile(readUrl, function(err, data) {
            if (err) {
              respond(res, 404, err.message);
            } else {
              respond(res, 302, data);
            }
          });
        });
      });
    });
  }

};
