var path = require('path');
var _ = require('lodash');
var QueryEngine = require('query-engine');

var JournalEntry = require(path.join(__dirname, 'entry'));
var JournalEntries = require(path.join(__dirname, 'entries'));

var entries = new JournalEntries();

var moment = require('moment');
function formatTime(time) {
  return moment.unix(time).local().format('h:mm a');
}

var summarize = function(entries) {
  var fields = [];
  var remoteAddresses = _.uniq(entries.pluck('remoteAddress'));
  _.each(remoteAddresses, function(attacker){

    var results = QueryEngine.createCollection()
      .findAll({ remoteAddress: attacker })
      .add(entries.models);

    var users = _.uniq(results.pluck('user'));
    _.each(users, function(user){

      var attacks = results.findAll({
        remoteAddress: attacker,
        user: user
      }, function(model){ return model.getRealtimeTimestamp() });

      var firstTime = attacks.first().getRealtimeTimestamp().format('YYYY-MM-DD hh:mm');
      var lastTime = attacks.last().getRealtimeTimestamp().format('YYYY-MM-DD hh:mm');
      fields.push([attacker, attacks.length, user, firstTime, lastTime]);
    });
  });
  return fields;
}

module.exports = function(options, callback) {
  options.source.read({

    onEntry: function(data){
      if (data.MESSAGE.match(new RegExp(/^Failed password.*/))) {
        var model = new JournalEntry(data, { parse: true });
        entries.add(model);
      }
    },

    onEnd: function(){
      var rows = summarize(entries);
      if (options.logger) {
        options.logger.summarize(rows);
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
