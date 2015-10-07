///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>
var Q = require('q');
var index_1 = require('../../models/index');
var TeamRepoUno = (function () {
    function TeamRepoUno() {
    }
    TeamRepoUno.prototype.getTeams = function () {
        return Q.when()
            .then(function () { return index_1["default"].Team.findAll(); })
            .then(function (teams) {
            return teams;
        });
    };
    return TeamRepoUno;
})();
exports.TeamRepoUno = TeamRepoUno;
//# sourceMappingURL=TeamRepoUno.js.map