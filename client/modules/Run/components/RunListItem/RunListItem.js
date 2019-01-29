import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
const countBy = require('lodash.countby');

// Import Style
import styles from './RunListItem.css';

function RunListItem(props) {
  // TODO: calculate pass/fail of entire run
  const counts = countBy(props.run.results, 'result');

  return (
    <div className={styles['single-test']}>
      <h3 className={styles['test-title']}>
        <Link to={`/runs/${props.run._id}`} >
          {props.run.job}
        </Link>
      </h3>
      <p className={styles['author-name']}><FormattedMessage id="testResult" /> {(counts.failure > 0) ? 'FAILED' : 'PASSED'}</p>
      <p className={styles['author-name']}><FormattedMessage id="testFramework" /> {props.run.framework}</p>
      <p className={styles['author-name']}><FormattedMessage id="lastUpdated" /> {moment(props.run.runDate).format('MMMM Do YYYY, h:mm a')}</p>
      <p className={styles['test-action']}><a href="#" onClick={props.onDelete}><FormattedMessage id="deleteRun" /></a></p>
      <hr className={styles.divider} />
    </div>
  );
}

RunListItem.propTypes = {
  run: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired, // TODO: This is an array of references. Need to get the real data somewhere.
    framework: PropTypes.string.isRequired,
    job: PropTypes.string.isRequired,
    runDate: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RunListItem;
