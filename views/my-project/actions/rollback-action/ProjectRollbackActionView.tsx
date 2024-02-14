import { useTranslation } from 'react-i18next';
import { useStoreActions } from 'easy-peasy';

import projectAPI from 'api/project/projectAPI';
import { IStoreModel } from 'types/store/store';
import { NotificationTypes } from 'constants/notificationTypes';
import { getErrorMessage } from 'utils/error';
import useModal from 'hooks/useModal';
import { Notification, PrimaryButton, SecondaryButton, ActionModal } from 'components';

import styles from './ProjectRollbackActionView.module.scss';

interface IPropsTypes {
  isPrimaryButton?: boolean;
}

const ProjectRollbackActionView = ({ isPrimaryButton }: IPropsTypes) => {
  const { t } = useTranslation(['views/project', 'common']);
  const { isOpen, open, close, loading, setLoading } = useModal();
  const loadProject = useStoreActions<IStoreModel>((actions) => actions.project.loadProject);

  const handleRollback = async () => {
    try {
      setLoading(true);
      await projectAPI.rollbackMyProject();
      Notification({
        notificationType: NotificationTypes.Success,
        message: t('common:common.success'),
        description: t('rollback.success'),
      });
      loadProject();
    } catch (error) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('rollback.fail'),
        description: getErrorMessage(error),
      });
    }
    close();
  };

  return (
    <>
      {isPrimaryButton ? (
        <PrimaryButton className={styles.primaryButton} shadow={false} size='middle' onClick={open}>
          {t('rollback.title')}
        </PrimaryButton>
      ) : (
        <SecondaryButton className={styles.secondaryButton} size='middle' onClick={open}>
          {t('rollback.title')}
        </SecondaryButton>
      )}
      <ActionModal
        isOpen={isOpen}
        close={close}
        loading={loading}
        onOk={handleRollback}
        okText={t('rollback.button')}
        title={t('rollback.title')}
      >
        <p>{t('rollback.confirm')}</p>
      </ActionModal>
    </>
  );
};

export default ProjectRollbackActionView;
