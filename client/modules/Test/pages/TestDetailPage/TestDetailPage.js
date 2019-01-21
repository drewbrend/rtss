import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// Import Style
import styles from '../../components/TestListItem/TestListItem.css';

// Import Actions
import { fetchTest } from '../../TestActions';

// Import Selectors
import { getTest } from '../../TestReducer';

export function TestDetailPage(props) {
  return (
    <div>
      <Helmet title={props.test.name} />
      <div className={`${styles['single-test']} ${styles['test-detail']}`}>
        <h3 className={styles['test-title']}>{props.test.name}</h3>
        <p className={styles['author-name']}><FormattedMessage id="testType" /> {props.test.type}</p>
        <p className={styles['author-name']}><FormattedMessage id="testStability" /> {props.test.isStable.toString()}</p>
        <p className={styles['test-desc']}>{moment(props.test.lastUpdated).format('MMMM Do YYYY, h:mm a')}</p>
      </div>
    </div>
  );
}

// Actions required to provide data for this component to render in server side.
TestDetailPage.need = [params => {
  return fetchTest(params._id);
}];

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    test: getTest(state, props.params._id),
  };
}

TestDetailPage.propTypes = {
  test: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isStable: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(TestDetailPage);
