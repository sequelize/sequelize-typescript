///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>
var CountryRepoUno_1 = require("../../repositiories/country/CountryRepoUno");
var CountrySvcUno = (function () {
    function CountrySvcUno() {
        this.countryRepo = new CountryRepoUno_1.CountryRepoUno();
    }
    CountrySvcUno.prototype.getCountries = function (limit) {
        return this.countryRepo.getCountries(limit);
    };
    CountrySvcUno.prototype.getCountryCompetitions = function (competitionId, limit) {
        return this.countryRepo.getCountryCompetitions(competitionId, limit);
    };
    return CountrySvcUno;
})();
exports.CountrySvcUno = CountrySvcUno;
//# sourceMappingURL=CountrySvcUno.js.map