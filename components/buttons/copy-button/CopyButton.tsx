import { ReactNode, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import cn from 'classnames';

import { RowSpace } from 'types';

import { Col, Row } from '../../grid';
import IconSvg from '../../icons';

import styles from './CopyButton.module.scss';

interface IProps {
  textToCopy: string;
  tooltipText?: string;
  className?: string;
  children?: ReactNode;
}

const CopyButton = ({ className, textToCopy, tooltipText, children = textToCopy }: IProps) => {
  const { t } = useTranslation();
  const textArea = useRef<any>();
  const [isCopied, setCopied] = useState(false);

  const copy = async () => {
    textArea.current.select();
    document.execCommand('copy');
    setCopied(true);
  };
  const resetCopyState = () => setCopied(false);

  return (
    <>
      <Tooltip
        title={isCopied ? t('common.copied') : tooltipText || t('common.copy')}
        placement='top'
        overlayClassName={styles.tooltip}
      >
        <div className={cn(styles.copyButton, className)} onClick={copy} onMouseEnter={resetCopyState}>
          <Row horizontalSpace={RowSpace.ExtraSmall} justify='center'>
            <Col flexible>{children}</Col>
            <Col flexible>
              <IconSvg icon='copy' />
            </Col>
          </Row>
        </div>
      </Tooltip>
      <textarea ref={textArea} defaultValue={textToCopy} className={styles.textarea} />
    </>
  );
};

export default CopyButton;
