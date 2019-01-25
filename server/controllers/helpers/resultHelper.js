import sanitizeHtml from 'sanitize-html';
import TestResult from '../../models/testResult';

exports.addResult = (result) => {
  const testFramework = result.framework ? result.framework : 'Unknown';


  return new Promise((resolve, reject) => {
    const newResult = new TestResult({
      testName: result.testName,
      framework: testFramework,
      result: result.result,
      message: result.message,
      duration: result.duration * 1000, // seconds -> milliseconds
      isStable: true, // TODO: calculate this based on past results
      run: result.run,
    });

    newResult.testName = sanitizeHtml(newResult.testName);
    newResult.framework = sanitizeHtml(newResult.framework);
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
