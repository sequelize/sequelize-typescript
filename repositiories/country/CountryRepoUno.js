///<reference path="../../node_modules/tsd-goalazo-models/models.d.ts"/>
///<reference path="../../typings/q/Q.d.ts"/>
var Q = require('q');
var index_1 = require('../../models/index');
var CountryRepoUno = (function () {
    function CountryRepoUno() {
    }
    CountryRepoUno.prototype.getCountries = function (limit) {
        return Q.when()
            .then(function () { return index_1["default"].Country.findAll({
            limit: limit
        }); });
    };
    CountryRepoUno.prototype.getCountryCompetitions = function (countryId, limit) {
        return Q.when()
            .then(function () { return index_1["default"].Competition.findAll({
            include: [
                {
                    model: index_1["default"].Country,
                    as: 'countries',
                    where: {
                        id: countryId
                    }
                }
            ],
            limit: limit
        }); });
    };
    return CountryRepoUno;
})();
exports.CountryRepoUno = CountryRepoUno;
//# sourceMappingURL=CountryRepoUno.js.map