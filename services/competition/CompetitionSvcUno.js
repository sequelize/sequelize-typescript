///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>
var CompetitionRepoUno_1 = require("../../repositiories/competition/CompetitionRepoUno");
var CompetitionSvcUno = (function () {
    function CompetitionSvcUno() {
        this.competitionRepo = new CompetitionRepoUno_1.CompetitionRepoUno();
    }
    CompetitionSvcUno.prototype.getCompetitionTeams = function (competitionId, limit) {
        return this.competitionRepo.getCompetitionTeams(competitionId, limit);
    };
    return CompetitionSvcUno;
})();
exports.CompetitionSvcUno = CompetitionSvcUno;
//# sourceMappingURL=CompetitionSvcUno.js.map