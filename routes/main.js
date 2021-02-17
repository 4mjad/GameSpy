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
   
   // MongoClient.connect(url, function(err, client) {
   //    var db = client.db("GameSpy");
   //    db.collection('Steam').aggregate([
   //       { $lookup:
   //          {
   //             from: 'GOG',
   //             localField: '_id',
   //             foreignField: '_id',
   //             as: 'name'
   //          }
   //       }
   //    ]).toArray(function(findErr, results) {
   //       if(findErr) throw findErr // outputs error
   //       else
   //   //res.render('list.ejs', {availablebooks:results}); // otherwise produce output
   //   console.log(JSON.stringify(res));
   //       client.close(); // closes all open connections
   //    });
   // });
   MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("GameSpy");
      dbo.collection('Steam').aggregate([
        { $lookup:
           {
             from: 'GOG',
             localField: '_id',
             foreignField: '_id',
             as: 'name'
           }
         }
        ]).toArray(function(err, result) {
        if (err) throw err;
        //ERROR WITH THE DISPLAY OF 2 COLLECTIONS CANNOT PRINT NAME BUT PRINTS PRICES FOR STEAM
        //console.log(JSON.stringify(res));
        res.render('Game.ejs', {pagetitle:"Game",availablegame:result}); //diplays all books in the books collection of the database to the user
        db.close();
      });
    });
});






app.get('/Game', function(req, res) { // get request to list page
      var MongoClient = require('mongodb').MongoClient;
      const url = "mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test";
      MongoClient.connect(url, function (err, client) {
      var db = client.db('GameSpy');
      db.collection('GOG').find().toArray((findErr, results) => { // produces all available books
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


}