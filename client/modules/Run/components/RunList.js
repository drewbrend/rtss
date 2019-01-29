import React from 'react';
import PropTypes from 'prop-types';

// Import Components
import RunListItem from './RunListItem/RunListItem';

function RunList(props) {
  return (
    props.runs &&
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

RunList.propTypes = {
  runs: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired, // TODO: This is an array of references. Need to get the real data somewhere.
    framework: PropTypes.string.isRequired,
    job: PropTypes.string.isRequired,
    runDate: PropTypes.string.isRequired,
  })).isRequired,
  handleDeleteRun: PropTypes.func.isRequired,
};

export default RunList;
