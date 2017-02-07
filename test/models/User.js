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
var Post_1 = require("./Post");
var BelongsToMany_1 = require("../../lib/annotations/BelongsToMany");
var PostAuthor_1 = require("./PostAuthor");
var User = (function (_super) {
    __extends(User, _super);
    function User() {
        _super.apply(this, arguments);
    }
    __decorate([
        sequelize_typescript_1.PrimaryKey,
        sequelize_typescript_1.AutoIncrement,
        sequelize_typescript_1.Column, 
        __metadata('design:type', Number)
    ], User.prototype, "id", void 0);
    __decorate([
        sequelize_typescript_1.Column, 
        __metadata('design:type', String)
    ], User.prototype, "name", void 0);
    __decorate([
        BelongsToMany_1.BelongsToMany(function () { return Post_1.Post; }, function () { return PostAuthor_1.PostAuthor; }), 
        __metadata('design:type', Array)
    ], User.prototype, "posts", void 0);
    User = __decorate([
        sequelize_typescript_1.Table, 
        __metadata('design:paramtypes', [])
    ], User);
    return User;
}(sequelize_typescript_1.Model));
exports.User = User;
//# sourceMappingURL=User.js.map