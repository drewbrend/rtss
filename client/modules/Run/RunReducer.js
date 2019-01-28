import { ADD_RUN, ADD_RUNS, DELETE_RUN } from './RunActions';

// Initial State
const initialState = { data: [] };

const RunReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_RUN :
      return {
        data: [action.run, ...state.data],
      };

    case ADD_RUNS :
      return {
        data: action.runs,
      };

    case DELETE_RUN :
      return {
        data: state.data.filter(run => run._id !== action.id),
      };

    default:
      return state;
  }
};

/* Selectors */

// Get all runs
export const getRuns = state => state.runs.data;

// Get run by id
export const getRun = (state, id) => state.runs.data.filter(run => run.id === id)[0];

// Export Reducer
export default RunReducer;
