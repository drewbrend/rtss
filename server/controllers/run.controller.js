import TestRun from '../models/testRun';
import sanitizeHtml from 'sanitize-html';
const resultHelper = require('./helpers/resultHelper');
const parser = require('xml2json');
const ObjectID = require('mongodb').ObjectID;
const flattenDeep = require('lodash.flattendeep');

function handleTestCase(testcase, runId) {
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
      run: runId,
    }).then(result => {
      resolve(result._id);
    }).catch(err => {
      reject(err);
    });
  });
}

function handleResultJson(resultJson, runId) {
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
          promises.push(handleTestCase(testcase, runId));
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

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    const fileBuffer = req.files[fileName].data;
    const json = parser.toJson(fileBuffer);

    // TODO: .type might be on a child property once it's set up
    const testType = json.type ? json.type : 'Unknown';

    const newRun = new TestRun({
      results: [],
      type: testType,
      job: 'TODO: add job info and duration',
      runDate: Date.now(), // TODO: Get this from report
    });

    newRun.type = sanitizeHtml(newRun.type);
    newRun.job = sanitizeHtml(newRun.job);

    newRun.save((runErr, saved) => {
      if (runErr) {
        res.status(500).send(runErr);
      }

      const runId = saved._id;

      handleResultJson(JSON.parse(json), runId).then(ids => {
        const flatIds = flattenDeep(ids);

        TestRun.findOneAndUpdate({ _id: runId }, { results: flatIds }, { new: true }, (updateErr, updatedRun) => {
          if (updateErr) {
            res.status(500).send(updateErr);
          }

          res.json({ result: updatedRun });
        }).catch(resultErr => {
          res.status(500).send(resultErr);
        });
      });
    });
  }
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
