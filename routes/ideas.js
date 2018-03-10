const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


//Load idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Idea (notes) list page

router.get('/', (req, res) => {
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

router.get('/add', (req, res) => {
    res.render('ideas/add')
});

//edit idea form
// /:id is the parameter passed to the page (which idea/note we edit)
router.get('/edit/:id', (req, res) => {
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

router.post('/', (req, res) => {
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

router.put('/:id',(req, res)=>{
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

router.delete('/:id',(req, res)=>{

    Idea.remove({_id:req.params.id})
    .then(()=>{
        req.flash('success_msg', 'Video Note Removed')
        res.redirect('/ideas');
    });

 });


module.exports = router;