var fs = require('fs');
var path = require('path');
var http = require('http');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf-8', function(err, data) {
    if (err) {
      callback(null, err);
    } else {
      callback(data.split('\n'), null);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function (listOfUrls, err) {
    if (err) {
      callback(err);
    } else {
      if (listOfUrls.indexOf(url) > -1) {
        callback(true);
      } else {
        callback(false);
      }
    }
  });
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, function(inList) {
    if (!inList) {
      fs.appendFile(exports.paths.list, url + '\n', function(err) {
        if (err) {
          callback(false);
        } else {
          callback(true);
        }
      });
    } else {
      callback(false);
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.open(exports.paths.archivedSites + '/' + url, 'r', function(err, data){
    if (err) {
      callback(false, url);
    } else {
      callback(true, url);
    }
  });
};

exports.downloadUrls = function(urls) {
  console.log('listofURLs:', urls);
  for ( var i = 0; i < urls.length; i++ ) {
    var currentUrl = urls[i];
    exports.isUrlArchived(currentUrl, function(isArchived, currentUrl) {
      if (!isArchived) {
        http.get('http://' + currentUrl, function(response) {
          var dataStr = '';
          response.on('data', function(chunk) {
            dataStr += chunk;
          });
          response.on('end', function() {
            fs.writeFile(exports.paths.archivedSites + '/' + currentUrl, dataStr, function(err, data) {
              if (err) {
                console.log('not written');
              } else {
                console.log('wrote site:', currentUrl);
              }
            });
          });
        });
      }
    });
  }
};

