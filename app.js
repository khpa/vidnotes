const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

//map global promise

mongoose.Promise = global.Promise;

//connect to mongoose

mongoose.connect('mongodb://localhost/videonotes-dev')
.then((response)=>{
console.log('MongoDB Connected')
})
.catch((error)=>{
console.log('error')
})
//Load idea Model

require('./models/Idea');

const Idea = mongoose.model('ideas');
//handlebars middleware

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body-parser middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//Index Route

app.get('/', (req, res)=>{
    const title = 'Welcome';
res.render('index', {
    title:title
});
});

//About Route

app.get('/about', (req, res)=>{
res.render('about')    
});

//Add idea form

app.get('/ideas/add', (req, res)=>{
    res.render('ideas/add')    
    });

//process form

app.post('/ideas', (req, res)=>{
    let errors = [];
    if(!req.body.title){
        errors.push({text:'Please add a title!'});   
    }
    if(!req.body.details){
        errors.push({text:'Please add some details!'});   
    }

    if (errors.length>0){
//re-render and pass back {errors & what the user has already entered}
        res.render('ideas/add',{
    errors: errors,
    title:req.body.title,
    details:req.body.details
});
    } else {
        res.send('passed')
    }

});

const port = 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});