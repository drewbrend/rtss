import test from 'ava';
import { actionTest } from 'redux-ava';
import { TOGGLE_ADD_TEST, toggleAddTest } from '../AppActions';

test('should return the correct type for toggleAddTest', actionTest(toggleAddTest, null, { type: TOGGLE_ADD_TEST }));
