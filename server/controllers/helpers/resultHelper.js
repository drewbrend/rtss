import sanitizeHtml from 'sanitize-html';
import TestResult from '../../models/testResult';

exports.addResult = (result) => {
  const testType = result.type ? result.type : 'Unknown';


  return new Promise((resolve, reject) => {
    const newResult = new TestResult({
      testName: result.testName,
      type: testType,
      result: result.result,
      duration: result.duration * 1000, // seconds -> milliseconds
      isStable: true, // TODO: calculate this based on past results
      run: result.run,
    });

    newResult.testName = sanitizeHtml(newResult.testName);
    newResult.type = sanitizeHtml(newResult.type);
    newResult.result = sanitizeHtml(newResult.result);

    newResult.save((err, saved) => {
      if (err) {
        reject(err);
      } else {
        resolve(saved);
      }
    });
  });
};
