class ComissionFeesProcessor {
    constructor(commissionFeesConfig) {
        this.commissionFeesConfig = commissionFeesConfig;
    };

    validateTransaction(transaction) {
        return false
    }

    generateFee(transaction) {
        return 0;
    }

    async generateCommissionFees(transactions) {
        return _(transactions)
            .filter(validateTransaction)
            .map(generateFee)
            .value();
    };
}