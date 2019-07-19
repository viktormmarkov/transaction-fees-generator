const fs = require('fs');
const http = require('http');
const args = process.argv;
const fileArgument = args.slice(2)[0];
const CASH_OUT_JURIDICAL_PROVIDER = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical';
const CASH_OUT_NATURAL_PROVIDER = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural';
const CASH_IN_PROVIDER = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural';

function wrapHttpRequestInPromise(url) {
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData)
                } catch (e) {
                    reject(e);
                }
            });
        });
    });
}

async function getCashOutJuridicalConfig() {
    return wrapHttpRequestInPromise(CASH_OUT_JURIDICAL_PROVIDER);
}

async function getCashOutNaturalConfig() {
    return wrapHttpRequestInPromise(CASH_OUT_NATURAL_PROVIDER);
}

async function getCashInConfig() {
    return wrapHttpRequestInPromise(CASH_IN_PROVIDER);
}


getCashOutJuridicalConfig();

fs.readFile(fileArgument, 'utf8', (err, data) => {
    if (err) return;
    const transactionData = JSON.parse(data);
})

// parse data
// validate data
// sort the transactions by date
// calculate transactions fees
// -- persists user current transaction amount
// -- reset transaction amount limit per week