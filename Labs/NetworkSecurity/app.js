var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var bcrypt = require('bcryptjs');
var path = require('path');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var session = require('express-session')
var port = process.env.PORT || 3000;

var db = new sqlite3.Database('db.sqlite');
db.serialize();

/**
 * Helper function for interacting with database.
 */
function create_user(username, password, password_confirmation, callback) {
  if(password !== password_confirmation) {
    callback('Password does not match confirmation');
  } else {
    db.all('SELECT username FROM users WHERE username = ?', [username], function(err, rows) {
      if(rows.length > 0) {
        callback('User already exists');
        return;
      }

      // Hash the password using a salt, hashSync(data, salt).
      // More info: https://www.npmjs.com/package/bcrypt-nodejs
      var pw_hash = bcrypt.hashSync(password, 10);

      // Notice the database stores all passwords hashed.
      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, pw_hash], function(err) {
        callback(err, username);
      });
    });
  }
}

var app = express();
nunjucks.configure('views', { autoescape: true, express: app });

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(session({ secret: 'I am actually a potato', resave: false, saveUninitialized: false }));

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});

// Expose session variables to views
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

app.get('/', function (req, res) {
  res.render('index.html');
});

app.get('/comments', function (req, res) {
  db.all("SELECT comment, username, CAST((julianday(datetime('now')) - julianday(timestamp))*24*60 AS integer) AS minutes_ago " +
  "FROM comments LEFT OUTER JOIN users " +
  "ON comments.user_id = users.id ORDER BY timestamp DESC LIMIT 10", function(err, rows) {
    if(err) {
      throw err;
    }

    comments = rows.map(function(row) {
      if(row.username === null)
        row.username = 'Anonymous';
      return row;
    });

    res.json(comments);
  });
});

app.post('/comments', function (req, res) {
  // Limit comment length
  var comment = req.body.comment.substring(0, 200);

  if(req.session.user_id !== undefined) {
    var query = 'INSERT INTO comments (user_id, comment) VALUES (?, ?)';
    var placeholders = [req.session.user_id, comment];
  } else {
    var query = 'INSERT INTO comments (comment) VALUES (?)';
    var placeholders = [comment];
  }

  db.run(query, placeholders, function(err) {
    if(err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

app.post('/signin', function(req, res) {
  var reqUsername = req.body.username;
  var reqPassword = req.body.password;

  db.all("SELECT id, username, password, is_admin FROM users WHERE username = '" + reqUsername + "'", function(err, rows) {
    if(err) {
      throw err;
    }
    if(!rows || rows.length > 1) {
      throw "this shouldn't happen";
    }

    // Compare hashed data with, compareSync(data, encrypted).
    // More info: https://www.npmjs.com/package/bcrypt-nodejs
    if(rows.length === 1 && bcrypt.compareSync(reqPassword, rows[0].password)) {
      req.session.user_id = rows[0].id;
      req.session.username = rows[0].username;
      req.session.is_admin = rows[0].is_admin === 1;
      res.redirect('/');
    } else {
      res.render('index.html', { error: 'Invalid username or password' });
    }
  });
});

app.get('/signout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  // Don't permit already-logged-in users to signup again.
  if(req.session.username !== undefined) {
    res.redirect('/');
    return;
  }

  res.render('signup.html');
});

app.post('/signup', function(req, res) {
  // Don't permit already-logged-in users to signup again.
  if(req.session.username !== undefined) {
    res.redirect('/');
    return;
  }

  var username = req.body.username;
  var password = req.body.password;
  var password_confirmation = req.body.password_confirmation;

  create_user(username, password, password_confirmation, function(err, username) {
    if (err) {
      res.render('signup.html', {error: err});
    } else {
      // This way subsequent requests will know the user is logged in.
      req.session.username = username;
      res.redirect('/');  
    }
  });
});

//db.close();
