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
        <Link to={`/tests/${props.test.slug}-${props.test.cuid}`} >
          {props.test.title}
        </Link>
      </h3>
      <p className={styles['author-name']}><FormattedMessage id="by" /> {props.test.name}</p>
      <p className={styles['test-desc']}>{props.test.content}</p>
      <p className={styles['test-action']}><a href="#" onClick={props.onDelete}><FormattedMessage id="deleteTest" /></a></p>
      <hr className={styles.divider} />
    </div>
  );
}

TestListItem.propTypes = {
  test: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TestListItem;
