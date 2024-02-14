import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { useAuthRole } from 'hooks';
import { IStoreModel, IUpdateProfileForm, IUserProfileResponseBody } from 'types';
import profileAPI from 'api/user/profileAPI';
import { NotificationTypes } from 'constants/index';
import { getErrorMessage } from 'utils';
import { CopyButton, Divider, IconSvg, MainLoader, Notification, TextInput } from 'components';

import BasicSearchHeader from '../common/headers/basic-search-header/BasicSearchHeader';

import UpdateUserFormView from './update-user-form/UpdateUserFormView';

import styles from './ProfileView.module.scss';
import ChangePasswordView from './change-password/ChangePasswordView';

const ProfileView = () => {
  const { t } = useTranslation('views/profile');
  useAuthRole({ isAuthRequired: true });

  const userProfile = useStoreState<IStoreModel, IUserProfileResponseBody | null>((store) => store.user.profile);
  const isProfileLoading = useStoreState<IStoreModel, boolean>((store) => store.user.isProfileLoading);
  const loadProfile = useStoreActions<IStoreModel>((actions) => actions.user.loadProfile);

  useEffect(loadProfile, []);

  const handleProfileUpdate = useCallback(
    async (values: IUpdateProfileForm) => {
      try {
        await profileAPI.updateMyProfile(values);
        await loadProfile();
        Notification({
          key: 'profileUpdate',
          notificationType: NotificationTypes.Success,
          message: t('form.successTitle'),
          description: t('form.successMessage'),
        });
      } catch (error) {
        Notification({
          key: 'profileUpdate',
          notificationType: NotificationTypes.Error,
          message: t('form.failTitle'),
          description: getErrorMessage(error),
        });
      }
    },
    [userProfile],
  );

  return (
    <MainLoader isLoading={isProfileLoading}>
      <BasicSearchHeader />
      <div className={styles.container}>
        <div className={styles.profileIcon}>
          <IconSvg icon='avatar' />
        </div>
        <div className={styles.userInfo}>
          <div>
            <TextInput
              placeholder={t('userInfo.walletAddress')}
              fieldlabel={t('userInfo.walletAddress')}
              prefix={<IconSvg icon='metamask' />}
              suffix={
                userProfile?.accountAddress && (
                  <CopyButton textToCopy={userProfile?.accountAddress} className={styles.copyButton}>
                    <></>
                  </CopyButton>
                )
              }
              value={userProfile?.accountAddress}
              field={{ value: userProfile?.accountAddress }}
              disabled
            />
          </div>
          <div>
            <TextInput
              placeholder={t('userInfo.email')}
              fieldlabel={t('userInfo.email')}
              prefix={<IconSvg icon='mail' />}
              value={userProfile?.email}
              field={{ value: userProfile?.email }}
              disabled
            />
          </div>
          <div>
            <ChangePasswordView />
          </div>
        </div>
        <Divider color='white' className={styles.divider} />
        <div className={styles.form}>
          <UpdateUserFormView onSubmit={handleProfileUpdate} />
        </div>
      </div>
    </MainLoader>
  );
};

export default ProfileView;
