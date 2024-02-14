import { Progress } from 'antd';

interface IProps {
  rateAvailable: number;
  rateBurned: number;
}
const EmissionsBar = ({ rateAvailable, rateBurned }: IProps) => {
  return (
    <div>
      <Progress percent={rateBurned} success={{ percent: rateAvailable }} showInfo={false} />
    </div>
  );
};

export default EmissionsBar;
