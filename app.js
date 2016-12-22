const express = require('express');
const pug = require('pug');
const Sequelize = require('sequelize');
const uuid = require('uuid');

const app = express();

const sequelize = new Sequelize(process.env.JAWSDB_URL);

const User = sequelize.define('user', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    name: Sequelize.STRING,
    picture: Sequelize.STRING,
});

const BlogPost = sequelize.define('blog_post', {
  id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
  },
  title: Sequelize.STRING,
  body: Sequelize.STRING,
  postDate: Sequelize.DATE
});

const Tag = sequelize.define('tag', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: Sequelize.STRING
});

const BlogTag = sequelize.define('blog_tag', {
  id: {
      type: Sequelize.UUID,
      primaryKey: true, 
      defaultValue: Sequelize.UUIDV4
  },
});

Tag.belongsToMany(BlogPost, {
    through: BlogTag
});
BlogPost.belongsToMany(Tag, {
    through: BlogTag
});

BlogPost.belongsTo(User);

sequelize.sync();

/*
User.create({
    id: 'a0ed4146-924f-47cf-be6c-9140e9c734e9',
    name: 'erich',
    picture: 'me.jpg'
}).then((erichUser) => {
    BlogPost.create({
        id: '2971b435-4dd8-455c-864f-e53a68c454e7',
        title: 'first post',
        body: 'this is the content of the first post',
        postDate: new Date()
    }).then((post) => {
        post.setUser(erichUser);
    });
});
*/


//server up the semantic css
app.use('/semantic/dist', express.static('semantic/dist'));
app.use(express.static('images'));

//sets the view engine to pug!
app.set('view engine', 'pug');

app.get('/data/init', (req, res) => {
    let createdErich;
    User.create({
        id: 'a0ed4146-924f-47cf-be6c-9140e9c734e9',
        name: 'erich',
        picture: 'me.jpg'
    }).then((erichUser) => {
        createdErich = erichUser;
        return BlogPost.create({
            id: '2971b435-4dd8-455c-864f-e53a68c454e7',
            title: 'first post',
            body: 'this is the content of the first post',
            postDate: new Date()
        });
    }).then((post) => {
        post.setUser(createdErich);
    });
})

//about page
app.get('/about', (req, res) => {
    res.render(req.route.path.substr(1, req.route.path.length));
});

//home page render
app.get('/', (req, res) => {
    BlogPost.findAll({include: User}).then(posts => {
        if(posts.length == 0) {
            res.render('index');
        }
        else {
            res.render('index', posts[0].dataValues);
        }
    });
});

//server
app.listen(process.env.PORT);