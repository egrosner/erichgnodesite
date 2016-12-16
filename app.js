const express = require('express');
const pug = require('pug');

const app = express();

//server up the semantic css
app.use('/semantic/dist', express.static('semantic/dist'));
app.use(express.static('images'));

//sets the view engine to pug!
app.set('view engine', 'pug');

//about page
app.get('/about', (req, res) => res.render('about') );

//home page render
app.get('/', (req, res) => res.render('index') );



//server
app.listen(8080);