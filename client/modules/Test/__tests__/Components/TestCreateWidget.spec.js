import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import { FormattedMessage } from 'react-intl';
import { TestCreateWidget } from '../../components/TestCreateWidget/TestCreateWidget';
import { mountWithIntl, shallowWithIntl } from '../../../../util/react-intl-test-helper';

const props = {
  addTest: () => {},
  showAddTest: true,
};

test('renders properly', t => {
  const wrapper = shallowWithIntl(
    <TestCreateWidget {...props} />
  );

  t.truthy(wrapper.hasClass('form'));
  t.truthy(wrapper.hasClass('appear'));
  t.truthy(wrapper.find('h2').first().containsMatchingElement(<FormattedMessage id="createNewTest" />));
  t.is(wrapper.find('input').length, 3);
});

test('hide when showAddTest is false', t => {
  const wrapper = mountWithIntl(
    <TestCreateWidget {...props} />
  );

  wrapper.setProps({ showAddTest: false });
  t.falsy(wrapper.hasClass('appear'));
});

test('has correct props', t => {
  const wrapper = mountWithIntl(
    <TestCreateWidget {...props} />
  );

  t.is(wrapper.prop('addTest'), props.addTest);
  t.is(wrapper.prop('showAddTest'), props.showAddTest);
});

test('calls addTest', t => {
  const addTest = sinon.spy();
  const wrapper = mountWithIntl(
    <TestCreateWidget addTest={addTest} showAddTest />
  );

  wrapper.ref('name').value = 'Test1';
  wrapper.ref('type').value = 'Some Type';
  wrapper.ref('isStable').value = 'True';

  wrapper.find('a').first().simulate('click');
  t.truthy(addTest.calledOnce);
  t.truthy(addTest.calledWith('Test1', 'Some Type', 'True'));
});

test('empty form doesn\'t call addTest', t => {
  const addTest = sinon.spy();
  const wrapper = mountWithIntl(
    <TestCreateWidget addTest={addTest} showAddTest />
  );

  wrapper.find('a').first().simulate('click');
  t.falsy(addTest.called);
});
