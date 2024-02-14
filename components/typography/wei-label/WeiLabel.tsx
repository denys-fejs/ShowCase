import { useMemo } from 'react';
import { ethers } from 'ethers';
import { Tooltip } from 'antd';

import styles from './WeiLabel.module.scss';

interface IProps {
  value?: string | number | BigInt;
  unit: string;
  isEth?: boolean;
}

const WeiLabel = ({ value = 0, unit = 'CC', isEth = false }: IProps) => {
  const eth = useMemo(() => ethers.utils.formatEther(BigInt(value)), [value]);

  if (isEth) {
    return (
      <span className={styles.label}>
        {eth} {unit}
      </span>
    );
  }

  return (
    <span className={styles.label}>
      <Tooltip title={`${eth} ${unit}`}>{value.toString()} wei</Tooltip>
    </span>
  );
};

export default WeiLabel;
