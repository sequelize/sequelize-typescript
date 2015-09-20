///<reference path="../typings/node/node.d.ts"/>
///<reference path="../typings/sequelize/sequelize.d.ts"/>
module.exports = function (sequelize, DataTypes) {
    var Viewing = sequelize.define('Viewing', {
        matchId: {
            field: 'match_id',
            type: DataTypes.NUMBER,
            allowNull: false,
            validate: {}
        },
        locationId: {
            field: 'location_id',
            type: DataTypes.NUMBER,
            allowNull: false,
            validate: {}
        },
        startTime: {
            field: 'start_time',
            type: DataTypes.DATE,
            allowNull: true,
            validate: {}
        }
    }, (_a = {
            tableName: 'viewing',
            timestamps: false
        },
        _a['associate'] = function (models) {
            Viewing.belongsTo(models.Match, {
                as: 'match',
                foreignKey: 'match_id'
            });
            Viewing.belongsTo(models.Location, {
                as: 'location',
                foreignKey: 'location_id'
            });
        },
        _a
    ));
    return Viewing;
    var _a;
};
//# sourceMappingURL=Viewing.js.map