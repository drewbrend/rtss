import test from 'ava';
import { reducerTest } from 'redux-ava';
import appReducer, { getShowAddTest } from '../AppReducer';
import { toggleAddTest } from '../AppActions';

test('action for TOGGLE_ADD_TEST is working', reducerTest(
  appReducer,
  { showAddTest: false },
  toggleAddTest(),
  { showAddTest: true },
));

test('getShowAddTest selector', t => {
  t.is(getShowAddTest({
    app: { showAddTest: false },
  }), false);
});
