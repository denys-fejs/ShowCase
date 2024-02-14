import { Row as AntdRow, RowProps } from 'antd';
import { RowSpace } from 'types/components/grid';

interface IProps extends RowProps {
  verticalSpace?: RowSpace;
  horizontalSpace?: RowSpace;
}

const spaceMap = {
  [RowSpace.None]: 0,
  [RowSpace.ExtraSmall]: 6,
  [RowSpace.Small]: 16,
  [RowSpace.Middle]: 24,
  [RowSpace.Large]: 32,
};

const Row = ({ verticalSpace = RowSpace.Middle, horizontalSpace = RowSpace.Middle, ...rest }: IProps) => {
  return <AntdRow gutter={[spaceMap[horizontalSpace], spaceMap[verticalSpace]]} {...rest} />;
};

export default Row;
