import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { IProjectForm } from 'types/forms/project';
import { ProjectCard } from 'components';

import styles from './ProjectPreviewView.module.scss';

const ProjectPreviewView = () => {
  const { t } = useTranslation('views/project');
  const { values } = useFormikContext<IProjectForm>();

  const coverImage = useMemo<string | undefined>(() => {
    const cover = values.cover[0];
    return cover?.url || cover?.preview;
  }, [values]);

  return (
    <div className={styles.preview}>
      <h4 className={styles.title}>{t('projectPreview.title')}</h4>
      <ProjectCard
        className={styles.card}
        project={{
          name: values.name || t('projectPreview.defaultName'),
          country: values.country,
          emissionReductions: values.emissionReductions || 0,
          price: values.price || 0,
          projectType: values.projectType,
          coverImage,
        }}
        coverPlaceholder={t('projectPreview.coverPlaceholder')}
      />
    </div>
  );
};

export default ProjectPreviewView;
