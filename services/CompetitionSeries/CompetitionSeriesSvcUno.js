///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>
var CompetitionSeriesRepoUno_1 = require("../../repositiories/CompetitionSeries/CompetitionSeriesRepoUno");
var CompetitionSeriesSvcUno = (function () {
    function CompetitionSeriesSvcUno() {
        this.competitionSeriesRepo = new CompetitionSeriesRepoUno_1.CompetitionSeriesRepoUno();
    }
    CompetitionSeriesSvcUno.prototype.getCompetitionSeries = function () {
        return this.competitionSeriesRepo.getCompetitionSeries();
    };
    return CompetitionSeriesSvcUno;
})();
exports.CompetitionSeriesSvcUno = CompetitionSeriesSvcUno;
//# sourceMappingURL=CompetitionSeriesSvcUno.js.map