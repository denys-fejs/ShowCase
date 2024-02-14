import { ReactNode } from 'react';
import cn from 'classnames';
import { Modal, ModalProps } from 'antd';

import styles from './ActionModal.module.scss';

interface IProps extends ModalProps {
  isOpen: boolean;
  loading?: boolean;
  className?: string;
  close?: () => void;
  children?: ReactNode;
  disable?: boolean;
}

const ActionModal = ({ isOpen, loading, close, className, disable = false, children, ...rest }: IProps) => {
  return (
    <Modal
      className={cn(styles.modal, className)}
      visible={isOpen}
      onCancel={close}
      cancelButtonProps={{ disabled: loading, className: styles.cancel }}
      okButtonProps={{ loading, className: styles.ok, disabled: disable }}
      closable={false}
      {...rest}
    >
      {children}
    </Modal>
  );
};

export default ActionModal;
