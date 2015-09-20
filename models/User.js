///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        },
        registrationDate: {
            field: 'registration_date',
            type: DataTypes.DATE,
            allowNull: false,
            validate: {}
        },
        lastLoginDate: {
            field: 'last_login_date',
            type: DataTypes.DATE,
            allowNull: false,
            validate: {}
        }
    }, (_a = {
            tableName: 'user',
            timestamps: false
        },
        _a['associate'] = function (models) {
        },
        _a
    ));
    return User;
    var _a;
};
//# sourceMappingURL=User.js.map