import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory';

// Import Style
import styles from '../../components/RunListItem/RunListItem.css';

// Import Actions
import { fetchRun } from '../../RunActions';

// Import Selectors
import { getRun } from '../../RunReducer';

// Fake chart data to placehold until Results Reducer is working
const data = [
  { count: 4, testResult: 'success' },
  { count: 2, testResult: 'failure' },
];

export function RunDetailPage(props) {
  return (
    <div>
      <Helmet title={props.run.job} />
      <div className={`${styles['single-test']} ${styles['test-detail']}`}>
        <h3 className={styles['test-title']}>{props.run.job}</h3>
        <p className={styles['author-name']}><FormattedMessage id="testType" /> {props.run.framework}</p>
        <p className={styles['test-desc']}>{moment(props.run.runDate).format('MMMM Do YYYY, h:mm a')}</p>
      </div>
      <div className={`${styles['chart-parent']}`} >
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={60}
          animate={{ duration: 1000, easing: 'poly' }}
        >
          <VictoryAxis
            tickValues={[1, 2]}
            tickFormat={['Pass', 'Fail']}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `${Math.round(t)}`}
          />
          <VictoryBar
            data={data}
            x={(d) => d.testResult}
            y={(d) => d.count}
            barRatio={1.5}
            style={{
              data: {
                fill: (d) => {
                  return d.testResult === 'failure' ? '#FF0000' : '#0000FF';
                },
              },
            }}
          />
        </VictoryChart>
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
    results: PropTypes.array.isRequired, // TODO: This is an array of references. Need to get the real data somewhere.
    framework: PropTypes.string.isRequired,
    job: PropTypes.string.isRequired,
    runDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(RunDetailPage);
