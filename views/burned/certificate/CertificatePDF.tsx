import { Text, Page, View, Link, Document, StyleSheet } from '@react-pdf/renderer';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { useTranslation } from 'react-i18next';

import appConfig from 'config/appConfig';
import { IBurnedTokensResponseBody } from 'types';
import { formatAddress, formatDateDay, insertAt } from 'utils';

const styles = StyleSheet.create({
  page: { paddingHorizontal: 35, paddingVertical: 35, color: '#101820' },

  header: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 18,
    borderBottom: 1,
    borderColor: '#D1D3D4',
    maxWidth: '100%',
    paddingBottom: 10,
    marginBottom: 10,
  },

  logo: {
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 800,
  },

  logoHighlighted: {
    color: '#6BBBAE',
    fontWeight: 'bold',
  },

  title: {
    marginLeft: 10,
  },

  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
  },

  grid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  row: {
    marginTop: 4,
  },

  rowRight: {
    textAlign: 'right',
  },

  column: {
    width: '47%',
  },

  label: {
    fontSize: 8,
    color: '#3a3a3a',
  },

  value: {
    fontSize: 10,
    margin: '6px 0 8px 0',
    color: '#101820',
  },

  link: {
    fontSize: 10,
    margin: '6px 0 8px 0',
    color: '#6BBBAE',
    textDecoration: 'none',
    wordBreak: 'break-all',
  },

  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 240,
  },
});

interface IProps {
  burnedTokens: IBurnedTokensResponseBody;
  transaction: TransactionResponse;
  creationDate?: Date;
}

const CertificatePDF = ({ burnedTokens, transaction, creationDate }: IProps) => {
  const { t } = useTranslation(['views/burned', 'common']);
  const { certId, amount, burnDate, txHash, project } = burnedTokens;
  const address = formatAddress(project);
  const projectRegistrationDate = formatDateDay(String(project.createdAt));
  const certBurnDate = formatDateDay(String(burnDate));
  const certCreationDate = formatDateDay(String(creationDate));

  return (
    <Document>
      <Page style={styles.page} size='A4' wrap>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text>CARBON</Text>
            <Text style={styles.logoHighlighted}>COIN</Text>
          </View>
          <View style={styles.title}>
            <Text>{t('certificate.pdf.title', { certId })}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('certificate.pdf.project')}</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.projectName')}</Text>
              <Text style={styles.value}>{project.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.company')}</Text>
              <Text style={styles.value}>{project.companyName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.address')}</Text>
              <Text style={styles.value}>{address}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.registrationDate')}</Text>
              <Text style={styles.value}>{projectRegistrationDate}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.tokenName')}</Text>
              <Text style={styles.value}>{project.tokenName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.tokenAddress')}</Text>
              <Link src={`${appConfig.explorerUrl}/address/${project.tokenAddr}`} style={styles.link}>
                {project.tokenAddr}
              </Link>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.projectType')}</Text>
              <Text style={styles.value}>{project.projectType}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.standard')}</Text>
              <Text style={styles.value}>{project.standard}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.methodology')}</Text>
              <Text style={styles.value}>{project.methodology}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.auditStatus')}</Text>
              <Text style={styles.value}>{t(`common:project.status.${project.auditStatus}`, '-')}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.tokenSymbol')}</Text>
              <Text style={styles.value}>{project.tokenTicker}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('certificate.pdf.certification')}</Text>
        <View style={styles.grid}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.certificateId')}</Text>
              <Text style={styles.value}>{certId}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.issuerAddress')}</Text>
              <Link src={`${appConfig.explorerUrl}/address/${transaction.from}`} style={styles.link}>
                {transaction.from}
              </Link>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.transaction')}</Text>
              <Link src={`${appConfig.explorerUrl}/tx/${txHash}`} style={styles.link}>
                {insertAt(txHash, '\n', 45)}
              </Link>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.tokensBurned')}</Text>
              <Text style={styles.value}>{amount}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.equivalent')}</Text>
              <Text style={styles.value}>{amount} t CO2</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.burnDate')}</Text>
              <Text style={styles.value}>{certBurnDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('certificate.pdf.generatedBy')}</Text>
              <Link src={window.location.origin} style={styles.link}>
                CarbonCoin Platform
              </Link>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.rowRight}>
              <Text style={styles.label}>{t('certificate.pdf.date')}</Text>
              <Text style={styles.value}>{certCreationDate}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CertificatePDF;
