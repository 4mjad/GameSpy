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

    //   if(err) throw err;

       var db = client.db('GameSpy'); // name of db

       db.collection('Steam').find({name:{$regex:new RegExp(req.query.keyword,"i")}}).toArray((findErr, results) => { // finds name of books with specific key words

       // db.collection('GOG').find({name:{$regex:new RegExp(req.query.keyword,"i")}}).toArray((findErr, results) => { // finds name of books with specific key words

      if(findErr) throw findErr // outputs error

       else

        res.render('list.ejs', {availablebooks:results}); // otherwise produce output

          client.close(); // closes all open connections

     });

    });
});
//});
}
