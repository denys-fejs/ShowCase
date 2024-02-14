import { useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useStoreActions } from 'easy-peasy';

import useFetch from 'hooks/useFetch';
import adminCompaniesAPI from 'api/admin/adminCompaniesAPI';
import StartReviewActionView from '../actions/start-review/StartReviewActionView';
import ApproveActionView from '../actions/approve/ApproveActionView';
import RejectActionView from '../actions/reject/RejectActionView';
import { DocumentType } from 'types/api/document';
import { RowSpace } from 'types/components/grid';
import { IStoreModel } from 'types/store/store';

import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import CompanyDetailsView from 'views/company-details/CompanyDetailsView';
import MainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';
import { Col, MainLoader, Row } from 'components';

import styles from '../project-details/AdminProjectDetailsView.module.scss';
import { CompanyStatus } from 'constants/company';

const documentTypes = Object.values(DocumentType);

const AdminCompanyDetailsView = () => {
  const { t } = useTranslation('views/admin');
  const { id } = useParams<{ id: string }>();
  const { setSubFooter } = useContext(MainLayoutContext);
  const startCompanyReview = useStoreActions<IStoreModel>((actions) => actions.admin.companies.startCompanyReview);
  const approveCompany = useStoreActions<IStoreModel>((actions) => actions.admin.companies.approveCompany);
  const rejectCompany = useStoreActions<IStoreModel>((actions) => actions.admin.companies.rejectCompany);

  const { response: company, loading, retry } = useFetch(() => adminCompaniesAPI.getCompanyById(id), [id]);

  const hasActions = !!company && [CompanyStatus.Pending, CompanyStatus.InReview].includes(company.status);

  useEffect(() => {
    if (hasActions && setSubFooter) {
      setSubFooter(<div className={styles.buttonsContainer}>{renderActions()}</div>);
    }

    return () => {
      setSubFooter && setSubFooter(null);
    };
  }, [company, hasActions, setSubFooter, t]);

  const handleProjectStartReview = async () => {
    company && (await startCompanyReview(company.id));
    retry();
  };

  const handleProjectApprove = async () => {
    company && (await approveCompany(company));
    retry();
  };

  const handleProjectReject = async (reason?: string) => {
    company && (await rejectCompany({ id: company.id, reason }));
    retry();
  };

  const renderActions = () => {
    switch (company?.status) {
      case CompanyStatus.Pending:
        return (
          <>
            <StartReviewActionView
              name={t('companies.company', { name: company.name })}
              onStartReview={handleProjectStartReview}
            />
          </>
        );
      case CompanyStatus.InReview:
        return (
          <>
            <Row horizontalSpace={RowSpace.Small} wrap={false}>
              <Col flexible>
                <ApproveActionView
                  name={t('companies.company', { name: company.name })}
                  onApprove={handleProjectApprove}
                />
              </Col>
              <Col flexible>
                <RejectActionView
                  name={t('companies.company', { name: company.name })}
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
        {company && <CompanyDetailsView company={company} documentTypes={documentTypes} />}
      </MainLoader>
    </>
  );
};

export default AdminCompanyDetailsView;
