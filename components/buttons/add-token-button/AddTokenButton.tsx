import { Tooltip } from 'antd';
import { Col, IconButton, IconSvg, Row } from 'components';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSize, RowSpace } from 'types';

import styles from './AddTokenButton.module.scss';

interface IProps {
  tooltipText?: string;
  onClick: () => void;
}

const AddTokenButton = ({ onClick, tooltipText }: IProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Tooltip title={tooltipText || t('common.metamaskImport')} placement='top' overlayClassName={styles.tooltip}>
        <div>
          <Row horizontalSpace={RowSpace.ExtraSmall} justify='center'>
            <Col flexible>
              <IconButton onClick={onClick} size={ButtonSize.Small} className={styles.importButton}>
                <IconSvg icon='metamask' />
              </IconButton>
            </Col>
          </Row>
        </div>
      </Tooltip>
    </>
  );
};

export default memo(AddTokenButton);
