import TestResult from './models/testResult';
import TestRun from './models/testRun';

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

        const result1 = new TestResult({
          testName: 'Dummy Test 1',
          result: 'success',
          duration: 450,
          run: runId,
        });

        const result2 = new TestResult({
          testName: 'Dummy Test 2',
          result: 'failure',
          duration: 6300,
          run: runId,
        });

        TestResult.create([result1, result2], (resultErr, savedResults) => {
          if (resultErr) {
            seedError(resultErr);
            return;
          }

          const resultsIds = savedResults.map(r => r._id);

          TestRun.updateOne({ _id: runId }, { results: resultsIds }, updateErr => {
            if (updateErr) {
              seedError(updateErr);
            }

            return;
          });
        });
      });
    }
  });
}
