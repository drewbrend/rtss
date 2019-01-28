import test from 'ava';
import { actionTest } from 'redux-ava';
import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import { API_URL } from '../../../util/apiCaller';

import {
  ADD_RUN,
  DELETE_RUN,
  ADD_RUNS,
  addRun,
  deleteRun,
  addRuns,
  fetchRuns,
} from '../RunActions';

const run = { _id: 'id', results: ['result-set-1'], framework: 'Cypress', job: 'some-jenkins-job', runDate: '2019-01-28 16:10:56.346Z' };

test('should return the correct type for addRun', actionTest(
  addRun,
  run,
  { type: ADD_RUN, run },
));

test('should return the correct type for deleteRun', actionTest(
  deleteRun,
  run._id,
  { type: DELETE_RUN, id: run._id },
));

test('should return the correct type for addRuns', actionTest(
  addRuns,
  [run],
  { type: ADD_RUNS, runs: [run] },
));

test('fetchRuns action', t => {
  return new Promise(resolve => {
    const runs = [
      { _id: 'id1', results: ['result-set-1'], framework: 'Cypress', job: 'some-jenkins-job', runDate: '2019-01-28 16:10:56.346Z' },
      { _id: 'id2', results: ['result-set-2'], framework: 'Unknown', job: 'some-other-jenkins-job', runDate: '2019-01-28 17:10:56.346Z' },
    ];
    const runsResponse = {
      runs,
    };

    const mockStore = configureStore([thunkMiddleware]);
    const store = mockStore({ data: [] });
    const expectedActions = [{ type: ADD_RUNS, runs }];
    nock(API_URL)
      .get('/runs')
      .reply(200, runsResponse);
    store.dispatch(fetchRuns())
      .then(() => {
        t.deepEqual(store.getActions(), expectedActions);
        resolve();
      });
  });
});
