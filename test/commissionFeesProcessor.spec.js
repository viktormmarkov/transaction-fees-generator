const CommissionFeesProcessor = require('../commisionFeesProcessor');
const expect = require('expect.js')

describe('commisionFeesProcessor', () => {
    const cashInConfig = {
        "percents": 0.03,
        "max": {
            "amount": 5,
            "currency": "EUR"
        }
    };
    describe('generateFee', () => {
        let commisionFeesProcessor;
        beforeEach(() => {
            commisionFeesProcessor = new CommissionFeesProcessor({
                cashIn: cashInConfig
            });
        });
        it('should return 5$ for cash in, natural user for 200$ amount', () => {
            const fee = commisionFeesProcessor.generateFee({
                "user_type": "natural",
                "type": "cash_in",
                "operation": {
                    "amount": 200.00,
                    "currency": "EUR"
                }
            });

            expect(fee).to.be(5);
        });
    })
});