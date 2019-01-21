import Test from '../models/test';
const ObjectID = require('mongodb').ObjectID;

/**
 * Get all tests
 * @param req
 * @param res
 * @returns void
 */
export function getAllTests(req, res) {
  Test.find().sort('-lastUpdated').exec((err, tests) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ tests });
  });
}

/**
 * Get tests
 * @param req
 * @param res
 * @returns void
 */
export function getTests(req, res) {
  Test.find(req.body).sort('-lastUpdated').exec((err, tests) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ tests });
  });
}

/**
 * Get a single test
 * @param req
 * @param res
 * @returns void
 */
export function getTest(req, res) {
  Test.findOne(new ObjectID(req.params.id)).exec((err, test) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ test });
  });
}

/**
 * Delete a test
 * @param req
 * @param res
 * @returns void
 */
export function deleteTest(req, res) {
  Test.findOne(new ObjectID(req.params.id)).exec((err, test) => {
    if (err) {
      res.status(500).send(err);
    }

    test.remove(() => {
      res.status(200).end();
    });
  });
}
