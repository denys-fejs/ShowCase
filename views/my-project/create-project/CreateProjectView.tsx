import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { FormikProps } from 'formik';

import { IStoreModel } from 'types/store/store';
import { IProjectDetailsResponseBody } from 'types/api/project';
import { IProjectForm } from 'types/forms/project';

import { MainLoader, Notification, PrimaryButton, SecondaryButton } from 'components';
import { NotificationTypes } from 'constants/notificationTypes';
import CreateProjectFormView from './create-project-form/CreateProjectFormView';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import ProjectPreviewView from './project-preview/ProjectPreviewView';
import MainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';

import styles from './CreateProjectView.module.scss';
import bgImage from 'resources/images/bg/tristan-create-project-layout.png';

interface IProps {
  editMode?: boolean;
}
const CreateProjectView = ({ editMode = false }: IProps) => {
  const { t } = useTranslation('views/project');
  const formRef = useRef<FormikProps<IProjectForm>>(null);
  const { setSubFooter } = useContext(MainLayoutContext);

  const userProject = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>((store) => store.project.project);
  const isProjectLoading = useStoreState<IStoreModel, boolean>((store) => store.project.isProjectLoading);

  const updateProject = useStoreActions<IStoreModel>((actions) => actions.project.updateProject);
  const submitProject = useStoreActions<IStoreModel>((actions) => actions.project.submitProject);
  const loadProject = useStoreActions<IStoreModel>((actions) => actions.project.loadProject);

  useEffect(() => {
    setSubFooter &&
      setSubFooter(
        <div className={styles.buttonsContainer}>
          <SecondaryButton
            className={styles.actionButton}
            onClick={() => formRef?.current?.handleSubmit()}
            size='large'
          >
            {t('form.save')}
          </SecondaryButton>
          <PrimaryButton className={styles.actionButton} onClick={handleSubmit}>
            {t('form.submit')}
          </PrimaryButton>
        </div>,
      );

    return () => {
      setSubFooter && setSubFooter(null);
    };
  }, [setSubFooter, t]);

  const handleUpdate = async (values: IProjectForm): Promise<void> => {
    await updateProject(values);
    Notification({
      notificationType: NotificationTypes.Success,
      message: 'Success',
      description: t('projectUpdated'),
    });
  };

  const handleSubmit = async (): Promise<void> => {
    const errors = await formRef?.current?.validateForm();

    if (formRef?.current?.values && (!errors || Object.values(errors).length === 0)) {
      await handleUpdate(formRef.current.values);
      await submitProject();
      Notification({
        notificationType: NotificationTypes.Success,
        message: 'Success',
        description: t('projectSubmitted'),
      });
      loadProject();
    }
  };
  return (
    <>
      <div className={styles.backgroundImage} style={{ backgroundImage: `url("${bgImage}")` }} />
      {editMode ? (
        <SectionHeader>{t('editProject')}</SectionHeader>
      ) : (
        <SectionHeader>{t('createProject')}</SectionHeader>
      )}
      <MainLoader isLoading={isProjectLoading}>
        <div className={styles.formContainer}>
          <CreateProjectFormView formRef={formRef} project={userProject || undefined} handleUpdate={handleUpdate}>
            <ProjectPreviewView />
          </CreateProjectFormView>
        </div>
      </MainLoader>
    </>
  );
};

export default CreateProjectView;
