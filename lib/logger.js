var charm = require('charm')();
var Table = require('cli-table');

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
  },

  summarize: function(rows) {
    var table = new Table({
      head: ['source', 'attempts', 'user', 'start', 'end'],
      colwidths: [100, 6, 12, 80, 80],
      chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
         , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
         , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
         , 'right': '' , 'right-mid': '' , 'middle': ' ' },
      style: { 'padding-left': 0, 'padding-right': 0 }
    });
    rows.forEach(function(row){ table.push(row) });
    console.log(table.toString());
  }

};
