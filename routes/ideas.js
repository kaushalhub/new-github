const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth')

// Load Idea Model

require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea Index Pages

router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({user: req.user.id})
        .sort({})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});
// Add Ideas Routes

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add')
});

// Edit data form mongodb

router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if(idea.user != req.user.id){
                req.flash('error_msg', 'Not Authorized')
                res.redirect('/ideas');
            }else{
                res.render('ideas/edit', {
                    idea: idea
                });
            }
        });
});

// Process Form Data

router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a Title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add Some Details' });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Idea Added Successfully');
                res.redirect('/ideas');
            })
    }
});

// Edit form using PUT request

router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Idea Updated Successfully');
                    res.redirect('/ideas');
                });
        });
});


// Delete Data

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Idea Remove Successfully');
            res.redirect('/ideas');
        });
});



module.exports = router;