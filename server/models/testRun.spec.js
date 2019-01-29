import test from 'ava';
import request from 'supertest';
import app from '../server';
import TestRun from './testRun';
import { connectDB, dropDB } from '../util/test-helpers';
import bodyParser from 'body-parser';
const ObjectID = require('mongodb').ObjectID;
app.use(bodyParser.json());

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

// Initial runs added into test db
const runs = [
  new TestRun({ results: [new ObjectID('5c47596300b31be606a974af'), new ObjectID('5c47596300b31be606a974ba')], framework: 'some-test-type', job: 'some-jenkins-job', runDate: Date.now() }),
  new TestRun({ results: ['5c47596300b31be606a974bd', '5c47596300b31be606a974bc'], framework: 'other-test-type', job: 'other-jenkins-job', runDate: yesterday }),
];

test.before('connect to mockgoose', async () => {
  await connectDB();
});

test.beforeEach('connect and add two run entries', async () => {
  await TestRun.create(runs).catch(() => 'Unable to create runs');
});

test.afterEach.always(async () => {
  await dropDB();
});

test.serial('Should correctly give number of test runs', async t => {
  t.plan(2);

  const res = await request(app)
    .get('/api/runs')
    .set('Accept', 'application/json');

  t.is(res.status, 200);
  t.deepEqual(runs.length, res.body.runs.length);
});

test.serial('Should send correct data when queried against an ID', async t => {
  t.plan(6);

  const now = Date.now();
  const dateNow = new Date(0);
  dateNow.setUTCSeconds(now / 1000);

  const run = new TestRun({ results: ['7c47596300b31be606a974af', '8c47596300b31be606a974ba'], framework: 'finding-framework', job: 'finding-jenkins-job', runDate: dateNow.valueOf() });
  const saved = await run.save();

  const res = await request(app)
    .get(`/api/runs/${saved._id}`)
    .set('Accept', 'application/json');

  t.is(res.status, 200);
  t.is(res.body.run.results[0], String(run.results[0]));
  t.is(res.body.run.results[1], String(run.results[1]));
  t.is(res.body.run.framework, run.framework);
  t.is(res.body.run.job, run.job);
  t.is(res.body.run.runDate, dateNow.toISOString());
});

// TODO: Test the POST /api/runs endpoint when the parsing logic is complete

test.serial('Should correctly delete a test run', async t => {
  t.plan(2);

  const run = new TestRun({ results: [], framework: 'deleting-framework', job: 'deleting-jenkins-job', runDate: Date.now() });
  run.save();

  const res = await request(app)
    .delete(`/api/runs/${run._id}`)
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const queriedResult = await TestRun.findOne({ _id: run._id }).exec();
  t.is(queriedResult, null);
});
