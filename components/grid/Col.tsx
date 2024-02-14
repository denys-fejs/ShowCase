import { Col as AntdCol, ColProps } from 'antd';

interface IProps extends ColProps {
  flexible?: boolean;
}

const Col = ({ flexible, span = 24, ...rest }: IProps) => {
  return <AntdCol span={flexible ? undefined : span} {...rest} />;
};

export default Col;
