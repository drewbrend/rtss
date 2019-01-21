import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// Import Style
import styles from './TestListItem.css';

function TestListItem(props) {
  return (
    <div className={styles['single-test']}>
      <h3 className={styles['test-title']}>
        <Link to={`/tests/${props.test._id}`} >
          {props.test.name}
        </Link>
      </h3>
      <p className={styles['author-name']}><FormattedMessage id="testType" /> {props.test.type}</p>
      <p className={styles['author-name']}><FormattedMessage id="testStability" /> {props.test.isStable.toString()}</p>
      <p className={styles['author-name']}><FormattedMessage id="lastUpdated" /> {moment(props.test.lastUpdated).format('MMMM Do YYYY, h:mm a')}</p>
      <p className={styles['test-action']}><a href="#" onClick={props.onDelete}><FormattedMessage id="deleteTest" /></a></p>
      <hr className={styles.divider} />
    </div>
  );
}

TestListItem.propTypes = {
  test: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isStable: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TestListItem;
