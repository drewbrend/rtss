import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import RunListItem from '../../components/RunListItem/RunListItem';
import { mountWithIntl, shallowWithIntl } from '../../../../util/react-intl-test-helper';

const run = { _id: 'id', results: ['result-set-1'], framework: 'Cypress', job: 'some-jenkins-job', runDate: '2019-01-28 16:10:56.346Z' };

const props = {
  run,
  onDelete: () => {},
};

test('renders properly', t => {
  const wrapper = shallowWithIntl(
    <RunListItem {...props} />
  );

  t.truthy(wrapper.hasClass('single-test'));
  t.is(wrapper.find('Link').first().prop('children'), run.job);
  t.is(wrapper.find('.author-name').length, 3);
});

test('has correct props', t => {
  const wrapper = mountWithIntl(
    <RunListItem {...props} />
  );

  t.deepEqual(wrapper.prop('run'), props.run);
  t.is(wrapper.prop('onClick'), props.onClick);
  t.is(wrapper.prop('onDelete'), props.onDelete);
});

test('calls onDelete', t => {
  const onDelete = sinon.spy();
  const wrapper = shallowWithIntl(
    <RunListItem run={run} onDelete={onDelete} />
  );

  wrapper.find('.test-action > a').first().simulate('click');
  t.truthy(onDelete.calledOnce);
});
