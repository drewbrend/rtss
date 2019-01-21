import { ADD_TEST, ADD_TESTS, DELETE_TEST } from './TestActions';

// Initial State
const initialState = { data: [] };

const TestReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TEST :
      return {
        data: [action.test, ...state.data],
      };

    case ADD_TESTS :
      return {
        data: action.tests,
      };

    case DELETE_TEST :
      return {
        data: state.data.filter(test => test.id !== action.id),
      };

    default:
      return state;
  }
};

/* Selectors */

// Get all tests
export const getTests = state => state.tests.data;

// Get test by id
export const getTest = (state, id) => state.tests.data.filter(test => test.id === id)[0];

// Export Reducer
export default TestReducer;
