const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); //db
const methodOverride = require('method-override');  //put request
const session = require('express-session'); //for flash messaging (required for connect-flash and later for auth)
const flash = require('connect-flash'); //Flash message middleware for Connect and Express

const app = express();

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
//Load idea Model

require('./models/Idea');

const Idea = mongoose.model('ideas');

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

//Idea (notes) list page

app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({
            date: 'desc'
        })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas,
            });
        });
});


//Add idea form

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add')
});

//edit idea form
// /:id is the parameter passed to the page (which idea/note we edit)
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then (idea=>{
        res.render('ideas/edit',{
            idea:idea
        })
    })
});

//process form

app.post('/ideas', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: 'Please add a title!'
        });
    }
    if (!req.body.details) {
        errors.push({
            text: 'Please add some details!'
        });
    }

    if (errors.length > 0) {
        //re-render and pass back {errors & what the user has already entered}
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        //res.send('passed')
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video Note Added')

                res.redirect('/ideas');
            })
            .catch(err => {
                console.log('db error!')
            })
    }

});

//edit form process (put request with express/method-override)

app.put('/ideas/:id',(req, res)=>{
   Idea.findOne({
       _id: req.params.id
   })
   .then(idea=>{
       //new values
       idea.title = req.body.title;
       idea.details = req.body.details;
       idea.save()
       .then(idea => {
        req.flash('success_msg', 'Video Note Updated!')
           res.redirect('/ideas');
       });
   });
});

//delete form process (delete request with express/method-override)

app.delete('/ideas/:id',(req, res)=>{

    Idea.remove({_id:req.params.id})
    .then(()=>{
        req.flash('success_msg', 'Video Note Removed')
        res.redirect('/ideas');
    });

 });

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});