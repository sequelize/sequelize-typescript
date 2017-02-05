import {Post} from './models/Post';
import {Sequelize} from "../index";

const sequelize = new Sequelize({
    name: 'blog',
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: ''
  },
  [
    __dirname + '/models'
  ]);

sequelize
  .sync()
  .then(() => {

    Post
      .create({text: 'hey'})
      .then(() => Post.findOne())
      .then(post => console.log(post instanceof Post));

    const post = new Post({text: 'hey2'});

    post.save();
  });

