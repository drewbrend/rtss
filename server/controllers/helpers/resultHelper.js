import sanitizeHtml from 'sanitize-html';
import TestResult from '../../models/testResult';
const testHelper = require('./testHelper');

exports.addResult = (result, callback) => {
  const test = {
    name: result.testName,
    // TODO: get type from result
    type: 'Cypress',
    isStable: true, // We'll assume a new test is stable
    lastUpdated: Date.now(),
  };

  // addTest will return an existing tests, if there is one
  testHelper.addTest(test, (testErr, savedTest) => {
    if (testErr) {
      // TODO: handle error better
      console.log(testErr);
    }

    const newResult = new TestResult({
      test: savedTest._id,
      result: result.result,
      duration: result.duration * 1000, // seconds -> milliseconds
    });

    newResult.result = sanitizeHtml(newResult.result);

    newResult.save((err, saved) => {
      callback(err, saved);
    });
  });
};
