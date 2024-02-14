import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useFetch from 'hooks/useFetch';
import adminChartsAPI from 'api/admin/adminChartsAPI';
import { RegistrationChartRange } from 'types/api/admin/charts';
import { RowSpace } from 'types/components/grid';
import { formatDate } from 'utils/formatDate';
import BasicCard from 'components/cards/basic-card/BasicCard';
import { ChartLegend, Col, LineChart, MainLoader, PickButton, Row } from 'components';

import styles from './RegistrationChartView.module.scss';

const projectChartColor = '#6BBBAE';
const companyChartColor = '#F7B500';
const ranges = Object.values(RegistrationChartRange);

const RegistrationChartView = () => {
  const { t } = useTranslation('views/admin');
  const [activeRange, setActiveRange] = useState(ranges[0]);

  const { loading, response } = useFetch(() => {
    return adminChartsAPI.getRegistrationChart({ range: activeRange });
  }, [activeRange]);

  const data = useMemo(() => {
    return [
      {
        color: projectChartColor,
        values: response?.project.values || [],
      },
      {
        color: companyChartColor,
        values: response?.company.values || [],
      },
    ];
  }, [response]);

  const axis = useMemo(() => {
    return (
      response?.axis.map((date) => {
        switch (activeRange) {
          case RegistrationChartRange.Day:
            return formatDate(date, 'H:00');

          case RegistrationChartRange.Week:
            return formatDate(date, 'E MM/d');

          case RegistrationChartRange.Month:
            return formatDate(date, 'MM/d');

          case RegistrationChartRange.Year:
            return formatDate(date, 'MMM, y');
        }
      }) || []
    );
  }, [response]);

  const labels = useMemo(() => {
    return [t('dashboard.chart.projects'), t('dashboard.chart.companies')];
  }, [t]);

  return (
    <div className={styles.container}>
      <BasicCard
        title={t('dashboard.chart.title')}
        extra={
          <Row horizontalSpace={RowSpace.Small}>
            {ranges.map((range) => (
              <Col key={`chart-range-${range}`} flexible>
                <PickButton active={range === activeRange} onClick={() => setActiveRange(range)}>
                  {t(`dashboard.chart.range.${range}`)}
                </PickButton>
              </Col>
            ))}
          </Row>
        }
      >
        <MainLoader isLoading={loading}>
          {response && (
            <Row>
              <Col xl={6} lg={8}>
                <div className={styles.legends}>
                  <ChartLegend
                    title={t('dashboard.chart.totalUsers')}
                    value={response.project.total + response.company.total}
                    size='large'
                  />
                  <ChartLegend
                    title={t('dashboard.chart.totalProjects')}
                    value={response.project.total}
                    color={projectChartColor}
                  />
                  <ChartLegend
                    title={t('dashboard.chart.totalCompanies')}
                    value={response.company.total}
                    color={companyChartColor}
                  />
                </div>
              </Col>
              <Col xl={18} lg={16}>
                <LineChart data={data} labels={labels} axis={axis} />
              </Col>
            </Row>
          )}
        </MainLoader>
      </BasicCard>
    </div>
  );
};

export default RegistrationChartView;
