var parsedEntries = {}
var moment = require('moment');

function formatTime(time) {
  return moment.unix(time).local().format('h:mm a');
}

var summarize = function(data) {
  var messages = [];
  Object.keys(data).forEach( function(remoteAddress) {
    Object.keys(data[remoteAddress]).forEach( function(user) {
      var count, firstTime, lastTime;
      count = data[remoteAddress][user].length;
      firstTime = data[remoteAddress][user][0];
      lastTime = data[remoteAddress][user][ data[remoteAddress][user].length - 1 ];
      messages.push(remoteAddress +
        ' failed to login as ' + user + ' ' + count + ' times between ' +
        formatTime(firstTime) + ' and ' + formatTime(lastTime) + '.'
      );
    });
  });
  return messages;
}

var reportFail = function(report, fail) {
  report[fail.remoteAddress] = typeof report[fail.remoteAddress] !== 'undefined' ? report[fail.remoteAddress] : {};
  report[fail.remoteAddress][fail.user] = typeof report[fail.remoteAddress][fail.user] !== 'undefined' ? report[fail.remoteAddress][fail.user] : [];
  report[fail.remoteAddress][fail.user].push(fail.timestamp);
  return report;
}

module.exports = function(options, callback) {
  options.source.read({

    onEntry: function(entry){
      var parsedEntry = options.source.parseEntry(entry)
      parsedEntries = parsedEntry ? reportFail(parsedEntries, parsedEntry) : parsedEntries;
    },

    onEnd: function(){
      var summary = summarize(parsedEntries);
      if (options.logger) {
        summary.forEach( function(message) {
          options.logger.notice(message);
        });
      }
      if (callback) callback(summary);
    },

    onError: function(err, element){
      if (options.logger)
        options.logger.error(options, err, element);
      return false;
    }

  });
}
