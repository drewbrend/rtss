import React from 'react';
import PropTypes from 'prop-types';

// Import Components
import RunListItem from './RunListItem/RunListItem';

function RunList(props) {
  if (!props.runs) {
    return (
      <div className="emptyRunList">
        <p>There are currently no runs in the DB.</p>
      </div>);
  // eslint-disable-next-line no-else-return
  } else {
    return (
      <div className="listView">
        {
          props.runs.map(run => (
            <RunListItem
              run={run}
              key={run._id}
              onDelete={() => props.handleDeleteRun(run._id)}
            />
          ))
        }
      </div>
    );
  }
}

RunList.propTypes = {
  runs: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired, // TODO: This is not of type string. Arry of objectIds?
    framework: PropTypes.string.isRequired,
    job: PropTypes.string.isRequired,
    runDate: PropTypes.string.isRequired,
  })).isRequired,
  handleDeleteRun: PropTypes.func.isRequired,
};

export default RunList;
