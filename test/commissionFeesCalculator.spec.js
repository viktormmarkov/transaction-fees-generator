/* eslint-disable no-undef */
const expect = require('expect.js');
const CommissionFeesCalculator = require('../commissionFeesCalculator');

describe('commisionFeesCalculator', () => {
  const cashIn = {
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
  const cashOutNatural = {
    percents: 0.3,
    week_limit: {
      amount: 1000,
      currency: 'EUR',
    }
  };
  const cashInTransaction = {
    user_type: 'natural',
    type: 'cash_in',
    date: '2016-01-02',
    operation: {
      amount: 200.00,
      currency: 'EUR',
    },
  };
  const cashOutTransaction = {
    user_type: 'juridical',
    type: 'cash_out',
    date: '2016-01-04',
    operation: {
      amount: 300.00,
      currency: 'EUR',
    },
  }
  const cashOutNaturalTransaction = {
    user_type: 'natural',
    type: 'cash_out',
    date: '2016-01-04',
    user_id: 1,
    operation: {
      amount: 30000.00,
      currency: 'EUR',
    },
  }
  describe('generateFee', () => {
    let commisionFeesProcessor;
    beforeEach(() => {
      commisionFeesProcessor = new CommissionFeesCalculator({
        cashIn,
        cashOutJuridical,
        cashOutNatural
      });
    });
    it('should return 0.06$ for cash in, natural user for 200$ amount', () => {
      const fee = commisionFeesProcessor.generateFee(cashInTransaction);

      expect(fee)
        .to.be(0.06);
    });

    it('should return 0.90$ for cash out, juridical user for 300$ amount', () => {
      const fee = commisionFeesProcessor.generateFee(cashOutTransaction);

      expect(fee)
        .to.be(0.90);
    });

    it('should return 87$ for cash out, natural for 30000$ amount', () => {
      const fee = commisionFeesProcessor.generateFee(cashOutNaturalTransaction);

      expect(fee)
        .to.be(87);
    })
  });

  describe('generateCommissionFees', () => {
    let commisionFeesProcessor;
    beforeEach(() => {
      commisionFeesProcessor = new CommissionFeesCalculator({
        cashIn,
        cashOutJuridical,
      });
    });
    it('should sort the transactions by date', () => {
      const transactionsFees = commisionFeesProcessor.generateCommissionFees([cashOutTransaction, cashInTransaction,]);
      const [firstFee, secondFee] = transactionsFees;
      expect(transactionsFees.length)
        .to.be(2);
      expect(firstFee)
        .to.be(0.06)
      expect(secondFee)
        .to.be(0.9)
    });
    it('should sort the transactions by date', () => {
      const transactionsFees = commisionFeesProcessor.generateCommissionFees([cashOutTransaction, cashInTransaction, cashOutTransaction, ]);
      const [firstFee, secondFee, thirdFee] = transactionsFees;
      expect(transactionsFees.length)
        .to.be(3);
      expect(firstFee)
        .to.be(0.06)
      expect(secondFee)
        .to.be(0.9)
      expect(thirdFee)
        .to.be(0.9)
    });
  });
});
