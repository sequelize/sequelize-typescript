"use strict";
var Post_1 = require('./models/Post');
var index_1 = require("../index");
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
    .then(function () {
    Post_1.Post
        .create({ text: 'hey' })
        .then(function () { return Post_1.Post.findOne(); })
        .then(function (post) { return console.log(post instanceof Post_1.Post); });
    var post = new Post_1.Post({ text: 'hey2' });
    post.save();
});
//# sourceMappingURL=app.js.map