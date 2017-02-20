// An example express server implementing a REST API

var express = require('express');
var bodyParser = require('body-parser');

var books = require('./routes/book-routes');
var app = express();  //app further in the code represents express..

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));

// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Get the index page:
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/books', books.findAll);
//here the 'get' , i.e. the verb of using is consistent with the client side..
//the client usually aims to get data from the server..

app.post('/addbook', books.addOne);
//here the 'post' , i.e. the verb of using is consistent with the client side, 
//usually means that the client want to upload data to the server.

app.put('/like/:isbn', books.like);
//update...


// Start the server
app.listen(3000);
console.log('Listening on port 3000');
