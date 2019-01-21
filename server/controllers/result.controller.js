import TestResult from '../models/testResult';
const ObjectID = require('mongodb').ObjectID;

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
