import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

// Import Style
import styles from './TestCreateWidget.css';

export class TestCreateWidget extends Component {
  addTest = () => {
    const nameRef = this.refs.name;
    const titleRef = this.refs.title;
    const contentRef = this.refs.content;
    if (nameRef.value && titleRef.value && contentRef.value) {
      this.props.addTest(nameRef.value, titleRef.value, contentRef.value);
      nameRef.value = titleRef.value = contentRef.value = '';
    }
  };

  render() {
    const cls = `${styles.form} ${(this.props.showAddTest ? styles.appear : '')}`;
    return (
      <div className={cls}>
        <div className={styles['form-content']}>
          <h2 className={styles['form-title']}><FormattedMessage id="createNewTest" /></h2>
          <input placeholder={this.props.intl.messages.authorName} className={styles['form-field']} ref="name" />
          <input placeholder={this.props.intl.messages.testTitle} className={styles['form-field']} ref="title" />
          <textarea placeholder={this.props.intl.messages.testContent} className={styles['form-field']} ref="content" />
          <a className={styles['test-submit-button']} href="#" onClick={this.addTest}><FormattedMessage id="submit" /></a>
        </div>
      </div>
    );
  }
}

TestCreateWidget.propTypes = {
  addTest: PropTypes.func.isRequired,
  showAddTest: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(TestCreateWidget);
