import test from 'ava';
import request from 'supertest';
import app from '../server';
import TestResult from './testResult';
import { connectDB, dropDB } from '../util/test-helpers';
import bodyParser from 'body-parser';
app.use(bodyParser.json());

// Initial results added into test db
const results = [
  new TestResult({ testName: 'Passing Test', result: 'success', duration: 456, isStable: true }),
  new TestResult({ testName: 'Failing Test', result: 'failure', message: 'something broke', duration: 123, isStable: false }),
];

test.before('connect to mockgoose', async () => {
  await connectDB();
});

test.beforeEach('connect and add two result entries', async () => {
  await TestResult.create(results).catch(() => 'Unable to create results');
});

test.afterEach.always(async () => {
  await dropDB();
});

// From here
test.serial('Should correctly give number of test results', async t => {
  t.plan(2);

  const res = await request(app)
    .get('/api/results')
    .set('Accept', 'application/json');

  t.is(res.status, 200);
  t.deepEqual(results.length, res.body.results.length);
});

test.serial('Should send correct data when queried against an ID', async t => {
  t.plan(6);

  const result = new TestResult({ testName: 'Find me', result: 'failure', message: 'she broke', duration: 456, isStable: true });
  const saved = await result.save();

  const res = await request(app)
    .get(`/api/results/${saved._id}`)
    .set('Accept', 'application/json');

  t.is(res.status, 200);
  t.is(res.body.result.testName, result.testName);
  t.is(res.body.result.result, result.result);
  t.is(res.body.result.message, result.message);
  t.is(res.body.result.duration, result.duration);
  t.is(res.body.result.isStable, result.isStable);
});

test.serial('Should correctly add a test result', async t => {
  t.plan(6);

  const res = await request(app)
    .post('/api/results')
    .send({ result: { testName: 'POST me', result: 'failure', message: 'she broke', duration: 456, isStable: false } })
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const savedResult = await TestResult.findOne({ testName: 'POST me' }).exec();
  t.is(savedResult.testName, 'POST me');
  t.is(savedResult.result, 'failure');
  t.is(savedResult.message, 'she broke');
  t.is(savedResult.duration, 456);
  t.is(savedResult.isStable, false);
});

test.serial('Should correctly delete a test result', async t => {
  t.plan(2);

  const result = new TestResult({ testName: 'Delete me', result: 'failure', message: 'she broke', duration: 456, isStable: true });
  result.save();

  const res = await request(app)
    .delete(`/api/results/${result._id}`)
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const queriedResult = await TestResult.findOne({ _id: result._id }).exec();
  t.is(queriedResult, null);
});
