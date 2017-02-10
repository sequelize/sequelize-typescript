"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var index_1 = require("../../index");
var HasMany_1 = require("../../lib/annotations/HasMany");
var Comment_1 = require("./Comment");
var PostTopic_1 = require("./PostTopic");
var Topic_1 = require("./Topic");
var ForeignKey_1 = require("../../lib/annotations/ForeignKey");
var User_1 = require("./User");
var BelongsTo_1 = require("../../lib/annotations/BelongsTo");
var Post = (function (_super) {
    __extends(Post, _super);
    function Post() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Post;
}(index_1.Model));
__decorate([
    index_1.PrimaryKey,
    index_1.AutoIncrement,
    index_1.Column,
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    index_1.Column,
    __metadata("design:type", String)
], Post.prototype, "text", void 0);
__decorate([
    HasMany_1.HasMany(function () { return Comment_1.Comment; }),
    __metadata("design:type", Object)
], Post.prototype, "comments", void 0);
__decorate([
    index_1.BelongsToMany(function () { return Topic_1.Topic; }, function () { return PostTopic_1.PostTopic; }),
    __metadata("design:type", Array)
], Post.prototype, "topics", void 0);
__decorate([
    ForeignKey_1.ForeignKey(function () { return User_1.User; }),
    index_1.Column,
    __metadata("design:type", Number)
], Post.prototype, "userId", void 0);
__decorate([
    BelongsTo_1.BelongsTo(function () { return User_1.User; }),
    __metadata("design:type", User_1.User)
], Post.prototype, "user", void 0);
Post = __decorate([
    index_1.Table
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map