import { Chart as LineChart } from 'react-google-charts';
import cn from 'classnames';

//styles
import styles from './Chart.module.scss';

interface IPropsTypes {
  data: any;
  info: any;
  type: 'projects' | 'carbonCoin';
}

const ChartComponent = ({ data, info, type }: IPropsTypes) => {
  const { title1, value1, title2, value2 } = info;
  return (
    <>
      <LineChart
        className={styles.chart}
        chartType='LineChart'
        height='320'
        data={data}
        options={{
          pointSize: 4,
          legend: 'none',
          backgroundColor: 'transparent',
          colors: ['#A3F2EE', '#F7B500'],
          gridlineColor: '#FFFFFF',
          bar: {
            groupWidth: '100%',
          },
          series: {
            0: { targetAxisIndex: 1 },
            1: { targetAxisIndex: 1 },
          },
          chartArea: {
            width: '75%',
            height: '80%',
            right: 0,
            backgroundColor: {
              stroke: '#FFFFFF',
              strokeWidth: 1,
            },
          },
          annotations: {
            stem: {
              color: '#FFFFFF',
            },
            style: 'line',
          },
          hAxis: {
            textStyle: { color: '#FFFFFF' },
          },
          vAxis: {
            textStyle: { color: '#FFFFFF' },
          },
        }}
        rootProps={{ 'data-testid': '2' }}
      />
      <div className={styles.statisticSection}>
        <div className={styles.statisticContainerCirculation}>
          {type === 'projects' && <div className={cn(styles.left, styles.available)}>{/* <IconSvg /> */}</div>}
          <div className={styles.right}>
            <span className={styles.title}>{title1}</span>
            <span className={cn(styles.sum, styles[type])}>{value1}</span>
          </div>
        </div>
        <div className={styles.statisticContainer}>
          {type === 'projects' && <div className={cn(styles.left, styles.burned)}>{/* <IconSvg /> */}</div>}
          <div className={styles.right}>
            <span className={styles.title}>{title2}</span>
            <span className={styles.sum}>{value2}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartComponent;
