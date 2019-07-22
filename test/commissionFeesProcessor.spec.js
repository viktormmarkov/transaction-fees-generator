/* eslint-disable no-undef */
const expect = require('expect.js');
const CommissionFeesProcessor = require('../commisionFeesProcessor');

describe('commisionFeesProcessor', () => {
  const cashInConfig = {
    percents: 0.03,
    max: {
      amount: 5,
      currency: 'EUR',
    },
  };
  const cashOutJuridical = {
    percents: 0.3,
    min: {
      amount: 0.5,
      currency: 'EUR',
    },
  };
  describe('generateFee', () => {
    let commisionFeesProcessor;
    beforeEach(() => {
      commisionFeesProcessor = new CommissionFeesProcessor({
        cashIn: cashInConfig,
        cashOutJuridical,
      });
    });
    it('should return 0.06$ for cash in, natural user for 200$ amount', () => {
      const fee = commisionFeesProcessor.generateFee({
        user_type: 'natural',
        type: 'cash_in',
        operation: {
          amount: 200.00,
          currency: 'EUR',
        },
      });

      expect(fee)
        .to.be(0.06);
    });

    it('should return 0.90$ for cash out, juridical user for 300$ amount', () => {
      const fee = commisionFeesProcessor.generateFee({
        user_type: 'juridical',
        type: 'cash_out',
        operation: {
          amount: 300.00,
          currency: 'EUR',
        },
      });

      expect(fee)
        .to.be(0.90);
    });
  });
});
