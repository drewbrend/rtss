import React from 'react';
import PropTypes from 'prop-types';

// Import Components
import TestListItem from './TestListItem/TestListItem';

function TestList(props) {
  if (!props.tests) {
    return (
      <div className="emptyTestList">
        <p>There are currently no tests in the DB.</p>
      </div>);
  // eslint-disable-next-line no-else-return
  } else {
    return (
      <div className="listView">
        {
          props.tests.map(test => (
            <TestListItem
              test={test}
              key={test.id}
              onDelete={() => props.handleDeleteTest(test.id)}
            />
          ))
        }
      </div>
    );
  }
}

TestList.propTypes = {
  tests: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isStable: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.instanceOf(Date).isRequired,
  })).isRequired,
  handleDeleteTest: PropTypes.func.isRequired,
};

export default TestList;
