import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

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
        <p className={styles['author-name']}><FormattedMessage id="testType" /> {props.test.name}</p>
        <p className={styles['author-name']}><FormattedMessage id="testStability" /> {props.test.name}</p>
        <p className={styles['test-desc']}>{props.test.lastUpdated}</p>
      </div>
    </div>
  );
}

// Actions required to provide data for this component to render in server side.
TestDetailPage.need = [params => {
  return fetchTest(params.id);
}];

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    test: getTest(state, props.params.id),
  };
}

TestDetailPage.propTypes = {
  test: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isStable: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(TestDetailPage);
