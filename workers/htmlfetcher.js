// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var CronJob = require('cron').CronJob;


exports.fetcher = new CronJob('* * * * *', function() {
  console.log('fetching new HTML');
  archive.readListOfUrls()
    .then(function(listOfUrls) {
      archive.downloadUrls(listOfUrls);
    });
}, function () {
  console.log('done');
},
false, /* Start the job right now */
'America/Los_Angeles' /* Time zone of this job. */
);