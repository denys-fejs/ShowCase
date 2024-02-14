import { memo } from 'react';
import cn from 'classnames';
import { Button } from 'antd';
import { useFormikContext } from 'formik';

import styles from './FormSubmitButton.module.scss';

interface IProps {
  children?: any;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const FormSubmitButton = ({ className, children, isLoading, disabled }: IProps) => {
  const { isSubmitting } = useFormikContext();

  return (
    <Button
      htmlType={'submit'}
      size='large'
      className={cn(styles.button, className)}
      loading={isLoading ?? isSubmitting}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default memo(FormSubmitButton);
