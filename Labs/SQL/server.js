var http = require('http');
var fs = require('fs');

var Handlebars = require('handlebars');
var Sequelize = require('sequelize')

function run_server(db) {
  var hostname = '127.0.0.1';
  var port = 3000;

  var server = http.createServer(function(req, res) {
    if(req.url === '/' || req.url === '/index.html') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');

      // Your code goes here. You must call fetch_packages() to get `packages`.
      // Once you have `packages`, you can call `res.end(page_contents)` to
      // render the `page_contents` string as the page.
      //
      var packages;

      fetch_packages(db, function fetch(packages){
        var page_contents = render_page(packages);
        res.end(page_contents);
      });

    } else {
      res.statusCode = 404;
      res.end();
    }
  });

  server.listen(port, hostname, function() {
      console.log(`Server running at http://${hostname}:${port}/`);
  });
}

function init_db() {
  var db = new Sequelize('shipments', 'user', 'pass', {
    dialect: 'sqlite',
    storage: 'shipments.sqlite'
  });
  return db;
}

function render_page(packages) {
  var template_source = fs.readFileSync('index.html', 'utf8');
  var template = Handlebars.compile(template_source);
  return template({packages: packages});
}

function fetch_packages(db, on_done) {
  // Your code goes here. You must return an array of objects that looks like
  // this (which you can infer from looking at what fields we reference in
  // index.html):
  //
	// [ { sent_on: '2016-06-27 14:31:03',
	//     due_on: '2016-06-28 08:00:00',
	//     received_on: null,
	//     shipper_name: 'Nils Olav',
	//     receiver_name: 'William Windsor',
	//     destination_address: 'Whipsnade Zoo, Whipsnade, England, Earth' },
	//   { sent_on: '2016-06-27 14:31:03',
	//     due_on: '2016-06-28 08:00:00',
	//     received_on: null,
	//     shipper_name: 'Nils Olav',
	//     receiver_name: 'William Windsor',
	//     destination_address: 'Whipsnade Zoo, Whipsnade, England, Earth' } ]
  //
  // Hint: the easiest way to do this is with SQL joins. If you don't know how
  // to use joins, you will have to issue multiple queries.
  db.query(
    'SELECT p.sent_on, p.due_on, p.received_on, c1.name shipper_name, c2.name receiver_name, ' +
    '(a.street || ", " || a.city || ", " || a.country || ", " || a.planet) destination_address ' +
    'FROM packages p ' +
    'JOIN customers c1 ON c1.id = p.shipping_customer ' +
    'JOIN customers c2 ON c2.id = p.receiving_customer ' +
    'JOIN addresses a ON a.id = p.destination_address'
  ).spread(function(packages, metadata) {
    on_done(packages);
  });
}

function main() {
  var db = init_db();
  run_server(db);
}

main();
