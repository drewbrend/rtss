import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import Components
import TestList from '../../components/TestList';
import TestCreateWidget from '../../components/TestCreateWidget/TestCreateWidget';

// Import Actions
import { addTestRequest, fetchTests, deleteTestRequest } from '../../TestActions';
import { toggleAddTest } from '../../../App/AppActions';

// Import Selectors
import { getShowAddTest } from '../../../App/AppReducer';
import { getTests } from '../../TestReducer';

class TestListPage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchTests());
  }

  handleDeleteTest = test => {
    if (confirm('Do you want to delete this test')) { // eslint-disable-line
      this.props.dispatch(deleteTestRequest(test));
    }
  };

  handleAddTest = (name, type, isStable) => {
    this.props.dispatch(toggleAddTest());
    this.props.dispatch(addTestRequest({ name, type, isStable }));
  };

  render() {
    return (
      <div>
        <TestCreateWidget addTest={this.handleAddTest} showAddTest={this.props.showAddTest} />
        <TestList handleDeleteTest={this.handleDeleteTest} tests={this.props.tests} />
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
TestListPage.need = [() => { return fetchTests(); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    showAddTest: getShowAddTest(state),
    tests: getTests(state),
  };
}

TestListPage.propTypes = {
  tests: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isStable: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.instanceOf(Date),
  })).isRequired,
  showAddTest: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

TestListPage.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(TestListPage);
