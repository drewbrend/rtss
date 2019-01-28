import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import Components
import RunList from '../../components/RunList';

// Import Actions
import { fetchRuns, deleteRunRequest } from '../../../Run/RunActions';

// Import Selectors
import { getRuns } from '../../../Run/RunReducer';

class RunListPage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchRuns());
  }

  handleDeleteTest = run => {
    if (confirm('Do you want to delete this test run?')) { // eslint-disable-line
      this.props.dispatch(deleteRunRequest(run));
    }
  };

  render() {
    return (
      <div>
        <RunList handleDeleteRun={this.handleDeleteRun} runs={this.props.runs} />
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
RunListPage.need = [() => { return fetchRuns(); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    runs: getRuns(state),
  };
}

RunListPage.propTypes = {
  runs: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired, // TODO: This is not of type string. Arry of objectIds?
    framework: PropTypes.string.isRequired,
    job: PropTypes.string.isRequired,
    runDate: PropTypes.string.isRequired,
  })).isRequired,
  dispatch: PropTypes.func.isRequired,
};

RunListPage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(RunListPage);
