import sanitizeHtml from 'sanitize-html';
import Test from '../../models/test';

exports.getTests = (body) => {
  return new Promise((resolve, reject) => {
    Test.find(body).sort('-lastUpdated').exec((err, tests) => {
      if (err) {
        reject(err);
      } else {
        resolve(tests);
      }
    });
  });
};

exports.addTest = (test) => {
  return new Promise((resolve, reject) => {
    exports.getTests({ name: test.name }).then(tests => {
      if (tests.length > 0) {
        // we have the test, take the first one in the event of duplicates
        resolve(tests[0]);
      }

      // We don't have an existing test, create it
      const newTest = new Test(test);

      // Let's sanitize inputs
      newTest.name = sanitizeHtml(newTest.name);
      newTest.type = sanitizeHtml(newTest.type);
      newTest.isStable = sanitizeHtml(newTest.isStable);

      newTest.save((err, saved) => {
        if (err) {
          reject(err);
        } else {
          resolve(saved);
        }
      });
    }).catch(err => {
      reject(err);
    });
  });
};
