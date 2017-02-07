"use strict";
var User_1 = require('./models/User');
var Post_1 = require('./models/Post');
var Comment_1 = require('./models/Comment');
var index_1 = require("../index");
var PostAuthor_1 = require("./models/PostAuthor");
var sequelize = new index_1.Sequelize({
    name: 'blog',
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: ''
}, [
    __dirname + '/models'
]);
sequelize
    .sync()
    .then(function () { return User_1.User.create({ name: 'elisa' }); })
    .then(function (user) {
    return Post_1.Post
        .create({ text: 'hey' })
        .then(function (post) { return Comment_1.Comment.create({
        postId: post.id,
        text: 'my comment',
        userId: user.id
    }); })
        .then(function () {
        user.name = 'robin';
        return user.save();
    });
})
    .then(function () {
    return Post_1.Post
        .findAll({
        include: [{
                model: Comment_1.Comment,
                as: 'comments',
                include: [{
                        model: User_1.User,
                        as: 'user'
                    }]
            }
        ]
    })
        .then(function (posts) { return console.log(JSON.stringify(posts)); });
})
    .then(function () {
    var post = new Post_1.Post({ text: 'hey2' });
    return post.save();
})
    .then(function () {
    PostAuthor_1.PostAuthor.drop();
    Comment_1.Comment.drop();
    User_1.User.drop();
    Post_1.Post.drop();
});
//# sourceMappingURL=app.js.map