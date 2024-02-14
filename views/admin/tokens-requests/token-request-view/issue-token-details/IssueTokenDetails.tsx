import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreActions } from 'easy-peasy';
import { DataRow, Divider } from 'components';
import ApproveActionView from 'views/admin/actions/approve/ApproveActionView';
import RejectActionView from 'views/admin/actions/reject/RejectActionView';

import { formatDateTime } from 'utils';
import { IIssueTokens, IssueTokenStatus, IStoreModel } from 'types';
import { LabelPrimary } from 'components';
import StartReviewActionView from 'views/admin/actions/start-review/StartReviewActionView';
import appConfig from 'config/appConfig';

//styles
import styles from './IssueTokenDetails.module.scss';

interface IPropsTypes {
  issueToken: IIssueTokens;
  loadIssueTokensRequest: any;
}

const IssueTokenDetails = ({ issueToken, loadIssueTokensRequest }: IPropsTypes) => {
  const { amount, createdAt, id, reviewComment, documents, status, type, project, txHash, accountAddress } = issueToken;
  const { t } = useTranslation(['views/project', 'common', 'admin']);
  const name = project?.name;
  const startTokenRequestReview = useStoreActions<IStoreModel>(
    (actions) => actions.admin.tokensRequests.startTokenRequestReview,
  );
  const approveTokensRequest = useStoreActions<IStoreModel>(
    (actions) => actions.admin.tokensRequests.approveTokenRequest,
  );
  const rejectTokensRequest = useStoreActions<IStoreModel>(
    (actions) => actions.admin.tokensRequests.rejectTokenRequest,
  );

  const handleTokenRequestStartReview = async () => {
    await startTokenRequestReview(id);
    await loadIssueTokensRequest(id);
  };

  const handleTokenRequestApprove = async () => {
    await approveTokensRequest({ id, amount, type, accountAddress, projectId: project.parentId });
    await loadIssueTokensRequest(id);
  };

  const handleTokenRequestReject = async (reason?: string) => {
    await rejectTokensRequest({ id, reason });
    await loadIssueTokensRequest(id);
  };

  const renderBtnContainer = () => {
    switch (status) {
      case IssueTokenStatus.Rejected:
        return <LabelPrimary className={styles.rejected}>{t('common:tokensRequest.status.rejected')}</LabelPrimary>;
      case IssueTokenStatus.Approved:
        return <LabelPrimary className={styles.approved}>{t('common:tokensRequest.status.approved')}</LabelPrimary>;
      case IssueTokenStatus.Pending:
        return (
          <StartReviewActionView
            name={name}
            className={styles.start}
            onStartReview={() => handleTokenRequestStartReview()}
          />
        );
      case IssueTokenStatus.ApproveInProgress:
        return (
          <LabelPrimary className={styles.loading}>{t('common:tokensRequest.status.approve-in-progress')}</LabelPrimary>
        );
      case IssueTokenStatus.InReview:
        return (
          <>
            <ApproveActionView
              className={styles.approveBtn}
              name={name}
              onApprove={() => handleTokenRequestApprove()}
            />
            <RejectActionView
              className={styles.rejectBtn}
              name={name}
              onReject={(reason: string) => handleTokenRequestReject(reason)}
            />
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.issueTokenWrapper}>
          <div className={styles.left}>
            <span className={styles.title}>{t(`tokenRequest.${type}`)}</span>
            <div className={styles.input}>
              <div className={styles.amount}>
                <span className={styles.aTitle}>{t('tokenRequest.amount')}</span>
                <span className={styles.aSum}>{amount}</span>
              </div>
              <span className={styles.rightSide}>{t('projectInfo.emissionUnit')}</span>
            </div>
            {txHash && (
              <a
                href={`${appConfig.explorerUrl}/tx/${txHash}`}
                target='_blank'
                rel='noreferrer'
                className={styles.viewTransaction}
              >
                {t('common:common.viewTransaction')}
              </a>
            )}
          </div>
          <div className={styles.right}>
            <span className={styles.date}>{formatDateTime(createdAt)}</span>
            <div className={styles.btnContainer}>{renderBtnContainer()}</div>
          </div>
        </div>
        {(documents || reviewComment) && (
          <div className={styles.auditContainer}>
            {reviewComment && (
              <>
                <div className={styles.dividerContainer}>
                  <Divider color='lightGrey' />
                </div>
                <div className={styles.сomments}>
                  <div className={styles.adminCommentWrapper}>
                    <span className={styles.auditTitle}>{t('commentsTitle')}</span>
                    <p>{reviewComment}</p>
                  </div>
                </div>
              </>
            )}
            {documents && documents.length > 0 && (
              <>
                <span className={styles.auditTitle}>{t('tokenRequest.auditCompanyDocument')}</span>
                <div className={styles.documents}>
                  {documents.map((item: any) => {
                    return (
                      <React.Fragment key={item.id}>
                        <DataRow icon='document' label={item.fileName} downloadUrl={item.url} auditDocument />
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueTokenDetails;
