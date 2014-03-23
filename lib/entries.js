var path = require('path');
var Backbone = require('backbone');
var JournalEntry = require(path.join(__dirname, 'entry'));

var JournalEntries = Backbone.Collection.extend({
  model: JournalEntry,

  comparator: function(model) {
    return model.getRealtimeTimestamp();
  },

  groupByDate: function() {
    return this.groupBy(function(model){
      return model.getRealtimeTimestamp().format('YYYY MM DD');
    });
  },

  groupByRemoteAddress: function() {
    return this.groupBy(function(model) {
      return model.get('remoteAddress');
    });
  },

  groupByUser: function() {
    return this.groupBy(function(model) {
      return model.get('user');
    });
  }

});

module.exports = JournalEntries;
