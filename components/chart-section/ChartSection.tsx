import { useTranslation } from 'react-i18next';
import MainTabs from '../tabs/MainTabs';
import { dataCarboncoin, dataProjects } from './mockedData';
import SecondaryButton from '../buttons/secondary-button/SecondaryButton';
import ChartComponent from './chart/Chart';

//styles
import styles from './ChartSection.module.scss';
import { useState } from 'react';

export enum PortfolioDataPeriod {
  Week = 'week',
  Day = 'day',
  Month = 'month',
  Year = 'year',
}

const ChartSection = () => {
  const { t } = useTranslation('views/portfolio');
  const [period, setPeriod] = useState<PortfolioDataPeriod>(PortfolioDataPeriod.Week);
  const projectsSum = {
    title1: t('chart.availableIncirculation'),
    value1: '999999.99 CC',
    title2: t('chart.haveBeenBurned'),
    value2: '5 000.99 t CO2',
  };
  const carboncoinSum = {
    title1: t('chart.accountBalance'),
    value1: '999999.99 CC',
    title2: t('chart.estimatedValue'),
    value2: '≈999999.99 CC',
  };

  const handleChange = (value: PortfolioDataPeriod) => {
    setPeriod(value);
  };

  return (
    <div className={styles.chartSectionContainer}>
      <MainTabs
        items={[
          {
            key: 'projects',
            title: t('chart.projects'),
            content: <ChartComponent data={dataProjects} info={projectsSum} type='projects' />,
            isShow: true,
          },
          {
            key: 'carbonCoin',
            title: t('chart.carbonCoin'),
            content: <ChartComponent data={dataCarboncoin} info={carboncoinSum} type='carbonCoin' />,
            isShow: true,
          },
        ]}
      />
      <div className={styles.btnsContainer}>
        <SecondaryButton
          className={period === PortfolioDataPeriod.Day ? styles.btnActive : styles.btn}
          onClick={() => handleChange(PortfolioDataPeriod.Day)}
        >
          1 Day
        </SecondaryButton>
        <SecondaryButton
          className={period === PortfolioDataPeriod.Week ? styles.btnActive : styles.btn}
          onClick={() => handleChange(PortfolioDataPeriod.Week)}
        >
          1 Week
        </SecondaryButton>
        <SecondaryButton
          className={period === PortfolioDataPeriod.Month ? styles.btnActive : styles.btn}
          onClick={() => handleChange(PortfolioDataPeriod.Month)}
        >
          1 Month
        </SecondaryButton>
        <SecondaryButton
          className={period === PortfolioDataPeriod.Year ? styles.btnActive : styles.btn}
          onClick={() => handleChange(PortfolioDataPeriod.Year)}
        >
          1 Year
        </SecondaryButton>
      </div>
    </div>
  );
};

export default ChartSection;
