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
var sequelize_typescript_1 = require("sequelize-typescript");
var HasMany_1 = require("../../lib/annotations/HasMany");
var Comment_1 = require("./Comment");
var User_1 = require("./User");
var PostAuthor_1 = require("./PostAuthor");
var Post = (function (_super) {
    __extends(Post, _super);
    function Post() {
        _super.apply(this, arguments);
    }
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.AutoIncrement,
        sequelize_typescript_1.Column, 
        __metadata('design:type', Number)
    ], Post.prototype, "id", void 0);
    __decorate([
        sequelize_typescript_1.Column, 
        __metadata('design:type', String)
    ], Post.prototype, "text", void 0);
    __decorate([
        HasMany_1.HasMany(function () { return Comment_1.Comment; }), 
        __metadata('design:type', Object)
    ], Post.prototype, "comments", void 0);
    __decorate([
        sequelize_typescript_1.BelongsToMany(function () { return User_1.User; }, function () { return PostAuthor_1.PostAuthor; }), 
        __metadata('design:type', Array)
    ], Post.prototype, "authors", void 0);
    Post = __decorate([
        sequelize_typescript_1.Table, 
        __metadata('design:paramtypes', [])
    ], Post);
    return Post;
}(sequelize_typescript_1.Model));
exports.Post = Post;
//# sourceMappingURL=Post.js.map