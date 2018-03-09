const express = require('express');
const exphbs = require('express-handlebars');
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

//handlebars middleware

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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

const port = 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});