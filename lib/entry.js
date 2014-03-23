var Backbone = require('backbone');
var moment = require('moment');

var JournalEntry = Backbone.Model.extend({

  parse: function(response, options) {
    response = this._parseAttack(response, options);
    return response;
  },

  getRealtimeTimestamp: function() {
    var unix = parseInt(
      parseFloat(this.get('__REALTIME_TIMESTAMP')) / (1000 * 1000))
    return moment.unix(unix);
  },
  
  _parseAttack: function(response, options) {
    pattern = new RegExp(/^Failed password for (.*) from (.*) port (.*) ssh2$/);
    match = response.MESSAGE.match(pattern);
    if (match) {
      response.user = match[1];
      response.remoteAddress = match[2];
      response.port = match[3];

      var invalid = response.user.match(new RegExp(/invalid user (.*)/));
      if (invalid) {
        response.user = invalid[1];
        response.invalidUser = true;
      }
    }
    return response;
  }

});

module.exports = JournalEntry;
