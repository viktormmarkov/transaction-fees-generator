const fs = require('fs');
const args = process.argv;
const fileArgument = args.slice(2)[0];
const InputDataProvider = require('./inputDataProvider');


// getconfigdata
// parse data
// validate data
// sort the transactions by date
// calculate transactions fees
// -- persists user current transaction amount
// -- reset transaction amount limit per week