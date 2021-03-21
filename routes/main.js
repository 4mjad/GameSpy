module.exports = function (app) // this file has been exported as a function
{
  const { check, validationResult } = require('express-validator');

  const redirectLogin = (req, res, next) => {

    if (!req.session.userId) {
      res.redirect('./login')
    }
    else {
      next();
    }
  }


  //   app.get('/list', function(req, res) { // get request to list page
  //       var MongoClient = require('mongodb').MongoClient;
  //       const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
  //       MongoClient.connect(url, function (err, client) {
  //       if (err) throw err;
  //       var db = client.db('GameSpy');
  //       db.collection('ALL').find().toArray((findErr, results) => { // produces all available books
  //       if (findErr) throw findErr;
  //       else
  //          res.render('list.ejs', {availablegame:results});
  //       client.close();
  //   });
  // });
  // });

  // app.get('/listGOG', function(req, res) { // get request to list page
  //       var MongoClient = require('mongodb').MongoClient;
  //       const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
  //       MongoClient.connect(url, function (err, client) {
  //       var db = client.db('GameSpy');
  //       db.collection('GOG').find().toArray((findErr, results) => { // produces all available books
  //       if (findErr) throw findErr;
  //       else
  //          res.render('list.ejs', {availablegame:results});
  //       client.close();                                                                                                                                                                                       
  //   });
  // });
  // });

  app.get('/search', function (req, res) {

    res.render("search.html");
  });

  app.get('/search-result', function (req, res) {
    var MongoClient = require('mongodb').MongoClient; //retrieve
    var url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test"; // set url
    MongoClient.connect(url, function (err, client) { //connect to the db
      if (err) throw err;
      var db = client.db('GameSpy'); // name of db
      db.collection('ALL').find({ name: { $regex: new RegExp(req.query.keyword, "i") } }).toArray((findErr, results) => { // finds name of books with specific key words
        if (findErr) throw findErr // outputs error
        else
          res.render('list.ejs', { availablegame: results }); // otherwise produce output
        client.close(); // closes all open connections
      });
    });
  });


  app.get('/Game', function (req, res) { // get request to list page
    var MongoClient = require('mongodb').MongoClient;
    const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
    MongoClient.connect(url, function (err, client) {
      var db = client.db('GameSpy');
      db.collection('ALL').find().toArray((findErr, results) => { // produces all available books
        if (findErr) throw findErr;
        else
          res.render('Game.ejs', { pagetitle: "Game", availablegame: results }); //diplays all books in the books collection of the database to the user
        client.close();
      });
    });
  })

  app.get('/populargames', function (req, res) {
    res.render("populargames.html");
  });

  app.get('/register', function (req, res) {
    res.render("register.html");
  })

  // app.post('/registered',[check('username').notEmpty(), check('firstname').notEmpty(),check('lastname').notEmpty(), check('email').isEmail(),check('password').isLength({min:8})], function (req,res) { // POST method route
  //   var MongoClient = require('mongodb').MongoClient;      
  //   const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";

  //   bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) { 
  //     MongoClient.connect(url, function(err, client) {
  //       if(err) throw err;
  //       var db = client.db ('GameSpy');
  //       const bcrypt = require('bcrypt');
  //       const saltRounds = 10; 
  //       const plainPassword = req.body.password;
  //       const errors = validationResult(req);
  //       if(!errors.isEmpty()){
  //          res.redirect('./register');
  //       }
  //       else{



  //       db.collection('users').insertOne({ 
  //         first: req.body.firstname,
  //         last: req.body.lastname,
  //         email: req.body.email,
  //         username: req.body.username,
  //         password: hashedPassword
  //       });
  //       res.send('You are now registered, Your user name is: '+ req.body.username + ' your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword);  //sends response to user
  //       client.close();
  //     })
  //   })
  // });

  app.post('/registered', [check('username').notEmpty(), check('firstname').notEmpty(), check('lastname').notEmpty(), check('email').isEmail(), check('password').isLength({ min: 8 })], function (req, res) {
    var MongoClient = require('mongodb').MongoClient;
    const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";

    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('GameSpy'); //access to the mybookshopdb database
      const bcrypt = require('bcrypt'); //access to bcrypt functions
      const saltRounds = 10;  //declars the length of the saltRounds it is going to use
      const plainPassword = req.sanitize(req.body.password); //saves inputted password as plainPassword
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.redirect('./register');
      }
      else {
        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) { //hashes plainPassword using saltRounds and calls it hashedPassword
          db.collection('users').insertOne({
            firstname: req.sanitize(req.body.firstname),
            lastname: req.sanitize(req.body.lastname),
            email: req.sanitize(req.body.email),
            username: req.sanitize(req.body.username),
            password: hashedPassword
          });
          res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + '<h1>' +  'You are now registered, Your user name is: ' + req.body.username + ' your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword + '</h1>');
          client.close();
        })
      }
    });
  });



  app.get('/login', function (req, res) {
    res.render('login.html')
  });


  app.post('/loggedin', [check('username').notEmpty(), check('password').notEmpty()], function (req, res) {
    var MongoClient = require('mongodb').MongoClient;
    const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";

    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('GameSpy');
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      const plainPassword = req.body.password;
      var word1 = req.body.username;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.redirect('./login');
      }
      else {
        db.collection('users').findOne({ username: word1 }, function (err, results) {
          if (err) throw err;
          if (results != null) {
            bcrypt.compare(plainPassword, results.password, function (err, result) {
              if (err) throw err;
              if (result == true) {
                req.session.userId = req.sanitize(req.body.username);
                res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + ('Logged In, All information provided is correct') + '<br />' + '<a href=' + './' + '>Home</a>')
              }
              else {
                res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + ('Invalid Password Entered') + '<br />' + '<a href=' + './' + '>Home</a>')
              }
            })
          }
          else {
            res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + ('Invalid Username Entered') + '<br />' + '<a href=' + './' + '>Home</a>')
          }
        })
      }
    })
  });


  app.get('/Forum', redirectLogin, function (req, res) {
    res.render('Forum.html')
  });

  app.post('/Complained', [check('email').isEmail(), check('message').notEmpty(), check('subject').notEmpty()], function (req, res) {
    // saving data in database
    var MongoClient = require('mongodb').MongoClient;
    const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
    //Store hashed password in your database.
    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('GameSpy');

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.redirect('./Forum');
      }
      else {
        db.collection('Complaints').insertOne({ // collection and documents
          Email: req.body.email,
          Subject: req.body.subject,
          Message: req.body.message,
        });
        res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + "Your Email is: " + req.body.email + "The subject of the issue is: " + req.body.subject + "The message you are sending is: " + req.body.message);  //sends response to user
        client.close();
      }
    })
  })

  //get method route
  app.get('/Counter-Strike', function (req, res) {
    //use mongo
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('GameSpy');
      db.collection('ALL').find().toArray((findErr, results) => {
        if (findErr) throw findErr;
        else
          res.render('gamepage.ejs', { gametitle: req.query.name + req.query.price, pageText: " description: This is the Counter Stirke Global Offense Number Of people playing it concurrently", appid: "780", availablegame: results });
        client.close();
      });
    });
  });


  //get method route
  app.get('/Counter-Strike%20Nexon:%20Zombies', function (req, res) {
    //use mongo
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('GameSpy');
      db.collection('ALL').find().toArray((findErr, results) => {
        if (findErr) throw findErr;
        else
          res.render('gamepage.ejs', { gametitle: " Appid ", pageText: " description: This is the Counter Stirke Global Offense Number Of people playing it concurrently", appid: "780", availablegame: results });
        client.close();
      });
    });
  });


  app.get('/complaints', redirectLogin, function (req, res) {
    var MongoClient = require('mongodb').MongoClient;
    const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('GameSpy');
      db.collection('Complaints').find().toArray((findErr, results) => { // produces all available books
        if (findErr) throw findErr;
        else
          res.render('complaints.ejs', { availableuser: results });
        client.close();
      });
    });
  })


  app.post('/deleted', [check('id').notEmpty()], function (req, res) {
    var MongoClient = require('mongodb').MongoClient;
    const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('GameSpy');
      db.collection('Complaints').findOne({ name: req.body._id }, function (findErr, result) {
        if (findErr) throw findErr;
        if (!errors.isEmpty()) {
          res.redirect('./complaints');
        }
        else {
          if (result != null) {
            db.collection('Complaints').deleteOne({ name: req.body._id }, function (err, results) {
              res.send('User deleted' + '<br />' + '<a href=' + './' + '>Home</a>');
            })
          }
          else {
            res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + 'Invalid User name' + '<br />' + '<a href=' + './' + '>Home</a>');
          }
        }
      });
    });
  });


  app.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.redirect('./')
      }
      res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + '<h1>' + ('you are now logged out.') + '</h1>' + '<br />' + '<a href=' + './' + '>Home</a>');
    })
  })



  app.get('/api', function (req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
    MongoClient.connect(url, function (err, client) {
      if (err) throw err
      var db = client.db('GameSpy');
      db.collection('ALL').find().toArray((findErr, results) => {
        if (findErr) throw findErr;
        else
          res.json(results);
      });
    });
  });


}

