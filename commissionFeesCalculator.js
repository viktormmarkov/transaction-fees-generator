const _ = require('lodash');
const moment = require('moment');
const {
  VALID_OPERATIONS,
  VALID_USER_TYPES,
  SUPPORTED_CURRENCIES,
} = require('./transactionSchemaTypesCheck');

function getWeekNumber(date) {
  const dateMoment = moment(date);
  const weekday = dateMoment.weekday();
  const week = dateMoment.week();
  // moment week is from sunday to saturday
  // cant find a way to change it
  // good workaround for now
  if (weekday === 0) {
    return week - 1;
  } else {
    return week;
  }
}

class CommissionFeesCalculator {
  constructor({ cashIn, cashOutNatural, cashOutJuridical }) {
    this.cashIn = cashIn;
    this.cashOutNatural = cashOutNatural;
    this.cashOutJuridical = cashOutJuridical;
    this.userWeeklyTransactions = {};
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

  getCashInCommission({operation: {amount}}) {
    const {
      percents,
      max: {
        amount: maxAmount,
      },
    } = this.cashIn;
    return Math.min(percents * amount / 100, maxAmount);
  }

  getCashOutJuridicalCommission({operation: {amount}}) {
    const {
      percents,
      min: {
        amount: minAmount,
      },
    } = this.cashOutJuridical;
    return Math.max(percents * amount / 100, minAmount);
  }

  getCashOutNaturalCommission({operation: {amount}, user_id: userId, date}) {
    const {
      percents,
      week_limit: {
        amount: maxAmount,
      },
    } = this.cashOutNatural;
    const totalWeeklyUserTransaction = this.getWeeklyUserTransaction(userId, date);
    if (totalWeeklyUserTransaction > maxAmount) {
      return amount * percents / 100;
    } else if (totalWeeklyUserTransaction + amount > maxAmount) {
      return (totalWeeklyUserTransaction + amount - maxAmount) * percents / 100
    } else {
      return 0;
    }
  }

  generateFee(transaction) {
    const {
      type,
      user_id: userId,
      date,
      user_type: userType,
    } = transaction;
    const { amount } = transaction.operation;
    let commissionAmount = 0;
    if (type === 'cash_in') {
      commissionAmount = this.getCashInCommission(transaction);
    } else if (type === 'cash_out' && userType === 'natural') {
      commissionAmount = this.getCashOutNaturalCommission(transaction);
      this.updateWeeklyUserTransaction(userId, date, amount);
    } else if (type === 'cash_out' && userType === 'juridical') {
      commissionAmount = this.getCashOutJuridicalCommission(transaction);
    }
    return commissionAmount;
  }

  getWeeklyUserTransaction(userId, date) {
    const weekNumber = getWeekNumber(date);
    return (this.userWeeklyTransactions[weekNumber] && this.userWeeklyTransactions[weekNumber][userId]) || 0;
  }

  updateWeeklyUserTransaction(userId, date, amount) {
    const weekNumber = getWeekNumber(date);
    if (this.userWeeklyTransactions[weekNumber]) {
      const currentWeeklyAmount = this.userWeeklyTransactions[weekNumber][userId];
      this.userWeeklyTransactions[weekNumber][userId] = currentWeeklyAmount + amount;
    } else {
      this.userWeeklyTransactions[weekNumber] = {};
      this.userWeeklyTransactions[weekNumber][userId] = amount;
    }
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
