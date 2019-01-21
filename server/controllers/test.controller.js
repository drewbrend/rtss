import Test from '../models/test';
import sanitizeHtml from 'sanitize-html';
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
 * Save a test
 * @param req
 * @param res
 * @returns void
 */
export function addTest(req, res) {
  if (!req.body.test.name || !req.body.test.type || !req.body.test.isStable) {
    res.status(403).end();
  }

  const newTest = new Test(req.body.test);

  // Let's sanitize inputs
  newTest.name = sanitizeHtml(newTest.name);
  newTest.type = sanitizeHtml(newTest.type);
  newTest.isStable = sanitizeHtml(newTest.isStable);

  newTest.save((err, saved) => {
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
