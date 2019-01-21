import TestRun from '../models/testRun';
const parser = require('xml2json');
const ObjectID = require('mongodb').ObjectID;

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
    return res.status(400).send('No files were uploaded.');
  }

  const fileNames = Object.keys(req.files);

  let response = {};

  response.message = "here's some data";
  response.numFiles = fileNames.length;

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    const fileBuffer = req.files[fileName].data;
    const json = parser.toJson(fileBuffer);

    response[fileName] = json;
  }

  return res.status(200).send(response);

  // if (!req.body.post.name || !req.body.post.title || !req.body.post.content) {
  //   res.status(403).end();
  // }

  // const newPost = new TestRun(req.body.post);

  // // Let's sanitize inputs
  // newPost.title = sanitizeHtml(newPost.title);
  // newPost.name = sanitizeHtml(newPost.name);
  // newPost.content = sanitizeHtml(newPost.content);

  // newPost.slug = slug(newPost.title.toLowerCase(), { lowercase: true });
  // newPost.cuid = cuid();
  // newPost.save((err, saved) => {
  //   if (err) {
  //     res.status(500).send(err);
  //   }
  //   res.json({ post: saved });
  // });
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
