const _ = require('lodash');
const {
  VALID_OPERATIONS,
  VALID_USER_TYPES,
  SUPPORTED_CURRENCIES,
} = require('./transactionSchemaTypesCheck');

class CommissionFeesCalculator {
  constructor({ cashIn, cashOutNatural, cashOutJuridical }) {
    this.cashIn = cashIn;
    this.cashOutNatural = cashOutNatural;
    this.cashOutJuridical = cashOutJuridical;
  }

  isOperationTypeValid(type) {
    return type && _.includes(VALID_OPERATIONS, type);
  }

  isUserTypeValid(userType) {
    return userType && _.includes(VALID_USER_TYPES, userType);
  }

  isCurrencyValid(currency) {
    return currency && _.includes(SUPPORTED_CURRENCIES, currency);
  }

  isAmountValid(amount) {
    return _.isFinite(amount);
  }

  validateTransaction(transaction) {
    const {
      type,
      user_type: userType,
      operation: {
        amount,
        currency,
      },
    } = transaction;
    const isOperationTypeValid = this.isOperationTypeValid(type);
    const isUserTypeValid = this.isUserTypeValid(userType);
    const isCurrencyValid = this.isCurrencyValid(currency);
    const isAmountValid = this.isAmountValid(amount);

    // consider checking whether operation configuration has the same currency as the transaction
    return isOperationTypeValid && isUserTypeValid && isCurrencyValid && isAmountValid;
  }

  generateFee(transaction) {
    const {
      type,
      user_type: userType,
    } = transaction;
    const {amount} = transaction.operation;
    let commissionAmount = 0;
    if (type === 'cash_in') {
      const {
        percents,
        max: {
          amount: maxAmount,
        },
      } = this.cashIn;
      commissionAmount = Math.min(percents * amount / 100, maxAmount);
    } else if (type === 'cash_out' && userType === 'natural') {
      commissionAmount = 0;
    } else if (type === 'cash_out' && userType === 'juridical') {
      const {
        percents,
        min: {
          amount: minAmount,
        },
      } = this.cashOutJuridical;
      commissionAmount = Math.max(percents * amount / 100, minAmount);
    }
    return commissionAmount;
  }

  generateCommissionFees(transactions) {
    return _(transactions)
      .sortBy(({date}) => new Date(date))
      .filter(transaction => this.validateTransaction(transaction))
      .map(transaction => this.generateFee(transaction))
      .value();
  }
}

module.exports = CommissionFeesCalculator;
