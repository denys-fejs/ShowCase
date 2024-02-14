import { Fragment, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import appConfig from 'config/appConfig';
import { Routes } from 'constants/routes';

import styles from './FooterView.module.scss';

interface IProps {
  children?: ReactNode;
}

// TODO: Add correct routes
const footerLinks = [
  {
    label: 'terms',
    route: Routes.home,
  },
  {
    label: 'privacy',
    route: Routes.home,
  },
  {
    label: 'licenses',
    route: Routes.home,
  },
  {
    label: 'imprint',
    route: Routes.home,
  },
  {
    label: 'cookie',
    route: Routes.home,
  },
];
const divider = <span className={styles.divider}>|</span>;
const currentYear = new Date().getFullYear();

const FooterView = ({ children }: IProps) => {
  const { t } = useTranslation('views/common');

  const renderLinks = () => {
    const lastIndex = footerLinks.length - 1;
    return footerLinks.map(({ label, route }, index) => {
      return (
        <Fragment key={`footer-link-${index}-${label}`}>
          <Link to={route} className={styles.link}>
            {t(`footer.${label}`)}
          </Link>
          {index !== lastIndex && divider}
        </Fragment>
      );
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.menu}>
        <span>©{currentYear} CARBONCOIN</span>
        {divider}
        {renderLinks()}
        {divider}
        <span>v{appConfig.version}</span>
      </div>
      {children}
    </footer>
  );
};

export default FooterView;
