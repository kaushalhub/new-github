const express = require("express");
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');  
const mongoose = require('mongoose');
const app = express();

// load Routes

const ideas = require('./routes/ideas');
const users = require('./routes/users');


// passport Config

require('./config/passport')(passport);

// Map global  promise - get rid  of Warning

mongoose.Promise = global.Promise;

// connect To MongoDB

// mongoose.connect('mongodb://localhost/idea-dev',  {
//         useMongoClient: true
// })

mongoose.connect('mongodb://heroku_v6dp9kd8:o0j8gej067811k02mio7kgk8ak@ds333248.mlab.com:33248/heroku_v6dp9kd8',  {
        useMongoClient: true
})

.then(() => 
    console.log('MongoDB Connected....... Yeh'))
.catch(err => console.log(err));


// Add Handlebars

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// Body Parser

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// parse application/json
app.use(bodyParser.json());


// Method Override Middleware
app.use(methodOverride('_method'))

// Experess-Session Middleware

app.use(session({
    secret: 'secrate',
    resave: true,
    saveUninitialized: true
}))

// Passport-Session Middleware

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


// Global Variable

    app.use(function(req, res, next){

        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;                                             
        next();
    });


// How Middleware Work

app.use(function(req, res, next){
        
        req.name = 'kaushal';
        next();
});



// Index Routing

app.get('/', (req, res) => {
        const title = 'IdeaBookMark'
        res.render('index', {title: title});
});

// About Routing

app.get('/about', (req, res) => {
        res.render('about')
});


// use Routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 3000;

app.listen(port, () => {
        console.log('server started on port' + port);
});