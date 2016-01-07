const { expect } = require('chai');
const constants = require('../src/constants');

describe('constants', function () {
  describe('experienceToLevel', function () {
    function test(experience) {
      return function () {
        return constants.experienceToLevel(experience);
      };
    }

    it('should fail for negative experiences', function () {
      expect(test(-1)).to.throw();
      expect(test(-.000000001)).to.throw();
    });

    it('should fail for non-numbers', function () {
      expect(test(NaN)).to.throw();
      expect(test('asdf')).to.throw();
    });

    it('should work for non-negative numbers', function () {
      expect(test(1)).to.not.throw();
      expect(test(0)).to.not.throw();
    });

    it('should work for non-negative number strings', function () {
      expect(test('1000000')).to.not.throw();
    });

    // sanity check
    it(`should stay between ${constants.minimumLevel} and ${constants.maximumLevel}`, function () {
      expect(constants.experienceToLevel(0)).to.equal(constants.minimumLevel);
      expect(constants.experienceToLevel(Infinity)).to.equal(constants.maximumLevel);
    });
  });

  describe('levelToExperience', function () {
    function test(level) {
      return function () {
        return constants.levelToExperience(level);
      };
    }

    it('should fail for negative levels', function () {
      expect(test(-1)).to.throw();
      expect(test(-.000000001)).to.throw();
    });

    it('should fail for non-numbers', function () {
      expect(test(NaN)).to.throw();
      expect(test('asdf')).to.throw();
    });

    it(`should fail for numbers larger than ${constants.maximumLevel}`, function () {
      expect(test(constants.maximumLevel + 1)).to.throw();
      expect(test(Infinity)).to.throw();
    });

    it(`should work for numbers between ${constants.minimumLevel} and ${constants.maximumLevel}`, function () {
      expect(test(constants.minimumLevel)).to.not.throw();
      expect(test(constants.maximumLevel)).to.not.throw();
      expect(test(Math.floor(
        (constants.maximumLevel + constants.minimumLevel) / 2
      ))).to.not.throw();
    });

    // sanity check
    it('should require no experience for the minimum level', function () {
      expect(constants.levelToExperience(constants.minimumLevel)).to.equal(0);
    });
  });
});
