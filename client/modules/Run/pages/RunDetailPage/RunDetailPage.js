import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// Import Style
import styles from '../../components/RunListItem/RunListItem.css';

// Import Actions
import { fetchRun } from '../../RunActions';

// Import Selectors
import { getRun } from '../../RunReducer';

export function RunDetailPage(props) {
  return (
    <div>
      <Helmet title={props.run.job} />
      <div className={`${styles['single-test']} ${styles['test-detail']}`}>
        <h3 className={styles['test-title']}>{props.run.results}</h3>
        <p className={styles['author-name']}><FormattedMessage id="testType" /> {props.run.framework}</p>
        <p className={styles['test-desc']}>{moment(props.run.runDate).format('MMMM Do YYYY, h:mm a')}</p>
      </div>
    </div>
  );
}

// Actions required to provide data for this component to render in server side.
RunDetailPage.need = [params => {
  return fetchRun(params._id);
}];

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    run: getRun(state, props.params._id),
  };
}

RunDetailPage.propTypes = {
  run: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired, // TODO: This is not of type string. Arry of objectIds?
    framework: PropTypes.string.isRequired,
    job: PropTypes.string.isRequired,
    runDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(RunDetailPage);
