import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

// Import Style
import styles from './TestCreateWidget.css';

export class TestCreateWidget extends Component {
  addTest = () => {
    const nameRef = this.refs.name;
    const typeRef = this.refs.type;
    const isStableRef = this.refs.isStable;
    if (nameRef.value && typeRef.value && isStableRef.value) {
      this.props.addTest(nameRef.value, typeRef.value, isStableRef.value);
      nameRef.value = typeRef.value = isStableRef.value = '';
    }
  };

  render() {
    const cls = `${styles.form} ${(this.props.showAddTest ? styles.appear : '')}`;
    return (
      <div className={cls}>
        <div className={styles['form-content']}>
          <h2 className={styles['form-title']}><FormattedMessage id="createNewTest" /></h2>
          <input placeholder={this.props.intl.messages.testName} className={styles['form-field']} ref="name" />
          <input placeholder={this.props.intl.messages.testType} className={styles['form-field']} ref="type" />
          <input placeholder={this.props.intl.messages.testStability} className={styles['form-field']} ref="isStable" />
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
