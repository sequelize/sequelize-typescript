"use strict";
var User_1 = require("./models/User");
var Post_1 = require("./models/Post");
var Comment_1 = require("./models/Comment");
var index_1 = require("../index");
var PostTopic_1 = require("./models/PostTopic");
var UserFriend_1 = require("./models/UserFriend");
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
    .then(function () { return Promise.all([
    User_1.User.create({ name: 'elisa' }),
    User_1.User.create({ name: 'nelly' }),
    User_1.User.create({ name: 'elisa' })
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
        include: [{
                model: Comment_1.Comment,
                as: 'comments',
                attributes: ['id', 'text'],
                include: [{
                        model: User_1.User,
                        as: 'user',
                        include: [{
                                model: User_1.User,
                                as: 'friends',
                                through: {
                                    attributes: []
                                }
                            }]
                    }]
            }, {
                model: User_1.User,
                as: 'user',
                include: [{
                        model: User_1.User,
                        as: 'friends',
                        through: {
                            attributes: []
                        }
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
    UserFriend_1.UserFriend.drop();
    PostTopic_1.PostTopic.drop();
    Comment_1.Comment.drop();
    Post_1.Post.drop();
    User_1.User.drop();
});
//# sourceMappingURL=app.js.map