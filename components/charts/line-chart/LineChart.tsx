import { useMemo } from 'react';
import { Chart } from 'react-google-charts';

//styles
import styles from './LineChart.module.scss';

interface IDataItem {
  color: string;
  values: Array<number>;
}

interface IPropsTypes {
  data: Array<IDataItem>;
  labels: Array<string>;
  axis: Array<string | number>;
  height?: number;
  ticksCount?: number;
}

const steps = [1, 2, 5, 10, 100, 1000, 10000, 100000];

const LineChart = ({ data, labels, axis, height = 320, ticksCount = 4 }: IPropsTypes) => {
  const colors = useMemo(() => {
    return data.map(({ color }) => color);
  }, [data]);

  const { ticks, step } = useMemo(() => {
    const allValues = data.map(({ values }) => values).flat();
    const maxValue = Math.max(...allValues);
    const step = steps.find((s) => s >= maxValue / ticksCount) || 10;
    const ticks = [];

    for (let i = 0; i < ticksCount; i++) {
      ticks.push(i * step);
    }

    if (ticks[ticks.length - 1] < maxValue) {
      ticks.push(maxValue);
    }

    return { ticks, step };
  }, [data, ticksCount]);

  const chartData = useMemo(() => {
    const valuesList = data.map(({ values }) => values);
    return [
      ['value', { type: 'string', role: 'annotation' }, ...labels],
      ...axis.map((axisItem, i) => [axisItem, '', ...valuesList.map((values) => values[i])]),
    ];
  }, [data, labels, axis]);

  return (
    <Chart
      className={styles.chart}
      chartType='LineChart'
      height={height}
      data={chartData}
      options={{
        pointSize: 6,
        legend: 'none',
        backgroundColor: 'transparent',
        colors,
        gridlineColor: '#6BBBAE',
        baselineColor: '#6BBBAE',
        bar: {
          groupWidth: '100%',
        },
        series: {
          0: { targetAxisIndex: 1 },
          1: { targetAxisIndex: 1 },
        },
        chartArea: {
          top: 0,
          left: 0,
          width: '94%',
          height: '90%',
        },
        annotations: {
          stem: {
            color: '#6BBBAE',
          },
          style: 'line',
        },
        hAxis: {
          textStyle: { color: '#6BBBAE', fontSize: 12 },
        },
        vAxis: {
          textStyle: { color: '#6BBBAE', fontSize: 12 },
          viewWindow: {
            max: ticks[ticks.length - 1] + step * 0.5,
          },
          ticks,
        },
      }}
    />
  );
};

export default LineChart;
