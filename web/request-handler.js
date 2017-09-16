var path = require('path');
var fs = require('fs');
var httpHelpers = require('./http-helpers.js');
var archive = require('../helpers/archive-helpers');
var querystring = require('querystring');


var respond = function (res, statusCode, data) {
  res.writeHead(statusCode, httpHelpers.headers);
  res.end(data);
};

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    httpHelpers.serveAssets(res, req.url, function(err, data) {
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
          httpHelpers.serveAssets(res, readUrl, function(err, data) {
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
