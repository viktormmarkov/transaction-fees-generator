const { promisifyGetRequest } = require('./httpPromiseWrapper');
const CASH_OUT_JURIDICAL_URL = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical';
const CASH_OUT_NATURAL_URL = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural';
const CASH_IN_URL = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural';

async function getCashOutJuridical() {
    return promisifyGetRequest(CASH_OUT_JURIDICAL_URL);
}

async function getCashOutNatural() {
    return promisifyGetRequest(CASH_OUT_NATURAL_URL);
}

async function getCashIn() {
    return promisifyGetRequest(CASH_IN_URL);
}

module.exports = {
    getCashOutJuridical,
    getCashOutNatural,
    getCashIn
}