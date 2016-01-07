const { expect } = require('chai');
const Die = require('../src/die');

describe('Die', function () {
  describe('without count or modifier', function () {
    function create(die) {
      return function () {
        return new Die(die);
      };
    }

    it('should fail for non-number dice sides', function () {
      expect(create(NaN)).to.throw();
      expect(create(undefined)).to.throw();
      expect(create('a')).to.throw();
    });

    it('should fail for invalid side counts', function () {
      expect(create(1)).to.throw();
      expect(create(11)).to.throw();
    });

    it('should work for valid side counts', function () {
      expect(create(4)).to.not.throw();
      expect(create(12)).to.not.throw();
      expect(create(20)).to.not.throw();
    });

    it('should create a die with the correct number of sides', function () {
      function test(number) {
        expect((new Die(number)).getDie()).to.equal(number);
      }

      test(4);
      test(10);
      test(100);
    });

    it('should create a die with a count of 1', function () {
      function test(die) {
        expect((new Die(die)).getCount()).to.equal(1);
      }

      test(4);
      test(12);
      test(20);
    });

    it('should create a die without modifier', function () {
      function test(die) {
        expect((new Die(die)).getModifier()).to.equal(0);
      }

      test(6);
      test(8);
      test(12);
    });
  });

  describe('with count and modifier', function () {
    function create(die, count, modifier) {
      return function () {
        return new Die(die, count, modifier);
      };
    }

    it('should fail for non-number arguments', function () {
      expect(create(NaN, NaN, NaN)).to.throw();
      expect(create(4, NaN, NaN)).to.throw();
      expect(create(4, 1, NaN)).to.throw();
      expect(create(4, 2, 'a')).to.throw();
      expect(create(4, 'a', 3)).to.throw();
    });

    it('should work for valid arguments', function () {
      expect(create(20, 1, 0)).to.not.throw();
      expect(create(12, 1, 0)).to.not.throw();
      expect(create(4, 1, 0)).to.not.throw();
      expect(create(6, 20, 5)).to.not.throw();
      expect(create(100, 2, -20)).to.not.throw();
    });

    it('should fail for invalid side counts', function () {
      expect(create(1, 1, 0)).to.throw();
      expect(create(11, 1, 0)).to.throw();
    });

    it('should fail for invalid die counts', function () {
      expect(create(12, 0, 0)).to.throw();
      expect(create(12, -1, 0)).to.throw();
      expect(create(12, 1.4, 0)).to.throw();
    });

    it('should fail for invalid modifiers', function () {
      expect(create(12, 1, 'a')).to.throw();
      expect(create(12, 1, 1.4)).to.throw();
    });
  });
});
