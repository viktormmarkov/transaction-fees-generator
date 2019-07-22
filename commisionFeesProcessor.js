const _ = require('lodash');
const {
    VALID_OPERATIONS,
    VALID_USER_TYPES,
    SUPPORTED_CURRENCIES
} = require('./transactionSchemaTypesCheck');

class ComissionFeesProcessor {
    constructor(commissionFeesConfig) {
        this.commissionFeesConfig = commissionFeesConfig;
    };

    isOperationTypeValid(type) {
        return type && _.contains(VALID_OPERATIONS, type);
    }

    isUserTypeValid(userType) {
        return type && _.contains(VALID_USER_TYPES, userType);
    }

    isCurrencyValid(currency) {
        return currency && _.contains(SUPPORTED_CURRENCIES, currency);
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
                currency
            }
        } = transaction;
        const isOperationTypeValid = this.isOperationTypeValid(type);
        const isUserTypeValid = this.isUserTypeValid(userType);
        const isCurrencyValid = this.isCurrencyValid(currency);
        const isAmountValid = this.isAmountValid(amount);

        // consider checking whether operation configuration has the same currency as the transaction
        return isOperationTypeValid && isUserTypeValid && isCurrencyValid && isAmountValid;
    }

    generateFee(transaction) {
        const { type, user_type: userType, operation: { amount }} = transaction;
        if (type === 'cash_in') {
            const { percents, max: { amount: maxAmount } } = this.commissionFeesConfig.cashIn;
                return Math.min(percents * amount / 100, maxAmount);
        } else if (type === 'cash_out') {
            if (userType === 'natural') {

            } else if (userType === 'juridical') {
                const { percents, min: { amount: minAmount } } = this.commissionFeesConfig.cashOutJuridical;
                return Math.max(percents * amount / 100, minAmount);
            }
        }
    }

    async generateCommissionFees(transactions) {
        return _(transactions)
            .filter(validateTransaction)
            .map(generateFee)
            .value();
    };
}

module.exports = ComissionFeesProcessor;