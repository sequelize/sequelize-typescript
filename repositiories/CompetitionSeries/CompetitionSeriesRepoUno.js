///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>
var Q = require('q');
var index_1 = require('../../models/index');
var CompetitionSeriesRepoUno = (function () {
    function CompetitionSeriesRepoUno() {
    }
    CompetitionSeriesRepoUno.prototype.getCompetitionSeries = function () {
        return Q.when()
            .then(function () { return index_1["default"].CompetitionSeries.findAll(); })
            .then(function (competitionSeries) {
            return competitionSeries;
        });
    };
    return CompetitionSeriesRepoUno;
})();
exports.CompetitionSeriesRepoUno = CompetitionSeriesRepoUno;
//# sourceMappingURL=CompetitionSeriesRepoUno.js.map