import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { useStoreActions } from 'easy-peasy';

import { IStoreModel, RowSpace } from 'types';
import { useFetch } from 'hooks';
import { UserStatus, Routes } from 'constants/index';
import adminUsersAPI from 'api/admin/adminUsersAPI';
import { Col, CompanyHeader, DataRow, DetailsSection, MainLoader, Row } from 'components';

import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import MainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';
import ApproveActionView from '../actions/approve/ApproveActionView';
import RejectActionView from '../actions/reject/RejectActionView';

import styles from './AdminUserDetailsView.module.scss';

const AdminUserDetailsView = () => {
  const { t } = useTranslation('views/admin');
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { setSubFooter } = useContext(MainLayoutContext);
  const approveUser = useStoreActions<IStoreModel>((actions) => actions.admin.users.approveUser);
  const rejectUser = useStoreActions<IStoreModel>((actions) => actions.admin.users.rejectUser);

  const { response: user, loading, retry } = useFetch(() => adminUsersAPI.getUser(id), [id]);
  const hasActions = user?.status === UserStatus.Pending;

  useEffect(() => {
    if (hasActions && setSubFooter) {
      setSubFooter(<div className={styles.buttonsContainer}>{renderActions()}</div>);
    }

    return () => {
      setSubFooter && setSubFooter(null);
    };
  }, [user, hasActions, setSubFooter, t]);

  const handleProjectApprove = async () => {
    user && (await approveUser(user));
    retry();
  };

  const handleProjectReject = async (reason?: string) => {
    user && (await rejectUser({ id: user.id, reason }));
    retry();
    history.push(Routes.admin);
  };

  const renderActions = () => {
    switch (user?.status) {
      case UserStatus.Pending:
        return (
          <>
            <Row horizontalSpace={RowSpace.Small} wrap={false}>
              <Col flexible>
                <ApproveActionView
                  name={t('admins.user', { name: user.name, surname: user.surname })}
                  onApprove={handleProjectApprove}
                />
              </Col>
              <Col flexible>
                <RejectActionView
                  name={t('admins.user', { name: user.name, surname: user.surname })}
                  onReject={(reason: string) => handleProjectReject(reason)}
                />
              </Col>
            </Row>
          </>
        );
      default:
        return '';
    }
  };

  return (
    <>
      <BasicSearchHeader />
      <MainLoader isLoading={loading}>
        {user && (
          <div className={styles.container}>
            <CompanyHeader
              icon='avatar'
              companyName={t('admins.user', { name: user.name, surname: user.surname })}
              accountAddress={user?.accountAddress}
            />
            <DetailsSection title={t('admins.details')}>
              <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
                {user.phoneNumber && (
                  <Col>
                    <DataRow data={user.phoneNumber} icon='phone' label={t('admins.phone')} />
                  </Col>
                )}
                {user.email && (
                  <Col>
                    <DataRow data={user.email} icon='mail' label={t('admins.email')} />
                  </Col>
                )}
              </Row>
            </DetailsSection>
          </div>
        )}
      </MainLoader>
    </>
  );
};

export default AdminUserDetailsView;
