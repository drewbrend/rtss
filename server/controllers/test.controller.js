import Test from '../models/test';
const testHelper = require('./helpers/testHelper');
const ObjectID = require('mongodb').ObjectID;

/**
 * Get all tests
 * @param req
 * @param res
 * @returns void
 */
export function getAllTests(req, res) {
  testHelper.getTests({}, (err, tests) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ tests });
  });
}

// TODO: Check if you can pass empty body to this to get all tests
// If so, delete getAllTests()
/**
 * Get tests
 * @param req
 * @param res
 * @returns void
 */
export function getTests(req, res) {
  testHelper.getTests(req.body, (err, tests) => {
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
 * Save a test
 * @param req
 * @param res
 * @returns void
 */
export function addTest(req, res) {
  if (!req.body.test.name || !req.body.test.type || !req.body.test.isStable) {
    res.status(403).end();
  }

  testHelper.addTest(res.body.test, (err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ post: saved });
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
