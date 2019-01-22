import TestRun from '../models/testRun';
import sanitizeHtml from 'sanitize-html';
const resultHelper = require('./helpers/resultHelper');
const parser = require('xml2json');
const ObjectID = require('mongodb').ObjectID;
const flattenDeep = require('lodash.flattendeep');

function handleTestCase(testcase) {
  let testResult;
  // TODO: skipped test?
  if (testcase.failure) {
    testResult = 'failure';
  } else {
    testResult = 'success';
  }

  // TODO: failure message should be sent somehow

  return new Promise((resolve, reject) => {
    resultHelper.addResult({
      testName: testcase.name,
      result: testResult,
      duration: testcase.time * 1000, // seconds -> milliseconds
    }).then(result => {
      resolve(result._id);
    }).catch(err => {
      reject(err);
    });
  });
}

function handleResultJson(resultJson) {
  console.log(resultJson);

  let suites = resultJson.testsuites;
  if (!Array.isArray(resultJson.testsuites)) {
    suites = [resultJson.testsuites];
  }

  return new Promise((resolve, reject) => {
    const promises = [];
    suites.forEach(testsuite => {
      testsuite.testsuite.forEach(suite => {
        if (!suite.testcase) {
          return;
        }

        let cases = suite.testcase;
        if (!Array.isArray(suite.testcase)) {
          cases = [suite.testcase];
        }

        cases.forEach(testcase => {
          promises.push(handleTestCase(testcase));
        });
      });
    });

    Promise.all(promises).then(ids => {
      resolve(ids);
    }).catch(errs => {
      reject(errs);
    });
  });
}

/**
 * Get all runs
 * @param req
 * @param res
 * @returns void
 */
export function getAllRuns(req, res) {
  TestRun.find().sort('-runDate').exec((err, runs) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ runs });
  });
}

/**
 * Get runs
 * @param req
 * @param res
 * @returns void
 */
export function getRuns(req, res) {
  TestRun.find(req.body).sort('-runDate').exec((err, runs) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ runs });
  });
}

/**
 * Get a single run
 * @param req
 * @param res
 * @returns void
 */
export function getRun(req, res) {
  TestRun.findOne(new ObjectID(req.params.id)).exec((err, run) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ run });
  });
}

/**
 * Save a post
 * @param req
 * @param res
 * @returns void
 */
export function addRun(req, res) {
  if (Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
  }

  const fileNames = Object.keys(req.files);
  const promises = [];

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    const fileBuffer = req.files[fileName].data;
    const json = parser.toJson(fileBuffer);

    promises.push(handleResultJson(JSON.parse(json)));
  }

  Promise.all(promises).then(ids => {
    const flatIds = flattenDeep(ids);
    console.log(`ids: ${flatIds}`);

    const newResult = new TestRun({
      results: flatIds,
      job: 'TODO: add job info and duration',
      runDate: Date.now(),
    });

    console.log('created newResult object');

    newResult.job = sanitizeHtml(newResult.job);

    console.log('sanitized newResult job');

    newResult.save((err, saved) => {
      console.log('newResult saved');

      if (err) {
        console.log(`newResult error, returning 500: ${err}`);
        res.status(500).send(err);
      }

      console.log(`newResult success, returning: ${JSON.stringify(saved)}`);
      res.json({ run: saved });
    });
  }).catch(errs => {
    res.status(500).send(errs);
  });
}

/**
 * Delete a run
 * @param req
 * @param res
 * @returns void
 */
export function deleteRun(req, res) {
  TestRun.findOne(new ObjectID(req.params.id)).exec((err, run) => {
    if (err) {
      res.status(500).send(err);
    }

    if (run) {
      run.remove(() => {
        res.status(200).end();
      });
    } else {
      res.status(404).end();
    }
  });
}
