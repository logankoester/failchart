var requireOptions = function(expects, actual) {
  expects.forEach(function(option){
    if (typeof actual[option] == 'undefined')
      throw new Error('Required option ' + option + ' is missing');
  });
}

/*
Listen on stdin for streaming JSON data from systemd's journalctl
eg "journalctl _SYSTEMD_UNIT=sshd.service -o json"

  @params options Object

  onEntry: function(entry)
    @params entry Object

  onEnd: function

  onError: function(err, entry)
    @params err Error
    @params entry The entry on which the error occurred

    If onError returns false, execution will
    continue from the next entry (nonfatal).
*/
var read = function (options) {
  requireOptions(['onEntry', 'onError', 'onEnd'], options);

  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', function (chunk) {
    var lines = chunk.split("\n");
    lines.forEach( function(element) {
      try {
        var entry = JSON.parse(element);
      } catch(err) {
        if ( !options.onError(err, element) ) return false;
      }
      options.onEntry(entry);
    });
  });

  process.stdin.on('end', options.onEnd);
};

module.exports = {
  read: read
}
