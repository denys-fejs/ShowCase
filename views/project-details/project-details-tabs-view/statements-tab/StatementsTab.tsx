import { useEffect, memo, useState, useCallback } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useHistory } from 'react-router';
import 'antd/dist/antd.css';
import { DeleteOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import 'antd/dist/antd.css';
import Table from 'components/table';
import { ActionModal } from 'components';
import { formatDate } from 'utils/formatDate';
import AddButton from 'components/buttons/add-button/AddButton';
import { Routes } from 'constants/routes';
import { IPaginationResponse } from 'types/api/pagination';
import { IProjectStatement } from 'types/api/project-statement';
import { IStoreModel } from 'types/store/store';
import useModal from 'hooks/useModal';
import { IconSvg } from '../../../../components';

//styles
import styles from './StatementsTab.module.scss';

interface IPropsTypes {
  projectId?: number;
  canEdit?: boolean;
}

const StatementsTab = ({ projectId, canEdit }: IPropsTypes) => {
  const { t } = useTranslation(['common', 'views/project']);
  const history = useHistory();
  const { isOpen, open, close, loading, setLoading } = useModal();

  const [title, setTitle] = useState('');
  const [statementId, setStatementId] = useState<number | null>(null);

  const loadProjectStatements = useStoreActions<IStoreModel>((actions) => actions.project.loadProjectStatements);
  const deleteProjectStatement = useStoreActions<IStoreModel>((actions) => actions.project.deleteProjectStatement);

  const statementsList = useStoreState<IStoreModel, IPaginationResponse<IProjectStatement> | null>(
    (store) => store.project.projectStatements,
  );

  const getStatementsListWithKey = (statementsList: IPaginationResponse<IProjectStatement>) => {
    return statementsList.items.map((statement: IProjectStatement) => ({
      key: statement.id,
      ...statement,
      date: formatDate(statement.date, 'D MMM, yyyy'),
    }));
  };

  const statementListKey = statementsList && getStatementsListWithKey(statementsList);
  const handleUpdateStatement = (statement: Omit<IProjectStatement, 'id'>) => {
    history.push({
      pathname: Routes.addProjectStatement,
      state: { projectId, statement },
    });
  };

  const dataWithActions: any = statementListKey?.map((item) => ({
    ...item,
    actions: [
      { action: 'Edit', icon: <IconSvg icon='edit' />, onClick: () => handleUpdateStatement(item) },
      {
        action: 'Delete',
        icon: <DeleteOutlined className={styles.deleteIcon} />,
        onClick: () => deleteHandle(item),
      },
    ],
  }));

  const deleteHandle = (item: IProjectStatement) => {
    setTitle(item.title);
    setStatementId(item.id);
    open();
  };

  const closeHandle = () => {
    setLoading(true);
    setTitle('');
    setStatementId(null);
    close();
  };

  const handleConfirm = async () => {
    await deleteProjectStatement({ projectId, statementId });
  };

  const handleAddStatement = () => {
    history.push(Routes.addProjectStatement);
  };

  const loadProjectStatementsCallback = useCallback(() => {
    loadProjectStatements({ projectId });
  }, [projectId]);

  useEffect(() => {
    loadProjectStatementsCallback();
  }, [projectId]);

  const Title = () => {
    return (
      <div className={styles.title}>
        {t('views/project:projectStatement.title')}
        <CaretDownOutlined style={{ fontSize: '14px', color: '#6BBBAE' }} />
      </div>
    );
  };

  const columns = [
    {
      title: Title,
      dataIndex: 'title',
      className: 'title',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      className: 'category',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      className: 'dateColumn',
    },
    {
      title: '',
      dataIndex: 'actions',
      render: (actions: any) =>
        actions &&
        actions.map((action: any, key: number) => {
          return (
            <div className={styles.action} key={key} onClick={action.onClick}>
              {action.icon}
            </div>
          );
        }),
      className: canEdit ? 'actions' : 'noActions',
    },
  ];

  const data = canEdit ? dataWithActions : statementListKey;

  return (
    <>
      {canEdit && (
        <div className={styles.btnSection}>
          <AddButton onClick={handleAddStatement} />
        </div>
      )}
      <Table
        columns={columns}
        refresh={loadProjectStatementsCallback}
        showSorterTooltip={false}
        className={cn(styles.table)}
        data={data}
        tab='Statements'
      />
      <ActionModal
        isOpen={isOpen}
        close={closeHandle}
        loading={loading}
        onOk={handleConfirm}
        okText={t('actions.delete.button')}
        title={t('actions.delete.title')}
      >
        <p>{t('actions.delete.message', { title })}</p>
      </ActionModal>
    </>
  );
};

export default memo(StatementsTab);
