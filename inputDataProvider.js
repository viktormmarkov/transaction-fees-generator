const fs = require('fs');

const args = process.argv;
const fileArgument = args.slice(2)[0];

class InputDataProvider {
  static async getInputData() {
    return new Promise((resolve, reject) => {
      if (!fileArgument) {
        reject(new Error('Please pass path to input file as an argument'));
      }
      fs.readFile(fileArgument, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const transactionData = JSON.parse(data);
          resolve(transactionData);
        }
      });
    });
  }
}

module.exports = InputDataProvider;
