import {User} from './models/User';
import {Post} from './models/Post';
import {Comment} from './models/Comment';
import {Sequelize} from "../index";
import {PostTopic} from "./models/PostTopic";
import {UserFriend} from "./models/UserFriend";
import {Topic} from "./models/Topic";
import * as prettyjson from 'prettyjson';

const sequelize = new Sequelize({
  name: 'blog',
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  modelPaths: [
    __dirname + '/models'
  ]
});

sequelize
  .sync()
  .then(() => Promise.all([
      User.create({name: 'elisa'}),
      User.create({name: 'nelly'}),
      User.create({name: 'elisa'})
    ])
  )
  .then(([robin, nelly, elisa]) =>
    Post
      .create({text: 'hey', userId: nelly.id})
      .then(post => Comment.create({
        postId: post.id,
        text: 'my comment',
        userId: robin.id
      }))
      .then(() => {

        robin.name = 'robin';

        return Promise.all([
          robin.addFriend(nelly),
          robin.addFriend(elisa),
          robin.save()
        ]);
      })
  )
  .then(() =>
    Post
      .findAll({
        attributes: ['id', 'text'],
        include: [{
          model: Comment,
          as: 'comments',
          attributes: ['id', 'text'],
          include: [{
            model: User,
            as: 'user',
            include: [{
              model: User,
              as: 'friends',
              through: {
                attributes: []
              }
            }]
          }]
        }, {
          model: User,
          as: 'user',
          include: [{
            model: User,
            as: 'friends',
            through: {
              attributes: []
            }
          }]
        }
        ]
      })
      .then(posts => {

        // prettyjson.render(posts);

        posts.forEach(post => {

          console.log(post instanceof Post);
        });
      })
  )
  .then(() => {
    const post = new Post({text: 'hey2'});

    return post.save();
  })
  .then(() => {
    Post.build({text: 'hey3'});
  })
  .then(() => {
    UserFriend.drop();
    PostTopic.drop();
    Topic.drop();
    Comment.drop();
    Post.drop();
    User.drop();
  })
;

