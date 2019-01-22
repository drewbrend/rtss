import TestResult from '../models/testResult';
const resultHelper = require('./helpers/resultHelper');
const ObjectID = require('mongodb').ObjectID;

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
  if (!req.body.result || !req.body.result.testName || !req.body.post.result || !req.body.post.duration) {
    res.status(400).end();
  }

  resultHelper.addResult(req.body.result).then(saved => {
    res.json({ result: saved });
  }).catch(err => {
    res.status(500).send(err);
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
