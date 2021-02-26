//9th Commit
var express = require ('express')
var bodyParser = require ('body-parser') // extract the body of an incoming request stream and exposes it
const port = 8000 // access url port number
const app = express() // module with functions or objects or variables assigned to it
                                                                                                                                                                                                                                                                                                                                                                   
app.use(bodyParser.urlencoded({ extended: true })) // middleware for parsing bodies from url 


const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://GameSpy:gamespy123@gamespy.inxg2.mongodb.net/test");//?

mongoose.connection

 .once('open', () => console.log('Good to go!'))

 .on('error', (error) => {

 console.warn('Warning', error);

 });

// Express web server                                                                                                                                                                                                            

require('./routes/main')(app);

app.set('design',__dirname + '/design');

app.use(express.static('design'));                                                                                                                                                                                                           

app.set('views',__dirname + '/views');

                                                                                                                                                                                                            

app.set('view engine', 'ejs');

                                                                                                                                                                                                            

app.engine('html', require('ejs').renderFile);

app.listen(port, () => console.log(`Example app listening on port ${port}`)) // returns http server instance

