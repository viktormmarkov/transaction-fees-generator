const _ = require('lodash');
const {
  VALID_OPERATIONS,
  VALID_USER_TYPES,
  SUPPORTED_CURRENCIES,
} = require('./transactionSchemaTypesCheck');

class ComissionFeesProcessor {
  constructor(commissionFeesConfig) {
    this.commissionFeesConfig = commissionFeesConfig;
  }

  static isOperationTypeValid(type) {
    return type && _.contains(VALID_OPERATIONS, type);
  }

  static isUserTypeValid(userType) {
    return userType && _.contains(VALID_USER_TYPES, userType);
  }

  static isCurrencyValid(currency) {
    return currency && _.contains(SUPPORTED_CURRENCIES, currency);
  }

  static isAmountValid(amount) {
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
      operation: {
        amount,
      },
    } = transaction;
    let commissionAmount = 0;
    if (type === 'cash_in') {
      const {
        percents,
        max: {
          amount: maxAmount,
        },
      } = this.commissionFeesConfig.cashIn;
      commissionAmount = Math.min(percents * amount / 100, maxAmount);
    } else if (type === 'cash_out' && userType === 'natural') {
      commissionAmount = 0;
    } else if (type === 'cash_out' && userType === 'juridical') {
      const {
        percents,
        min: {
          amount: minAmount,
        },
      } = this.commissionFeesConfig.cashOutJuridical;
      commissionAmount = Math.max(percents * amount / 100, minAmount);
    }
    return commissionAmount;
  }

  async generateCommissionFees(transactions) {
    return _(transactions)
      .filter(this.validateTransaction)
      .map(this.generateFee)
      .value();
  }
}

module.exports = ComissionFeesProcessor;
