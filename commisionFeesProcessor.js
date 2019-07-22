class ComissionFeesProcessor {
    constructor(commissionFeesConfig) {
        this.commissionFeesConfig = commissionFeesConfig;
    };

    validateTransaction(transaction) {
        const {type, user_type: userType, operation: { amount, currency }} = transaction;
    }

    generateFee(transaction) {
        const {type, user_type: userType, operation: { amount, currency }} = transaction;
        if (type === 'cash_in') {
            const { percents, max: { amount: maxAmount, currency: cashInCurrency } } = this.commissionFeesConfig.cashIn;
            if (cashInCurrency === currency) {
                return Math.min(percents * amount, maxAmount);
            }
        } else if (type === 'cash_out') {
            if (userType === "natural") {
            } else if (userType === 'juridical') {
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