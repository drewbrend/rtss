import TestResult from '../models/testResult';
import sanitizeHtml from 'sanitize-html';
const ObjectID = require('mongodb').ObjectID;

function getOrCreateTest(testName) {
  // TODO: should POST /api/tests handle this?
  return fetch('/api/tests', { body: `name=${testName}` })
  .then(getRes => getRes.json())
  .then(getJson => {
    if (getJson.tests.length > 0) {
      // we have the test
      return getJson.tests[0]._id;
    }

    return fetch('/api/tests', { method: 'POST', body: {
      name: testName,
      type: '',
      isStable: true,
      lastUpdate: Date.now, // TODO: get this from the suite
    } })
    .then(postRes => postRes.json())
    .then(json => {
      return json.test._id;
    });
  });
}

/**
 * Get all results
 * @param req
 * @param res
 * @returns void
 */
export function getAllResults(req, res) {
  TestResult.find().exec((err, results) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ results });
  });
}

/**
 * Get results
 * @param req
 * @param res
 * @returns void
 */
export function getResults(req, res) {
  TestResult.find(req.body).exec((err, results) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ results });
  });
}

/**
 * Get a single result
 * @param req
 * @param res
 * @returns void
 */
export function getResult(req, res) {
  TestResult.findOne(new ObjectID(req.params.id)).exec((err, result) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ result });
  });
}

/**
 * Save a result
 * @param req
 * @param res
 * @returns void
 */
export function addResult(req, res) {
  if (!req.body.post.name || !req.body.post.title || !req.body.post.content) {
    res.status(403).end();
  }

  const newResult = new TestResult({
    test: getOrCreateTest(req.body.result.testName),
    result: req.body.result.result,
    duration: req.body.result.duration * 1000, // seconds -> milliseconds
  });

  newResult.result = sanitizeHtml(newResult.result);

  newResult.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ result: saved });
  });
}

/**
 * Delete a result
 * @param req
 * @param res
 * @returns void
 */
export function deleteResult(req, res) {
  TestResult.findOne(new ObjectID(req.params.id)).exec((err, result) => {
    if (err) {
      res.status(500).send(err);
    }

    if (result) {
      result.remove(() => {
        res.status(200).end();
      });
    } else {
      res.status(404).end();
    }
  });
}
