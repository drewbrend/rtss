import TestRun from './models/testRun';
const resultHelper = require('./controllers/helpers/resultHelper');
const faker = require('faker/locale/en');
const sample = require('lodash.sample');

// Define dataset restrictions
const frameworks = ['Cypress', 'Mamba', 'Jest'];
const results = ['success', 'failure'];

// Define constants for data volume
const numRuns = 10;
const numTests = 20;

function seedError(err) {
  console.log(`Error seeding database: ${err}`);// eslint-disable-line no-console
}

function randomFramework() {
  return sample(frameworks);
}

function generateTestNamePool() {
  const testNames = [];
  for (let i = 0; i < numTests; i++) {
    testNames.push(faker.random.words(2));
  }
  return testNames;
}

function makeRun() {
  return new Promise((resolve, reject) => {
    const run = new TestRun({
      results: [],
      framework: randomFramework(),
      job: `jenkins-job-${Math.floor(Math.random() * 5) + 1}`,
      runDate: faker.date.past(),
    });

    run.save((runErr, saved) => {
      if (runErr) {
        reject(runErr);
      }
      resolve(saved._id);
    });
  });
}

function makeResult(testName, runId) {
  const promise = resultHelper.addResult({
    testName,
    result: sample(results),
    duration: faker.random.number({ min: 0, max: 10000, precision: 1 }),
    run: runId,
  });
  return promise;
}

function makeEntries() {
  const testNamePool = generateTestNamePool();
  for (let x = 0; x < numRuns; x++) {
    const testResults = [];
    makeRun().then((runId) => {
      const availableTestNames = testNamePool.slice(); // slice creates a copy of the array
      for (let y = 0; y < numTests; y++) {
        const testName = availableTestNames.pop();
        const result = makeResult(testName, runId);
        if (result) {
          testResults.push(result);
        }
      }

      Promise.all(testResults).then(resultsIds => {
        TestRun.updateOne({ _id: runId }, { results: resultsIds.map(r => r._id) }, updateErr => {
          if (updateErr) {
            seedError(updateErr);
          }
        });
      }).catch(errs => {
        seedError(errs);
        return;
      });
    }).catch(err => {
      seedError(err);
      return;
    });
  }
}

export default function () {
  TestRun.count().exec((countErr, count) => {
    if (countErr) {
      seedError(countErr);
      return;
    }

    if (count === 0) {
      makeEntries();
    }
  });
}
