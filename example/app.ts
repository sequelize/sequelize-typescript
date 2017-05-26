import {Promise} from 'sequelize';
import {Author} from './models/Author';
import {Post} from './models/Post';
import {Comment} from './models/Comment';
import {Sequelize} from "../index";
import * as prettyjson from 'prettyjson';
import {Person} from "./models/validation-only/Person";
import Book from "./models/Book";

/* tslint:disable:no-console */
/* tslint:disable:no-unused-new */

new Sequelize({
  validateOnly: true,
  modelPaths: [__dirname + '/models/validation-only']
});

const person = new Person({
  name: 'dsfsdfdsfsdfdsff'
});

person
  .validate()
  .then(err => {

    console.error(err);
  })
  .catch(err => {
    console.error(err);
  })
;


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
      Author.create<Author>({name: 'elisa', secret: '3k435kj43'}),
      Author.create<Author>({name: 'nelly'}),
      Author.create<Author>({name: 'elisa'})
    ])
  )
  .then(([robin, nelly, elisa]) => Post
    .create<Post>({text: 'hey', authorId: nelly.id})
    .then(post => Comment.create<Comment>({
      postId: post.id,
      text: 'my comment',
      authorId: robin.id
    }))
    .then(() => {

      robin.name = 'robin';

      return Promise.all([
        robin.save(),
        robin.$add('friend', nelly),
        robin.$add('friend', elisa)
      ]);
    })
  )
  .then(() => {
    const post = new Post({
      text: 'hey',
      author: {
        name: 'jörn'
      }
    }, {include: [Author]});

    return post
      .save({validate: true})
      .catch(err => {
        'stop';
      });
  })
  .then(() => Post.build<Post>({text: 'hey3'}).save())
  .then(() => Post
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
    .then(() => Author.findAll())
    .then(authors => {
      console.log('--------------- AUTHOR DEFAULT SCOPE ----------------');
      console.log(prettyjson.renderString(JSON.stringify(authors)));
    })
    .then(() => Author.scope('full').findAll())
    .then(authors => {
      console.log('--------------- AUTHOR FULL SCOPE -------------------');
      console.log(prettyjson.renderString(JSON.stringify(authors)));
    })
    .then(() => Author.unscoped().findAll())
    .then(authors => {
      console.log('--------------- AUTHOR UN-SCOPE ---------------------');
      console.log(prettyjson.renderString(JSON.stringify(authors)));
    })
    .then(() => Post.scope('full').findAll())
    .then(posts => {
      console.log('--------------- POST FULL SCOPE ---------------------');
      console.log(prettyjson.renderString(JSON.stringify(posts)));
    })
  )
  .then(() => Promise.all([
    Book.create<Book>({title: 'Sherlock Holmes', year: 1891}),
    Author.create<Author>({name: 'Sir Arthur Conan Doyle'}),
    Author.create<Author>({name: 'No-Ghost'}),
  ]))
  .then(([book, ...authors]) =>
    book
      .$set('authors', authors)
      .then(() => Book.scope('withAuthors').findById<Book>(book.id))
      .then(_book => {
        console.log('--------------- BOOOOOOOOOOOOOOOOOK ---------------------');
        console.log(prettyjson.renderString(JSON.stringify(_book)));
      })
      .then(() => Book.findById<Book>(book.id))
      .then(_book => _book.$get('authors'))
      .then(_authors => {
        console.log('--------------- BOOOKS AUTHOOOOOOOR ---------------------');
        console.log(prettyjson.renderString(JSON.stringify(_authors)));
      })
      .then(() => {
        book.year = 2000;

        return book.save();
      })
      .then(() => Book.findById<Book>(book.id))
      .then(_book => {
        console.log('--------------- YEAR CHANGED ---------------------');
        console.log(prettyjson.renderString(JSON.stringify(_book)));
      })
  )
;

