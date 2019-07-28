const _ = require('lodash');
const inputDataProvider = require('./inputDataProvider');
const {
  getCashOutJuridical,
  getCashOutNatural,
  getCashIn,
} = require('./commissionFeesConfigurationProvider');
const CommissionFeesCalculator = require('./commissionFeesCalculator');

async function commissionFeeCalculatorFactory() {
  const [
    cashIn,
    cashOutNatural,
    cashOutJuridical,
  ] = await Promise.all([getCashIn(), getCashOutNatural(), getCashOutJuridical()]);

  return new CommissionFeesCalculator({
    cashIn,
    cashOutNatural,
    cashOutJuridical,
  });
}

async function calculateCommissionFees() {
  try {
    const inputData = await inputDataProvider.getInputData();
    const commissionFeesCalculator = await commissionFeeCalculatorFactory();
    const commissionFees = commissionFeesCalculator.generateCommissionFees(inputData);
    _.each(commissionFees, cf => console.log(cf));
  } catch (err) {
    console.log(err.message);
  }
}

calculateCommissionFees();
