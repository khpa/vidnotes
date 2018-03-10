const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); //db
const methodOverride = require('method-override');  //put request
const session = require('express-session'); //for flash messaging (required for connect-flash and later for auth)
const flash = require('connect-flash'); //Flash message middleware for Connect and Express

const app = express();

//load routes
const ideas = require ('./routes/ideas');
const users = require ('./routes/users');

//map global promise

mongoose.Promise = global.Promise;

//connect to mongoose

mongoose.connect('mongodb://localhost/videonotes-dev')
    .then((response) => {
        console.log('MongoDB Connected')
    })
    .catch((error) => {
        console.log('error')
    })


//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

//method-override middleware
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//connect-session middleware
app.use(session({
    secret: 'secret', //can be anything, 'secret' is just fine
    resave: true, //set to true
    saveUninitialized: true
    //cookie removed from here
  }));

//connect-flash middleware  
app.use(flash());  

//global variables for flash messages - middlewares

app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg'); //success_msg can be anything
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// parse application/json
app.use(bodyParser.json());

//Index Route

app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//About Route

app.get('/about', (req, res) => {
    res.render('about')
});



 
 //use routes
 app.use('/ideas', ideas);
 app.use('/users', users);

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});