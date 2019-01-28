import test from 'ava';
import { reducerTest } from 'redux-ava';
import runReducer, { getRun, getRuns } from '../RunReducer';
import { addRun, deleteRun, addRuns } from '../RunActions';

test('action for ADD_RUN is working', reducerTest(
  runReducer,
  { data: ['foo'] },
  addRun({
    _id: 'id1',
    results: ['result-set-1'],
    framework: 'Cypress',
    job: 'some-jenkins-job',
    runDate: '2019-01-28 16:10:56.346Z',
  }),
  { data: [{
    _id: 'id1',
    results: ['result-set-1'],
    framework: 'Cypress',
    job: 'some-jenkins-job',
    runDate: '2019-01-28 16:10:56.346Z',
  }, 'foo'] },
));

test('action for DELETE_RUN is working', reducerTest(
  runReducer,
  { data: [{
    _id: 'id1',
    results: ['result-set-1'],
    framework: 'Cypress',
    job: 'some-jenkins-job',
    runDate: '2019-01-28 16:10:56.346Z',
  }] },
  deleteRun('id1'),
  { data: [] },
));

test('action for ADD_RUNS is working', reducerTest(
  runReducer,
  { data: [] },
  addRuns([
    {
      _id: 'id1',
      results: ['result-set-1'],
      framework: 'Cypress',
      job: 'some-jenkins-job',
      runDate: '2019-01-28 16:10:56.346Z',
    },
  ]),
  { data: [{
    _id: 'id1',
    results: ['result-set-1'],
    framework: 'Cypress',
    job: 'some-jenkins-job',
    runDate: '2019-01-28 16:10:56.346Z',
  }] },
));

test('getRuns selector', t => {
  t.deepEqual(
    getRuns({
      runs: { data: ['foo'] },
    }),
    ['foo']
  );
});

test('getRun selector', t => {
  t.deepEqual(
    getRun({
      runs: { data: [{ _id: 'id1' }] },
    }, 'id1'),
    { _id: 'id1' }
  );
});
