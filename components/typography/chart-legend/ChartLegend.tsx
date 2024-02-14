import { SizeType } from 'antd/lib/config-provider/SizeContext';
import cn from 'classnames';

import { Col, Row } from 'components/grid';

import styles from './ChartLegend.module.scss';

interface IProps {
  title: string;
  value: string | number;
  size?: SizeType;
  color?: string;
}

const ChartLegend = ({ title, value, color, size = 'middle' }: IProps) => {
  return (
    <Row className={cn(styles.chartLegend, styles[size])} align='middle'>
      {color && (
        <Col flexible>
          <div className={styles.colorRound} style={{ backgroundColor: color, borderColor: color }} />
        </Col>
      )}
      <Col flexible>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{value}</div>
      </Col>
    </Row>
  );
};

export default ChartLegend;
