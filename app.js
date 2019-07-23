const _ = require('lodash');
const inputDataProvider = require('./inputDataProvider');
const {
  getCashOutJuridical,
  getCashOutNatural,
  getCashIn,
} = require('./commissionFeesConfigurationProvider');
const CommissionFeesCalculator = require('./commissionFeesCalculator');

async function calculateCommissionFees() {
  try {
    const inputData = await inputDataProvider.getInputData();

    const [
      cashIn,
      cashOutNatural,
      cashOutJuridical,
    ] = await Promise.all([getCashIn(), getCashOutNatural(), getCashOutJuridical()]);

    const commissionFeesCalculator = new CommissionFeesCalculator({
      cashIn,
      cashOutNatural,
      cashOutJuridical,
    });

    const commissionFees = commissionFeesCalculator.generateCommissionFees(inputData);

    console.log(commissionFees);
  } catch (err) {
    console.log(err);
  }
  // -- reset transaction amount limit per week
}

calculateCommissionFees();
