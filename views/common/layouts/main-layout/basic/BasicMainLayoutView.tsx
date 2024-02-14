import { ReactNode, useMemo, useState } from 'react';
import cn from 'classnames';
import { Layout } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { Routes } from 'constants/routes';
import appConfig from 'config/appConfig';
import { useAuthRole, useWallet } from 'hooks';
import { IMainLayoutMenuLink } from 'types/components/layouts';
import { MainLogo, NavMenu, IconSvg } from 'components';
import FooterView from 'views/common/footer/FooterView';
import MainLayoutContext from './BasicMainLayoutContext';

//styles
import styles from './BasicMainLayoutView.module.scss';
import bgImage from 'resources/images/bg/tristan-main-layout.png';

interface IProps {
  sidebarActions?: ReactNode;
  menuLinks?: Array<IMainLayoutMenuLink>;
  children?: ReactNode;
}

const BasicMainLayoutView = ({ children, sidebarActions, menuLinks = [] }: IProps) => {
  const { userRole } = useAuthRole({ isRedirect: false });
  const { walletAddress } = useWallet({ isRedirect: false });
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [subFooter, setSubFooter] = useState<ReactNode | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  const { Sider, Content } = Layout;

  const menuItems = useMemo(() => {
    return menuLinks.filter(({ roles, isWalletRequired }) => {
      const isAllowedByRole = !roles || (userRole && roles.includes(userRole));
      const isAllowedByWallet = !isWalletRequired || !!walletAddress;
      return isAllowedByRole && isAllowedByWallet;
    });
  }, [menuLinks, userRole, walletAddress]);

  const context = useMemo(
    () => ({
      setSubFooter,
      setBackgroundImage,
    }),
    [setBackgroundImage, setSubFooter],
  );

  return (
    <MainLayoutContext.Provider value={context}>
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: backgroundImage ? `url("${backgroundImage}")` : `url("${bgImage}")` }}
      >
        <div className={styles.backgroundGradient}></div>
      </div>
      <div className={styles.mainGradient}>
        <div className={styles.container}>
          <Layout className={styles.layout}>
            <Sider trigger={null} collapsible collapsed={isCollapsed} className={styles.slider}>
              <div className={cn(styles.logoContainer, { [styles.logoContainerCollapsed]: isCollapsed })}>
                <Link to={Routes.home}>
                  {isCollapsed ? (
                    <div className={styles.collapsedLogo}>
                      c<span>c</span>
                    </div>
                  ) : (
                    <MainLogo className={styles.white} />
                  )}
                </Link>
                <span className={styles.trigger} onClick={() => setIsCollapsed(!isCollapsed)}>
                  {isCollapsed ? (
                    <div className={styles.collapsedTrigger}>
                      <IconSvg icon='arrowRight' />
                    </div>
                  ) : (
                    <MenuFoldOutlined />
                  )}
                </span>
              </div>
              <div className={cn(styles.labelBtnContainer, { [styles.hide]: isCollapsed })}>{sidebarActions}</div>
              <NavMenu items={menuItems} />
              <div className={styles.externalButtons}>
                <a
                  href={appConfig.bridgeUrl}
                  target='_blank'
                  className={cn(styles.externalButton, { [styles.externalButtonCollapsed]: isCollapsed })}
                  rel='noreferrer'
                >
                  <IconSvg icon='bridge' />
                  <span className={styles.externalButtonText}>CarbonBridge</span>
                </a>
                <a
                  href={appConfig.swapUrl}
                  target='_blank'
                  className={cn(styles.externalButton, { [styles.externalButtonCollapsed]: isCollapsed })}
                  rel='noreferrer'
                >
                  <IconSvg icon='dex' />
                  <span className={styles.externalButtonText}>CarbonDEX</span>
                </a>
                <a
                  href={appConfig.explorerUrl}
                  target='_blank'
                  className={cn(styles.externalButton, { [styles.externalButtonCollapsed]: isCollapsed })}
                  rel='noreferrer'
                >
                  <IconSvg icon='explorer' />
                  <span className={styles.externalButtonText}>CarbonExplorer</span>
                </a>
              </div>
            </Sider>
            <Layout className={styles.layoutContainer}>
              {/* <Header className={styles.siteLayoutBackground}></Header> */}
              <Content className={styles.content}>{children}</Content>
              <FooterView>{subFooter}</FooterView>
            </Layout>
          </Layout>
        </div>
      </div>
    </MainLayoutContext.Provider>
  );
};

export default BasicMainLayoutView;
