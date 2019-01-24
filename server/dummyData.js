import TestRun from './models/testRun';
const resultHelper = require('./controllers/helpers/resultHelper');

function seedError(err) {
  console.log(`Error seeding database: ${err}`);// eslint-disable-line no-console
}

export default function () {
  TestRun.count().exec((countErr, count) => {
    if (countErr) {
      seedError(countErr);
      return;
    }

    if (count === 0) {
      const run1 = new TestRun({
        results: [],
        framework: 'Cypress',
        job: 'some-jenkins-job',
        runDate: Date.now(),
      });

      run1.save((runErr, saved) => {
        if (runErr) {
          seedError(runErr);
          return;
        }

        const runId = saved._id;

        const promise1 = resultHelper.addResult({
          testName: 'Dummy Test 1',
          result: 'success',
          duration: 450,
          run: runId,
        });

        const promise2 = resultHelper.addResult({
          testName: 'Dummy Test 2',
          result: 'failure',
          duration: 6300,
          run: runId,
        });

        Promise.all([promise1, promise2]).then(resultsIds => {
          TestRun.updateOne({ _id: runId }, { results: resultsIds }, updateErr => {
            if (updateErr) {
              seedError(updateErr);
            }
          });
        }).catch(errs => {
          seedError(errs);
          return;
        });
      });
    }
  });
}
