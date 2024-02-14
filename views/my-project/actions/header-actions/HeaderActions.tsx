import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ErrorTypes, ProjectAuditStatus, ProjectStatus, Routes } from 'constants/index';
import { IProjectDetailsResponseBody, IssueTokenStatus, IStoreModel, IWalletState } from 'types';
import { CountdownComponent, IconSvg, PrimaryButton } from 'components';
import IssueTokensView from '../issue-tokens/IssueTokensView';
import AddAuditDocumentsView from '../add-audit-documents/AddAuditDocumentsView';

import styles from './HeaderActions.module.scss';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useEffect } from 'react';
import { useFetch } from 'hooks';
import { AuctionContract } from 'blockchain';

interface IProps {
  project: IProjectDetailsResponseBody;
}

const HeaderActions = ({ project }: IProps) => {
  const { t } = useTranslation('views/project');
  const { status, auditStatus, reviewComment = '', issueTokensRequest, tokenAddr } = project;

  const wallet = useStoreState<IStoreModel, IWalletState>((store) => store.blockchain.wallet);
  const getAuctionInfo = useStoreActions<IStoreModel>((actions) => actions.auction.getAuctionInfo);
  const auctionInfo = useStoreState<IStoreModel>((state) => state.auction.auctionInfo);

  useEffect(() => {
    project.auction && getAuctionInfo({ auctionId: project.auction.auctionId });
  }, []);

  const { response: isAuctionValid } = useFetch(async () => {
    if (!wallet.provider) {
      throw new Error(ErrorTypes.NoMetamask);
    }
    const auction = await AuctionContract.getAuction(auctionInfo.auctionStarter);
    return auction.isValid;
  }, [auctionInfo?.auctionStarter]);

  let projectAuctionIsActive = false;
  if (project.auction && isAuctionValid) {
    projectAuctionIsActive = true;
  }

  const auctionButton = (
    <div className={styles.auctionButton}>
      {`${t('projectInfo.auction')}`}{' '}
      <>
        <div className={styles.icon}>
          <IconSvg icon='time' />
        </div>{' '}
        <CountdownComponent text='ended' endTime={project?.auction?.endTime * 1000} />
      </>
    </div>
  );

  // Token Request in review
  if (issueTokensRequest && [IssueTokenStatus.Pending, IssueTokenStatus.InReview].includes(issueTokensRequest.status)) {
    return (
      <div className={styles.pendingContainer}>
        <PrimaryButton className={styles.waitingButton} disabled>
          {t('waitingForApproval')}
        </PrimaryButton>
        <span className={styles.waitNotification}>{t('waitRequestNotification')}</span>
      </div>
    );
  }

  // Token Request approving
  if (issueTokensRequest && issueTokensRequest.status === IssueTokenStatus.ApproveInProgress) {
    return <></>;
  }

  // Project Approved with Audit
  if (auditStatus === ProjectAuditStatus.Complete && status === ProjectStatus.Approved) {
    return (
      <div className={styles.mainButtons}>
        {tokenAddr && <IssueTokensView project={project} />}
        <Link to={Routes.editMyProject}>
          <PrimaryButton className={styles.auditEditButton}>{t('edit')}</PrimaryButton>
        </Link>
        {tokenAddr && !projectAuctionIsActive && (
          <Link to={Routes.createAuction.replace(':tokenAddr', String(tokenAddr))}>
            <PrimaryButton className={styles.auditEditButton}>{t('createAuction')}</PrimaryButton>
          </Link>
        )}
        {tokenAddr && projectAuctionIsActive && (
          <Link to={Routes.auction.replace(':auctionId', String(project.auction?.auctionId))}>
            <PrimaryButton className={styles.mainButton}>{auctionButton}</PrimaryButton>
          </Link>
        )}
      </div>
    );
  }

  // Project Approved without Audit
  if (auditStatus === ProjectAuditStatus.Pending && status === ProjectStatus.Approved) {
    return (
      <div className={styles.mainButtons}>
        <AddAuditDocumentsView />
        <Link to={Routes.editMyProject}>
          <PrimaryButton className={styles.auditEditButton}>{t('edit')}</PrimaryButton>
        </Link>
      </div>
    );
  }

  // Project in review
  if (status === ProjectStatus.Pending || status === ProjectStatus.InReview) {
    return (
      <div className={styles.pendingContainer}>
        <PrimaryButton className={styles.waitingButton} disabled>
          {t('waitingForApproval')}
        </PrimaryButton>
        <span className={styles.waitNotification}>{t('waitNotification')}</span>
      </div>
    );
  }

  // Project rejected
  if (status === ProjectStatus.Rejected) {
    return (
      <div className={styles.rejectedContainer}>
        {reviewComment && (
          <>
            <span className={styles.rejectionTitle}>{t('commentsTitle')}</span>
            <p className={styles.rejectionContent}>{reviewComment}</p>
          </>
        )}
        <div className={styles.rejectionButtonsBox}>
          <Link to={Routes.editMyProject}>
            <PrimaryButton className={styles.editProjectButton}>{t('editProject')}</PrimaryButton>
          </Link>
        </div>
      </div>
    );
  }

  return <></>;
};

export default HeaderActions;
