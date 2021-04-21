module.exports = function (app) // this file has been exported as a function
{
  //to validate user inputs
  const { check, validationResult } = require('express-validator');
  //redirect to login pages if the user have not logged in
  const redirectLogin = (req, res, next) => {

    if (!req.session.userId) {
      res.redirect('./login')
    }
    else {
      next();
    }
  }

  //////////////////////------------------------------- SEARCH PAGE -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
  //home Page 
  app.get('/', function (req, res) {

    res.render("home.html");
  });
  // search result for games
  app.get('/search-result', function (req, res) {
    //calls the database
    var MongoClient = require('mongodb').MongoClient; //retrieve
    var url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test"; // set url
    MongoClient.connect(url, function (err, client) { //connect to the db
      if (err) throw err;
      var db = client.db('GameSpy'); // name of db
      db.collection('ALL').find({ name: { $regex: new RegExp(req.query.keyword, "i") } }).toArray((findErr, results) => { // finds name of books with specific key words
        if (findErr) throw findErr // outputs error
        else {
          res.render('gamepage.ejs', { gametitle: req.query.keyword, availablegame: results }); // otherwise produce output
          client.close(); // closes all open connections
        }
      });
    });
  });

  //////////////////////------------------------------- POPULAR GAMES PAGE -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\

  app.get('/populargames', function (req, res) {
    res.render("populargames.html");
  });

  //////////////////////------------------------------- REGISTER PAGE -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\

  app.get('/register', function (req, res) {
    res.render("register.html");
  })
  //conditions that should be met when registering
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
      //if nothing is written then hte user is redirected to the register page 
      if (!errors.isEmpty()) {
        res.redirect('./register');
      }
      else {
        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) { //hashes plainPassword using saltRounds and calls it hashedPassword
          //sanitizing and registering the user to the database
          db.collection('users').insertOne({
            firstname: req.sanitize(req.body.firstname),
            lastname: req.sanitize(req.body.lastname),
            email: req.sanitize(req.body.email),
            username: req.sanitize(req.body.username),
            password: hashedPassword
          });
          res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + '<p style= "color:#FFFFFF;">' + 'You are now registered, Your user name is: ' + req.body.username + ' your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword + '</p>' + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './PopularGames' + '> PopularGames </a> ' + '<a href=' + './Complaints' + '> Complaints</a>' + '<a href=' + './Forum' + '> Forum </a>' + '<a href=' + './login' + '> login </a>' + '<a href=' + './logout' + '> Logout</a>');
          client.close();
        })
      }
    });
  });


  //////////////////////------------------------------- LOGIN PAGE -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\

  app.get('/login', function (req, res) {
    res.render('login.html')
  });

  // Login page - checks if all the conditions are met 
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
      //checks if the fields are left emoty
      if (!errors.isEmpty()) {
        res.redirect('./login');
      }
      else {
        //checks if the user name is in our system
        db.collection('users').findOne({ username: word1 }, function (err, results) {
          if (err) throw err;
          if (results != null) {
            //compares the password given and the stored password
            bcrypt.compare(plainPassword, results.password, function (err, result) {
              if (err) throw err;
              if (result == true) {
                req.session.userId = req.sanitize(req.body.username);
                //if the provided username and password are correct the user session starts 
                res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + '<p style= "color:#FFFFFF;">' + ('Logged In, All information provided is correct') + '</p>' + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './PopularGames' + '> PopularGames </a> ' + '<a href=' + './Complaints' + '> Complaints</a>' + '<a href=' + './Forum' + '> Forum </a>' + '<a href=' + './login' + '> login </a>' + '<a href=' + './logout' + '> Logout</a>')
              }
              else {
                //if username is correct and the password wrong, then the following line prints out
                res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + '<p style= "color:#FFFFFF;">' + ('Invalid Password Entered') + '</p>' + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './PopularGames' + '> PopularGames </a> ' + '<a href=' + './Complaints' + '> Complaints</a>' + '<a href=' + './Forum' + '> Forum </a>' + '<a href=' + './login' + '> login </a>' + '<a href=' + './logout' + '> Logout</a>')
              }
            })
          }
          else {
            //if provided user name is not in the database then the following line prints out
            res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + '<p style= "color:#FFFFFF;">' + ('Invalid Username Entered') + '</p>' + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './PopularGames' + '> PopularGames </a> ' + '<a href=' + './Complaints' + '> Complaints</a>' + '<a href=' + './Forum' + '> Forum </a>' + '<a href=' + './login' + '> login </a>' + '<a href=' + './logout' + '> Logout</a>')
          }
        })
      }
    })
  });

  //////////////////////------------------------------- LOGOUT -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\

  app.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.redirect('./')
      }
      res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + '<p style= "color:#FFFFFF;">' + ('you are now logged out.') + '</p>' + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './PopularGames' + '> PopularGames </a> ' + '<a href=' + './Complaints' + '> Complaints</a>' + '<a href=' + './Forum' + '> Forum </a>' + '<a href=' + './login' + '> login </a>' + '<a href=' + './logout' + '> Logout</a>');
    })
  })

  //////////////////////------------------------------- COMPLAINTS PAGE -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
  //Users can raise their concerns in the complaint page. (provided to only logged in users)
  app.get('/Complaints', redirectLogin, function (req, res) {
    res.render('complaints.html')
  });
  //checks if everything is filled 
  app.post('/Complained', [check('email').isEmail(), check('message').notEmpty(), check('subject').notEmpty()], function (req, res) {
    // saving data in database
    var MongoClient = require('mongodb').MongoClient;
    const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
    //Store hashed password in your database.
    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('GameSpy');

      const errors = validationResult(req);
      //if there is any errors then the user is redirected to the complaints page     
      if (!errors.isEmpty()) {
        res.redirect('./Forum');
      }
      //if everything is filled then the complaint is stored into the database called Complaints
      else {
        db.collection('Complaints').insertOne({ // collection and documents
          Email: req.body.email,
          Subject: req.body.subject,
          Message: req.body.message,
        });
        res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + '<p style= "color:#FFFFFF;">' + ("Your Email is: " + req.body.email + "The subject of the issue is: " + req.body.subject + "The message you are sending is: " + req.body.message) + '</p>' + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './PopularGames' + '> PopularGames </a> ' + '<a href=' + './Complaints' + '> Complaints</a>' + '<a href=' + './Forum' + '> Forum </a>' + '<a href=' + './login' + '> login </a>' + '<a href=' + './logout' + '> Logout</a>');  //sends response to user
        client.close();
      }
    })
  })



  //////////////////////------------------------------- COMPLAINTS PAGE FOR ADMIN -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\
  //only accessable by admins
  app.get('/complaintsadmin', redirectLogin, function (req, res) {
    var MongoClient = require('mongodb').MongoClient;
    const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('GameSpy');
      db.collection('Complaints').find().toArray((findErr, results) => { // produces all available books
        if (findErr) throw findErr;
        else
          //web page with all active complaints
          res.render('complaintsadmin.ejs', { availablegame: results });
        client.close();
      });
    });
  })

  app.post('/deleted', [check('email').isEmail()], function (req, res) {
    //saving data in database
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";

    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('GameSpy');  //access to the database
      //gets the email address of the user
      var word1 = req.body.email;
      console.log(word1);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.redirect('./complaints');
      }
      else {
        //if the user email is found, then the complaint is delete
        db.collection('Complaints').findOne({ Email: word1 }, function (err, result) { //find if the username entered is in the database if so it would get all the information for that user
          if (err) throw err;
          if (result != null) { //if result is not equal to null that means the username exists in the database so it would execute the code within the if statement

            db.collection('Complaints').deleteOne({ Email: word1 }, function (err, results) { //delete the user that has the username entered in the users collection by comparing username entered with the username in the collection and then delete all of that users information from the database and then tell the user the information is deleted
              res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + '<p style= "color:#FFFFFF;">' + ('Deleting User ' + word1 + ' from the database') + '</p>' + '<br />' + '<a href=' + './' + '>Home</a>')
            })
          }
          else { //if username is not found in the database that means results is equal to null then tell the user that the username entered does not exist in the database
            res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + '<p style = "color:#FFFFFF;">' + ("User with the username " + word1 + " does not exist in the database") + '</p>' + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './PopularGames' + '> PopularGames </a> ' + '<a href=' + './Complaints' + '> Complaints</a>' + '<a href=' + './Forum' + '> Forum </a>' + '<a href=' + './login' + '> login </a>' + '<a href=' + './logout' + '> Logout</a>')
          }
        })
      }
    })
  });


  //////////////////////------------------------------- API PAGE -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\

  app.get('/api', function (req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
    MongoClient.connect(url, function (err, client) {
      if (err) throw err
      var db = client.db('GameSpy');
      db.collection('ALL').find().toArray((findErr, results) => {
        if (findErr) throw findErr;
        else
          //shows the games as a json file
          res.json(results);
      });
    });
  });


  //////////////////////------------------------------- FORUM PAGE -----------------------------------\\\\\\\\\\\\\\\\\\\\\\\\

  app.get('/forum', redirectLogin, function (req, res) {
    var MongoClient = require('mongodb').MongoClient;
    const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('GameSpy');
      db.collection('Messages').find().sort({ TimeDate: -1 }).toArray((findErr, results) => {
        if (findErr) throw findErr;
        else
          //prints the messages into a webpage
          res.render('forum.ejs', { availablemessage: results });
        client.close();
      });
    });
  })

  app.post("/MessageAdded", (req, res) => {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
    var date = new Date();

    MongoClient.connect(url, (err, client) => {
      if (err) throw err;
      var db = client.db('GameSpy');
      //enters the message and all the datas into the database Messages
      db.collection("Messages").insertOne({
        username: req.session.userId,
        message: req.body.message,
        TimeDate: date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + ' (' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ') '
      }, function (err, result) {
        if (err) throw err;
        res.send('<link rel="stylesheet" type="text/css" href="css/custom.css">' + '<p style= "color:#FFFFFF;">' + ("Hello " + req.session.userId + " You have submitted the following message: " + req.body.message + '</p>') + '<br />' + '<a href=' + './' + '>Home </a>' + '<a href=' + './PopularGames' + '> PopularGames </a> ' + '<a href=' + './Complaints' + '> Complaints</a>' + '<a href=' + './Forum' + '> Forum </a>' + '<a href=' + './login' + '> login </a>' + '<a href=' + './logout' + '> Logout</a>')

      });
      client.close();
    });

  })

}

