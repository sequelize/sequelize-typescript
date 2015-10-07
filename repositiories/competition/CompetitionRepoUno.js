///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Q = require('q');
var index_1 = require('../../models/index');
var BaseRepo_1 = require("../BaseRepo");
var CompetitionRepoUno = (function (_super) {
    __extends(CompetitionRepoUno, _super);
    function CompetitionRepoUno() {
        _super.apply(this, arguments);
    }
    CompetitionRepoUno.prototype.getCompetitionTeams = function (competitionId, limit) {
        return Q.when()
            .then(function () { return index_1["default"].Team.findAll({
            include: [
                {
                    model: index_1["default"].Competition,
                    as: 'competitions',
                    where: {
                        id: competitionId
                    }
                }
            ],
            limit: limit
        }); });
    };
    return CompetitionRepoUno;
})(BaseRepo_1.BaseRepo);
exports.CompetitionRepoUno = CompetitionRepoUno;
//# sourceMappingURL=CompetitionRepoUno.js.map