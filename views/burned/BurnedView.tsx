import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import React, { useCallback, useMemo, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { useLocation } from 'react-router';
import pick from 'lodash.pick';

import {
  IAccountTxResponseBody,
  IBurnedTokensResponseBody,
  IPaginationResponse,
  IProjectDetailsResponseBody,
  IStoreModel,
} from 'types';
import burnAPI from 'api/burn/burnAPI';
import appConfig from 'config/appConfig';
import { DEFAULT_PAGE_SIZE, Routes } from 'constants/index';
import { useFetchCallback } from 'hooks';
import { formatDateDayLocale, formatLongString, formatTxHash, getCertificateFileName, parseQueryParams } from 'utils';
import { IconSvg, Table } from 'components';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import FilterProvider from 'views/common/filter/FilterProvider';
import BurnedFilerView from 'views/burned/filter/BurnedFilterView';
import defaultCoverImg from 'resources/images/bg/tristan-1.png';

//styles
import styles from './BurnedView.module.scss';

const BurnedView = () => {
  const walletAddress = useStoreState<IStoreModel, string | undefined>((store) => store.user.profile?.accountAddress);
  const { t } = useTranslation('views/burned');
  const location = useLocation();

  const [page, setPage] = useState(1);
  const { response, loading, fetchCallback } = useFetchCallback<IPaginationResponse<IBurnedTokensResponseBody>>(
    (params) => {
      return walletAddress
        ? burnAPI.getBurned(walletAddress, {
            page,
            limit: DEFAULT_PAGE_SIZE,
            ...pick(params, ['search', 'amount', 'burnDate']),
          })
        : null;
    },
    [walletAddress, page],
  );

  const renderDocumentLink = (burnedTokens: IBurnedTokensResponseBody) => {
    return (
      <Link
        to={Routes.certificate.replace(':id', String(burnedTokens.certId))}
        className={styles.documentDownload}
        onClick={(e) => e.stopPropagation()}
      >
        {formatLongString(getCertificateFileName(burnedTokens))}
        <IconSvg icon='download' />
      </Link>
    );
  };

  const renderNameWithPic = (project: IProjectDetailsResponseBody | undefined) => {
    return project ? (
      <div className={styles.nameCell}>
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${project.coverImage ? project.coverImage : defaultCoverImg}` }}
        />
        {project?.tokenName}
      </div>
    ) : (
      ''
    );
  };

  const handleTxClick = useCallback((at: IAccountTxResponseBody) => {
    window.open(`${appConfig.explorerUrl}/tx/${at.txHash}`, '_blank');
  }, []);

  const columns = useMemo(
    () => [
      {
        title: t('table.name'),
        key: 'name',
        render: (at: IBurnedTokensResponseBody) => renderNameWithPic(at.project),
        width: 220,
      },
      {
        title: t('table.tokens'),
        key: 'amount',
        dataIndex: 'amount',
      },
      {
        title: t('table.date'),
        key: 'date',
        render: (at: IBurnedTokensResponseBody) => formatDateDayLocale(at.burnDate),
      },
      {
        title: t('table.txHash'),
        key: 'txHash',
        dataIndex: 'txHash',
        render: (hash: string) => formatTxHash(hash),
      },
      {
        title: t('table.certificate'),
        key: 'createdAt',
        render: renderDocumentLink,
        maxWith: 350,
      },
    ],
    [t],
  );

  return (
    <>
      <BasicSearchHeader />
      <SectionHeader className={styles.title}>{t('title')}</SectionHeader>
      <FilterProvider fetchData={fetchCallback} dependencies={[page, walletAddress]}>
        <BurnedFilerView />
      </FilterProvider>
      <div className={styles.table}>
        <Table
          columns={columns}
          refresh={() => fetchCallback(parseQueryParams(location.search))}
          data={response?.items}
          page={page}
          total={response?.meta.totalItems}
          onRowClick={handleTxClick}
          tab={t('burnedTokens')}
          bigPlaceholder={true}
          loading={loading}
          onPageChange={setPage}
        />
      </div>
    </>
  );
};

export default BurnedView;
