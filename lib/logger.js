var charm = require('charm')();

module.exports = {
  
  error: function(options, err, data) {
    if (options.quiet) return false;
    var pipe = (typeof options.pipe != 'undefined') ? options.pipe : process.stdout
    if (options.color) {
      charm.pipe(pipe);
      charm
        .foreground('red')
        .write(err.name + ': ')
        .foreground('magenta')
        .write(err.message)
        .write("\n")
      if (data) {
        charm
          .foreground('red')
          .right(2)
          .write('Data: ')
          .foreground('yellow')
          .write(data)
          .write("\n\n")
      }
      charm.end()
    } else {
      console.log(err.name + ': ' + err.message);
      if (options.data) console.log(options.data);
    }
  },

  notice: function(message) {
    console.log(message);
  }

};
