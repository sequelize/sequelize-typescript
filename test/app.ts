import {Promise} from 'sequelize';
import {Author} from './models/Author';
import {Post} from './models/Post';
import {Comment} from './models/Comment';
import {Sequelize} from "../index";
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
  .sync({force: true})
  .then(() => Promise.all([
      Author.create<Author>({name: 'elisa'}),
      Author.create<Author>({name: 'nelly'}),
      Author.create<Author>({name: 'elisa'})
    ])
  )
  .then(([robin, nelly, elisa]) =>
    Post
      .create<Post>({text: 'hey', userId: nelly.id})
      .then(post => Comment.create<Comment>({
        postId: post.id,
        text: 'my comment',
        userId: robin.id
      }))
      .then(() => {

        robin.name = 'robin';

        return Promise.all([
          robin.add('Friend', nelly),
          robin.add('Friend', elisa)
        ]);
      })
  )
  .then(() =>
    Post
      .findAll<Post>({
        attributes: ['id', 'text'],
        include: [{
            model: Comment,
            attributes: ['id', 'text'],
            include: [{
              model: Author,
              include: [{
                model: Author,
                through: {
                  attributes: []
                }
              }]
            }]
          }, {
            model: Author,
            include: [{
              model: Author,
              through: {
                attributes: []
              }
            }]
          }
        ]
      })
      .then(posts => {

        console.log(prettyjson.renderString(JSON.stringify(posts)));

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
;

