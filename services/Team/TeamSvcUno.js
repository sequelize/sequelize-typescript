///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>
var TeamRepoUno_1 = require("../../repositiories/Team/TeamRepoUno");
var TeamSvcUno = (function () {
    function TeamSvcUno() {
        this.teamRepo = new TeamRepoUno_1.TeamRepoUno();
    }
    TeamSvcUno.prototype.getTeams = function () {
        return this.teamRepo.getTeams();
    };
    return TeamSvcUno;
})();
exports.TeamSvcUno = TeamSvcUno;
//# sourceMappingURL=TeamSvcUno.js.map