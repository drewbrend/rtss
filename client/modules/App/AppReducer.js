// Import Actions
import { TOGGLE_ADD_TEST } from './AppActions';

// Initial State
const initialState = {
  showAddTest: false,
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_ADD_TEST:
      return {
        showAddTest: !state.showAddTest,
      };

    default:
      return state;
  }
};

/* Selectors */

// Get showAddPost
export const getShowAddTest = state => state.app.showAddTest;

// Export Reducer
export default AppReducer;
