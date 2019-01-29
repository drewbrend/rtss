import callApi from '../../util/apiCaller';

// Export Constants
export const ADD_TEST = 'ADD_TEST';
export const ADD_TESTS = 'ADD_TESTS';
export const DELETE_TEST = 'DELETE_TEST';

// Export Actions
export function addTest(test) {
  return {
    type: ADD_TEST,
    test,
  };
}

export function addTestRequest(test) {
  return (dispatch) => {
    return callApi('tests', 'post', {
      test: {
        name: test.name,
        type: test.type,
        isStable: test.isStable,
      },
    }).then(res => dispatch(addTest(res.test)));
  };
}

export function addTests(tests) {
  return {
    type: ADD_TESTS,
    tests,
  };
}

export function fetchTests() {
  return (dispatch) => {
    return callApi('tests/').then(res => {
      dispatch(addTests(res.tests));
    });
  };
}

export function fetchTest(id) {
  return (dispatch) => {
    return callApi(`tests/${id}`).then(res => dispatch(addTest(res.test)));
  };
}

export function deleteTest(id) {
  return {
    type: DELETE_TEST,
    id,
  };
}

export function deleteTestRequest(id) {
  return (dispatch) => {
    return callApi(`tests/${id}`, 'delete').then(() => dispatch(deleteTest(id)));
  };
}
