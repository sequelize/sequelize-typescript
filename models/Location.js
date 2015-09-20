///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>
module.exports = function (sequelize, DataTypes) {
    var Location = sequelize.define('Location', {
        position: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {},
            get: function () {
                return {
                    longitude: parseFloat(this.getDataValue('longitude')),
                    latitude: parseFloat(this.getDataValue('latitude'))
                };
            },
            set: function (position) {
                this.setDataValue('longitude', position.longitude);
                this.setDataValue('latitude', position.latitude);
            }
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {}
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {}
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        },
        postCode: {
            field: 'post_code',
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {}
        }
    }, (_a = {
            tableName: 'location',
            timestamps: false
        },
        _a['associate'] = function (models) {
            Location.hasMany(models.Viewing, {
                as: 'viewings',
                foreignKey: 'location_id'
            });
        },
        _a
    ));
    return Location;
    var _a;
};
//# sourceMappingURL=Location.js.map