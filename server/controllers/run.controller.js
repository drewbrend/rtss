import TestRun from '../models/testRun';
import sanitizeHtml from 'sanitize-html';
const resultHelper = require('./helpers/resultHelper');
const parser = require('xml2json');
const ObjectID = require('mongodb').ObjectID;

function handleResultJson(resultJson) {
  console.log(resultJson);

  let suites = resultJson.testsuites;
  if (!Array.isArray(resultJson.testsuites)) {
    suites = [resultJson.testsuites];
  }

  const ids = [];
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
        let testResult;
        // TODO: skipped test?
        if (testcase.failure) {
          testResult = 'failure';
        } else {
          testResult = 'success';
        }

        // TODO: failure message should be sent somehow

        resultHelper.addResult({
          testName: testcase.name,
          result: testResult,
          duration: testcase.time * 1000, // seconds -> milliseconds
        }, (err, saved) => {
          if (err) {
            // TODO: handle error better
            console.log(err);
          }

          if (saved) {
            ids.push(saved._id);
          }
        });
      });
    });
  });

  // TODO: this will probably not return all the ids because async
  return ids;
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
  let ids = [];

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    const fileBuffer = req.files[fileName].data;
    const json = parser.toJson(fileBuffer);

    const newIds = handleResultJson(JSON.parse(json));
    ids = ids.concat(newIds);
  }

  const newResult = new TestRun({
    results: ids,
    job: 'TODO: add job info and duration',
    runDate: 13.7656 * 1000, // seconds -> milliseconds
  });

  newResult.job = sanitizeHtml(newResult.job);

  newResult.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ run: saved });
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
