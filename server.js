const express = require('express');
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
// const config = require('./config');
const dotenv = require('dotenv');

dotenv.config();

//init app
var app = express();

//set middleware libraries
//RENDER
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
//POST
app.use(express.json()); //avoid url encoded//for post and put req
app.use(express.urlencoded({ extended: false })); //true will allow nesting, might be less secure

//connect db
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.dburl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(console.log('mongodb connected'))
  .catch((err) => console.log(err));

//load model
require('./models/Ideas');
const Ideas = mongoose.model('Ideas');

//routes
//main
app.get('/', (req, res) => {
  res.render('index');
});

//ALL

app.get('/ideas', (req, res) => {
  Ideas.find({})
    // .lean()
    .lean()
    .sort({ date: 'desc' })

    .then((ideas) => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

//CREATE
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});
app.post('/ideas/add', (req, res) => {
  const newIdea = {
    title: req.body.title,
    details: req.body.details
  };
  // console.log(req.body);
  new Ideas(newIdea).save().then((idea) => res.redirect('/ideas'));
});

//EDIT
app.get('/ideas/edit/:id', (req, res) => {
  // res.send(req.params.id);
  Ideas.findOne({ _id: req.params.id })
    .lean()
    .then((idea) => {
      res.render('ideas/edit', { idea: idea });
    });
});

app.post('/ideas/edit/:id', (req, res) => {
  // console.log(req.body.title);
  // res.send('sucess');
  Ideas.findOne({ _id: req.params.id }).then((idea) => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save();
    res.redirect('/ideas');
  });
});

//listen to port
const port = 8080;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
console.log('server started');

//app listen need to pass in callback

//nodemon need to run on package json script, system permission cannot run "nodemon app"
//can have more terminals so dont need to stop the server (server runs on auto)//doesnt work

//

//express-handlebars
//use render( ) for view enginer
//view engine needs views folder
//view needs a main or default layout
//{{{body}}} in main
//{{var}} in other view files
//variables have to be passed in on the route end
//pass your res data in a secure format like JSON but not the top level [{},{}]

//    useMongoClient: true, not required in mongo 5
//mongoose already comes with mongo
//just use the cloud version called mongo atlas to a avoid pain
//always use then-ables
//pass your res data in a secure format like JSON but not the top level [{},{}]
//use .lean()
