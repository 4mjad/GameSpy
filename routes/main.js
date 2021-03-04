module.exports = function(app) // this file has been exported as a function
{
app.get('/list', function(req, res) { // get request to list page
      var MongoClient = require('mongodb').MongoClient;
      const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
      MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var db = client.db('GameSpy');
      db.collection('Steam').find().toArray((findErr, results) => { // produces all available books
      if (findErr) throw findErr;
      else
         res.render('list.ejs', {availablebooks:results});
      client.close();
  });
});
});

app.get('/listGOG', function(req, res) { // get request to list page
      var MongoClient = require('mongodb').MongoClient;
      const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
      MongoClient.connect(url, function (err, client) {
      var db = client.db('GameSpy');
      db.collection('GOG').find().toArray((findErr, results) => { // produces all available books
      if (findErr) throw findErr;
      else
         res.render('list.ejs', {availablebooks:results});
      client.close();                                                                                                                                                                                       
  });
});
});

app.get('/search',function(req,res){
        res.render("search.html");
     });

app.get('/search-result', function (req, res) {
      var MongoClient = require('mongodb').MongoClient; //retrieve
       var url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test"; // set url
      MongoClient.connect(url, function (err, client) { //connect to the db
      if(err) throw err;
       var db = client.db('GameSpy'); // name of db
       db.collection('ALL').find({name:{$regex:new RegExp(req.query.keyword,"i")}}).toArray((findErr, results) => { // finds name of books with specific key words
      if(findErr) throw findErr // outputs error
      else
        res.render('list.ejs', {availablebooks:results}); // otherwise produce output
          client.close(); // closes all open connections
     });
    });
});


app.get('/Game', function(req, res) { // get request to list page
      var MongoClient = require('mongodb').MongoClient;
      const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
      MongoClient.connect(url, function (err, client) {
      var db = client.db('GameSpy');
      db.collection('ALL').find().toArray((findErr, results) => { // produces all available books
      if (findErr) throw findErr;
      else
         res.render('Game.ejs', {pagetitle:"Game",availablegame:results}); //diplays all books in the books collection of the database to the user
      client.close();                                                                                                                                                                                      
  });
});
})

app.get('/populargames',function(req,res){
  res.render("populargames.html");
});

app.get('/register',function(req,res){
  res.render("register.html");
})

app.post('/registered', function (req,res) { // POST method route
  // saving data in database
  var MongoClient = require('mongodb').MongoClient;      
  const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
  const bcrypt = require('bcrypt'); //hashing password
  const saltRounds = 10; //random values
  const plainPassword = req.body.password; //plain password set to password
  bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) { //method for all const
  //Store hashed password in your database.
    MongoClient.connect(url, function(err, client) {
    if(err) throw err;
    var db = client.db ('GameSpy');
      db.collection('users').insertOne({ // collection and documents
        first: req.body.firstname,
        last: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
      });
      res.send('You are now registered, Your user name is: '+ req.body.username + ' your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword);  //sends response to user
      client.close();
    })
  })
});

//login route allows you to login
app.get('/login',function(req,res){
  res.render('login.html')
});

     //handles the post request submitted by user that wants to login to their account on the page. It would ask for a username and password and check if the given information is in the database for that user and if it is correct if so it would allow user to login, if not it would tell user which information given is incorrect which maybe username or password.
    app.post('/loggedin', function (req,res) {
      var MongoClient = require('mongodb').MongoClient;      
      const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";

        MongoClient.connect(url, function(err, client) {
          if (err) throw err;
          var db = client.db ('GameSpy'); //access to db
          const bcrypt = require('bcrypt');   //access to the bcrypt functions
          const saltRounds = 10;              //declares the length of the saltRounds it is going to use
          const plainPassword = req.body.password; //sets plainPassword to equal to inputted password
          var word1 = req.body.username;

          db.collection('users').findOne({username:word1},function(err,results){ //checks for the username in the users collection if username is found it would get all of that users information and store it in results
            if(err) throw err;
            if(results != null){ //if username is incorrect it would execute the outer else if not it would carry on executing the outer if statement
              bcrypt.compare(plainPassword, results.password, function(err, result){ // this would compare the plainPassword with the hashedPassword stored in the users collection
                if(err) throw err;
                if(result == true){ //if the plainPassword matches with the hashedPassword it would tell the user they have logged in and give them the option to go to the homepage
                res.send(('Logged In, All information provided is correct')+ '<br />'+'<a href='+'./'+'>Home</a>') 
                }
                else{ //if the plainPassword does not match with the hashedPassword then it would tell the user that the password entered is incorrect and give them the option to go to the homepage
                  res.send(('Invalid Password Entered') + '<br />'+'<a href='+'./'+'>Home</a>') 
                } 
              })
            }
            else{ //if username entered is incorrect it would tell user the username is incorrect and give them option to go to the homepage
              res.send(('Invalid Username Entered')  + '<br />'+'<a href='+'./'+'>Home</a>')
            }
          })
        })
     });


app.get('/Forum',function(req,res){
  res.render('Forum.html')
});

//get method route
app.get('/gamepage', function(req, res) {
  //use mongo
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
  MongoClient.connect(url, function (err, client) {
          if (err) throw err;
          var db = client.db('GameSpy');
          db.collection('ALL').find().toArray((findErr, results) => {
          if (findErr) throw findErr;
          else
          res.render('gamepage.ejs', {gametitle: " Appid ", pageText: " description: This is the Counter Stirke Global Offense Number Of people playing it concurrently", appid: "780"});
          client.close();                                                                                                                                                                                   
          });
 });
});

}