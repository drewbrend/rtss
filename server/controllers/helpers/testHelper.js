import sanitizeHtml from 'sanitize-html';
import Test from '../../models/test';

exports.getTests = (body, callback) => {
  Test.find(body).sort('-lastUpdated').exec((err, tests) => callback(err, tests));
};

exports.addTest = (test, callback) => {
  exports.getTests({ body: `name=${test.name}` }, (getErr, tests) => {
    if (getErr) {
      callback(getErr, null);
      return;
    }

    if (tests.length > 0) {
      // we have the test, take the first one in the event of duplicates
      callback(null, tests[0]);
      return;
    }

    // We don't have an existing test, create it
    const newTest = new Test(test);

    // Let's sanitize inputs
    newTest.name = sanitizeHtml(newTest.name);
    newTest.type = sanitizeHtml(newTest.type);
    newTest.isStable = sanitizeHtml(newTest.isStable);

    newTest.save((err, saved) => callback(err, saved));
  });
};
