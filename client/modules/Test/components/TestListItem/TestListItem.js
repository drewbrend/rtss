import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

// Import Style
import styles from './TestListItem.css';

function TestListItem(props) {
  return (
    <div className={styles['single-test']}>
      <h3 className={styles['test-title']}>
        <Link to={`/tests/${props.test.id}`} >
          {props.test.name}
        </Link>
      </h3>
      <p className={styles['author-name']}><FormattedMessage id="testType" /> {props.test.type}</p>
      <p className={styles['author-name']}><FormattedMessage id="testStability" /> {props.test.isStable}</p>
      <p className={styles['author-name']}><FormattedMessage id="lastUpdated" /> {props.test.lastUpdated}</p>
      <p className={styles['test-action']}><a href="#" onClick={props.onDelete}><FormattedMessage id="deleteTest" /></a></p>
      <hr className={styles.divider} />
    </div>
  );
}

TestListItem.propTypes = {
  test: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isStable: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TestListItem;
