import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useStoreActions, useStoreState } from 'easy-peasy';
import cn from 'classnames';
import hasIn from 'lodash.hasin';
import { CountdownComponent, FavoriteButton, IconSvg, PrimaryButton, ProjectTitle } from 'components';
import { CompanyStatus, Routes, UserRole } from 'constants/index';
import { useAuthRole } from 'hooks';
import { ButtonSize, ICompanyDetailsResponseBody, IProjectDetailsResponseBody, IStoreModel, IWalletState } from 'types';
import BurnTokensView from './burn-tokens/BurnTokensView';

//styles
import styles from './ProjectDetailsHeaderView.module.scss';
import appConfig from 'config/appConfig';

interface IProps {
  project: IProjectDetailsResponseBody;
}

const ProjectDetailsHeader = ({ project }: IProps) => {
  const { id, auction, tokenAddr, tokenTicker } = project;
  const { t } = useTranslation(['views/project', 'common']);
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);
  const { userRole } = useAuthRole({ isRedirect: false });
  const wallet = useStoreState<IStoreModel, IWalletState>((state) => state.blockchain.wallet);
  const userCompany = useStoreState<IStoreModel, ICompanyDetailsResponseBody | null>((state) => state.company.company);
  const loadCompany = useStoreActions<IStoreModel>((actions) => actions.company.loadCompany);
  const isAuthorized = useStoreState<IStoreModel>((store) => store.auth.isAuthorized);
  const addToFavorites = useStoreActions<IStoreModel>((actions) => actions.project.addToFavorites);
  const removeFromFavorites = useStoreActions<IStoreModel>((actions) => actions.project.removeFromFavorites);
  const setFavoriteProjectById = useStoreActions<IStoreModel>((actions) => actions.project.setFavoriteProjectById);

  useEffect(() => isAuthorized && userRole === UserRole.Company && loadCompany, [isAuthorized]);

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

  const handleFavoriteClick = useCallback(async () => {
    setFavoriteLoading(true);

    try {
      if (project?.isFavorite) {
        await removeFromFavorites(id);
        setFavoriteProjectById(false);
      } else {
        await addToFavorites(id);
        setFavoriteProjectById(true);
      }
    } finally {
      setFavoriteLoading(false);
    }
  }, [id, project?.isFavorite]);

  const handleSwapClick = useCallback(() => {
    window.open(`${appConfig.swapUrl}/#/swap?outputCurrency=${tokenAddr}`, '_blank');
  }, []);

  const showFavorite = hasIn(project, 'isFavorite');
  return (
    <>
      <ProjectTitle project={project} />
      <div className={styles.mainButtons}>
        {tokenAddr && (
          <PrimaryButton className={styles.mainButton} onClick={handleSwapClick}>
            {t('projectInfo.purchaseOnSwap')}
          </PrimaryButton>
        )}
        {!!tokenAddr &&
          !!wallet?.walletAddress &&
          userRole === UserRole.Company &&
          userCompany?.status === CompanyStatus.Approved && (
            <BurnTokensView
              className={cn(styles.mainButton, styles.burnButton)}
              projectId={id}
              tokenAddr={tokenAddr}
              tokenTicker={tokenTicker}
            />
          )}
        {auction && (
          <Link to={Routes.auction.replace(':auctionId', String(auction?.auctionId))}>
            <PrimaryButton className={styles.mainButton}>{auctionButton}</PrimaryButton>
          </Link>
        )}
        <div className={styles.favoriteButton}>
          {showFavorite && (
            <FavoriteButton
              isActive={project.isFavorite}
              size={ButtonSize.Middle}
              onClick={handleFavoriteClick}
              loading={favoriteLoading}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsHeader;
