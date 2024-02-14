import { memo, useCallback } from 'react';
import { Table as AntdTable, TableProps } from 'antd';
import cn from 'classnames';

import { DEFAULT_PAGE_SIZE } from 'constants/common';

import { NoData } from 'components';
import styles from './Table.module.scss';

interface IProps<T = any> extends TableProps<T> {
  data?: Array<T>;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (record: T) => void;
  tab?: string;
  bigPlaceholder?: boolean;
  maxHeight?: number;
  text?: string;
  refresh?: (params?: any) => any;
  rowClassName?: (params?: any) => any;
}

const Table = ({
  className,
  data = [],
  total = data?.length,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  onPageChange,
  onRowClick,
  tab,
  bigPlaceholder = false,
  text,
  refresh,
  rowClassName,
  ...rest
}: IProps) => {
  const getRowProps = useCallback(
    (record) => {
      return {
        onClick: () => {
          onRowClick && onRowClick(record);
        },
      };
    },
    [onRowClick],
  );

  const renderTotal = (total: number, [from, to]: [number, number]) => {
    return `${from} - ${to} of ${total}`;
  };

  return (
    <AntdTable
      {...rest}
      className={cn(styles.table, className, { [styles.clickable]: !!onRowClick })}
      dataSource={data}
      rowKey={(data) => data.id}
      rowClassName={rowClassName}
      onRow={getRowProps}
      locale={{
        emptyText: <NoData title={tab} refresh={refresh} bigPlaceholder={bigPlaceholder} text={text} />,
      }}
      pagination={
        total > data?.length
          ? {
              total,
              pageSize,
              position: ['bottomCenter'],
              current: page,
              onChange: onPageChange,
              showTotal: renderTotal,
            }
          : false
      }
    />
  );
};

export default memo(Table);
