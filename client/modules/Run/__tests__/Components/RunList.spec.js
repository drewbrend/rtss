import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import RunList from '../../components/RunList';

const runs = [
  { _id: 'id1', results: ['result-set-1'], framework: 'Cypress', job: 'some-jenkins-job', runDate: '2019-01-28 16:10:56.346Z' },
  { _id: 'id2', results: ['result-set-2'], framework: 'Unknown', job: 'some-other-jenkins-job', runDate: '2019-01-28 17:10:56.346Z' },
];

test('renders the list', t => {
  const wrapper = shallow(
    <RunList runs={runs} handleShowRun={() => {}} handleDeleteRun={() => {}} />
  );

  t.is(wrapper.find('RunListItem').length, 2);
});
