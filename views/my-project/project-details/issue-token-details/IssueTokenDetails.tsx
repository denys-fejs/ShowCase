import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreActions } from 'easy-peasy';
import { DataRow, SecondaryButton, Divider } from 'components';
import { IIssueTokens, IssueTokenStatus, IStoreModel } from 'types';
import { formatDateTime } from 'utils';
import { LabelPrimary } from 'components';
import appConfig from 'config/appConfig';

//styles
import styles from './IssueTokenDetails.module.scss';

interface IPropsTypes {
  issueToken: IIssueTokens;
}

const IssueTokenDetails = ({ issueToken }: IPropsTypes) => {
  const { amount, createdAt, id, reviewComment, documents, status, type, txHash } = issueToken;
  const { t } = useTranslation(['views/project', 'common']);
  const cancelTokenIssue = useStoreActions<IStoreModel>((actions) => actions.project.cancelTokenIssue);

  const cancelHandler = async () => {
    await cancelTokenIssue({ id });
  };

  const renderBtnContainer = () => {
    switch (status) {
      case IssueTokenStatus.Rejected:
        return <LabelPrimary className={styles.rejected}>{t('common:tokensRequest.status.rejected')}</LabelPrimary>;
      case IssueTokenStatus.Approved:
        return <LabelPrimary className={styles.approved}>{t('common:tokensRequest.status.approved')}</LabelPrimary>;
      case IssueTokenStatus.InReview:
        return <LabelPrimary className={styles.loading}>{t('common:tokensRequest.status.in-review')}</LabelPrimary>;
      case IssueTokenStatus.ApproveInProgress:
        return (
          <LabelPrimary className={styles.loading}>{t('common:tokensRequest.status.approve-in-progress')}</LabelPrimary>
        );
      case IssueTokenStatus.Pending:
        return (
          <>
            <SecondaryButton
              className={styles.cancelButton}
              onClick={() => {
                cancelHandler();
              }}
              size='large'
            >
              {t('form.cancel')}
            </SecondaryButton>
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
