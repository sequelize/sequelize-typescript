"use strict";
var Author_1 = require("./models/Author");
var Post_1 = require("./models/Post");
var Comment_1 = require("./models/Comment");
var index_1 = require("../index");
var PostTopic_1 = require("./models/PostTopic");
var AuthorFriend_1 = require("./models/AuthorFriend");
var Topic_1 = require("./models/Topic");
var sequelize = new index_1.Sequelize({
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
    .then(function () { return Promise.all([
    Author_1.Author.create({ name: 'elisa' }),
    Author_1.Author.create({ name: 'nelly' }),
    Author_1.Author.create({ name: 'elisa' })
]); })
    .then(function (_a) {
    var robin = _a[0], nelly = _a[1], elisa = _a[2];
    return Post_1.Post
        .create({ text: 'hey', userId: nelly.id })
        .then(function (post) { return Comment_1.Comment.create({
        postId: post.id,
        text: 'my comment',
        userId: robin.id
    }); })
        .then(function () {
        robin.name = 'robin';
        return Promise.all([
            robin.addFriend(nelly),
            robin.addFriend(elisa),
            robin.save()
        ]);
    });
})
    .then(function () {
    return Post_1.Post
        .findAll({
        attributes: ['id', 'text'],
        include: [
            Comment_1.Comment
        ]
    })
        .then(function (posts) {
        // prettyjson.render(posts);
        console.log(JSON.stringify(posts));
        posts.forEach(function (post) {
            console.log(post instanceof Post_1.Post);
        });
    });
})
    .then(function () {
    var post = new Post_1.Post({ text: 'hey2' });
    return post.save();
})
    .then(function () {
    Post_1.Post.build({ text: 'hey3' });
})
    .then(function () {
    AuthorFriend_1.AuthorFriend.drop();
    PostTopic_1.PostTopic.drop();
    Topic_1.Topic.drop();
    Comment_1.Comment.drop();
    Post_1.Post.drop();
    Author_1.Author.drop();
});
//# sourceMappingURL=app.js.map