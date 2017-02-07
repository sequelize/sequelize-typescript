import {User} from './models/User';
import {Post} from './models/Post';
import {Comment} from './models/Comment';
import {Sequelize} from "../index";
import {PostAuthor} from "./models/PostAuthor";

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
  .then(() => User.create({name: 'elisa'}))
  .then((user: User) =>
    Post
      .create({text: 'hey'})
      .then(post => Comment.create({
        postId: post.id,
        text: 'my comment',
        userId: user.id
      }))
      .then(() => {

        user.name = 'robin';

        return user.save();
      })
  )
  .then(() =>
    Post
      .findAll({
        include: [{
          model: Comment,
          as: 'comments',
          include: [{
            model: User,
            as: 'user'
          }]
        }
        ]
      })
      .then(posts => console.log(JSON.stringify(posts)))
  )
  .then(() => {
    const post = new Post({text: 'hey2'});

    return post.save();
  })
  .then(() => {
    PostAuthor.drop();
    Comment.drop();
    User.drop();
    Post.drop();
  })
;

