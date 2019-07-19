const fs = require('fs');
const args = process.argv;
const fileArgument = args.slice(2)[0];
const commissionFeesProvider = require('./commisionFeesProvider');

async function printCommissionFees() {
    const natural = await commissionFeesProvider.getCashOutNatural();
    const juridical = await commissionFeesProvider.getCashOutJuridical();
    const cashin = await commissionFeesProvider.getCashIn();
    console.log(natural, juridical, cashin);
};

printCommissionFees();

fs.readFile(fileArgument, 'utf8', (err, data) => {
    if (err) return;
    const transactionData = JSON.parse(data);
})

// getconfigdata
// parse data
// validate data
// sort the transactions by date
// calculate transactions fees
// -- persists user current transaction amount
// -- reset transaction amount limit per week