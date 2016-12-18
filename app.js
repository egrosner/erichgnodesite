const express = require('express');
const pug = require('pug');
const Sequelize = require('sequelize');

const app = express();

var sequelize = new Sequelize(process.env.JAWSDB_URL);

var BlogPost = sequelize.define('blogpost', {
  id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
  },
  title: Sequelize.STRING
});

sequelize.sync();

/*
BlogPost.upsert({
    title: 'first post'
});
*/

//server up the semantic css
app.use('/semantic/dist', express.static('semantic/dist'));
app.use(express.static('images'));

//sets the view engine to pug!
app.set('view engine', 'pug');

//about page
app.get('/about', (req, res) => {
    res.render(req.route.path.substr(1, req.route.path.length));
});

//home page render
app.get('/', (req, res) => {
    BlogPost.findAll().then(posts => {
        res.render('index', posts[0].dataValues);
    });
});

//server
app.listen(process.env.PORT);