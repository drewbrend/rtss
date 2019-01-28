import callApi from '../../util/apiCaller';

// Export Constants
export const ADD_RUN = 'ADD_RUN';
export const ADD_RUNS = 'ADD_RUNS';
export const DELETE_RUN = 'DELETE_RUN';

// Export Actions
export function addRun(run) {
  return {
    type: ADD_RUN,
    run,
  };
}

export function addRuns(runs) {
  return {
    type: ADD_RUNS,
    runs,
  };
}

export function fetchRuns() {
  return (dispatch) => {
    return callApi('runs/').then(res => {
      dispatch(addRuns(res.runs));
    });
  };
}

export function fetchRun(id) {
  return (dispatch) => {
    return callApi(`runs/${id}`).then(res => dispatch(addRun(res.run)));
  };
}

export function deleteRun(id) {
  return {
    type: DELETE_RUN,
    id,
  };
}

export function deleteRunRequest(id) {
  return (dispatch) => {
    return callApi(`runs/${id}`, 'delete').then(() => dispatch(deleteRun(id)));
  };
}
