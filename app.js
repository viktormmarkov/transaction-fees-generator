const fs = require('fs');
const args = process.argv;
const fileArgument = args.slice(2)[0];

fs.readFile(fileArgument, 'utf8', (err, data) => {
    if (err) return;
    const transactionData = JSON.parse(data);    
})