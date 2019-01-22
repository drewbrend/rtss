import sanitizeHtml from 'sanitize-html';
import TestResult from '../../models/testResult';
const testHelper = require('./testHelper');

exports.addResult = (result) => {
  const test = {
    name: result.testName,
    // TODO: get type from result
    type: 'Cypress',
    isStable: true, // We'll assume a new test is stable
    lastUpdated: Date.now(),
  };

  return new Promise((resolve, reject) => {
    // addTest will return an existing tests, if there is one
    testHelper.addTest(test).then(savedTest => {
      console.log(`returned test ${JSON.stringify(savedTest.name)} from addTest`);

      const newResult = new TestResult({
        test: savedTest._id,
        result: result.result,
        duration: result.duration * 1000, // seconds -> milliseconds
      });

      newResult.result = sanitizeHtml(newResult.result);

      newResult.save((err, saved) => {
        if (err) {
          reject(err);
        } else {
          resolve(saved);
        }
      });
    })
    .catch(err => {
      reject(err);
    });
  });
};
