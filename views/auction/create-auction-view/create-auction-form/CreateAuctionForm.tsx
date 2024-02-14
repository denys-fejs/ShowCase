import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { AuctionSchema } from 'validators/auction';
import { IProjectDetailsResponseBody, IStoreModel, IUserProfileResponseBody, RowSpace } from 'types';
import { NotificationTypes, Routes, SocketEvents } from 'constants/index';
import { useFetch, useModal, useWallet } from 'hooks';
import { formatHashRequest, isAddressesEqual } from 'utils';
import {
  ActionModal,
  BlockLoader,
  Col,
  DatePickerInput,
  Form,
  FormField,
  FormSubmitButton,
  Notification,
  PrimaryButton,
  Row,
} from 'components';
import SocketContext from 'views/common/socket/SocketContext';

//styles
import styles from './CreateAuctionForm.module.scss';
import { Tooltip } from 'antd';

const CreateAuctionForm = () => {
  const { t } = useTranslation(['views/auction', 'common']);
  const [amountToSell, setAmountToSell] = useState<number>(0);
  const { tokenAddr } = useParams<{ tokenAddr: string }>();
  const history = useHistory();
  const { walletAddress } = useWallet({ isRedirect: false });
  const profile = useStoreState<IStoreModel, IUserProfileResponseBody | null>((store) => store.user.profile);
  const createAuction = useStoreActions<IStoreModel>((actions) => actions.auction.createAuction);
  const approveAllowance = useStoreActions<IStoreModel>((actions) => actions.auction.approveAllowance);
  const isAllowanceAuction = useStoreActions<IStoreModel>((actions) => actions.auction.isAllowanceAuction);
  const isLoading = useStoreState<IStoreModel>((store) => store.auction.isLoading);
  const isApproved = useStoreState<IStoreModel>((store) => store.auction.isApproved);
  const userProject = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>((store) => store.project.project);
  const { emit, subscribe } = useContext(SocketContext);
  const { isOpen, open, close } = useModal();

  const { response: balanceAllowance } = useFetch(async () => {
    return isAllowanceAuction(tokenAddr);
  }, [tokenAddr, isApproved]);

  const handleSubmit = async (values: any) => {
    try {
      if (!isAddressesEqual(walletAddress, profile?.accountAddress)) {
        Notification({
          notificationType: NotificationTypes.Error,
          message: t('common:errors.title'),
          description: t('auctionCreationError'),
        });
        return;
      }
      const response = await createAuction({ tokenAddr, ...values });

      if (response?.hash && subscribe && emit && userProject) {
        const txHash = formatHashRequest(response.hash);
        open();
        subscribe(SocketEvents.AuctionsInfo, ({ data, meta }) => {
          if (meta.txHash === txHash) {
            close();
            Notification({
              notificationType: NotificationTypes.Success,
              message: t('createAuction.auctionCreated'),
            });
            history.push(Routes.auction.replace(':auctionId', String(data.auctionId)));
          }
        });
        emit(SocketEvents.AuctionsNew, { txHash, projectId: Number(userProject.publicProjectId) });
      } else {
        Notification({
          notificationType: NotificationTypes.Success,
          message: t('createAuction.auctionCreated'),
        });
        history.push(Routes.myProject);
      }
    } catch (error) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('common:errors.title'),
        description: t(`common:errors.${error.message}`, error.message),
      });
    }
  };

  const approveHandler = async () => {
    try {
      if (!isAddressesEqual(walletAddress, profile?.accountAddress)) {
        Notification({
          notificationType: NotificationTypes.Error,
          message: t('common:errors.title'),
          description: t('auctionCreationError'),
        });
        return;
      }
      if (parseFloat(balanceAllowance.balance) < amountToSell) {
        Notification({
          notificationType: NotificationTypes.Error,
          message: t('common:errors.title'),
          description: t('approveAllowanceError'),
        });
        return;
      }
      await approveAllowance({ tokenAddr, amountToSell });
      Notification({
        notificationType: NotificationTypes.Success,
        message: t('createAuction.allowanceApproved'),
      });
    } catch (error) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('common:errors.title'),
        description: t(`common:errors.${error.message}`, error.message),
      });
    }
  };

  const tokenAllowance = parseFloat(balanceAllowance?.allowance);
  const allowanceCondition = tokenAllowance > 0 && amountToSell > 0 && tokenAllowance >= amountToSell;
  const createCondition = parseFloat(balanceAllowance?.balance) >= amountToSell;

  return (
    <>
      <Form validationSchema={AuctionSchema} onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Create auction</h1>
          <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
            <Col>
              <FormField
                name='amountToSell'
                placeholder={t('createAuction.amountToSell')}
                fieldlabel={t('createAuction.amountToSell')}
                onInput={(event: any) => setAmountToSell(parseFloat(event.target.value))}
                suffix={
                  !Number.isNaN(tokenAllowance) && (
                    <span>
                      {t('approvedAmount')} {tokenAllowance}
                    </span>
                  )
                }
                required
              />
            </Col>
            {allowanceCondition && (
              <>
                <Col>
                  <FormField
                    name='startPrice'
                    placeholder={t('createAuction.startPrice')}
                    fieldlabel={t('createAuction.startPrice')}
                    required
                  />
                  <Tooltip title='Minimum start price for 1 token in CC' mouseEnterDelay={0.5} placement='topLeft'>
                    <QuestionCircleOutlined className={styles.question} />
                  </Tooltip>
                </Col>
                <Col>
                  <FormField
                    name='endTime'
                    fieldlabel={t('createAuction.auctionEndTime')}
                    placeholder={t('createAuction.auctionEndTime')}
                    showTime
                    inputComponent={DatePickerInput}
                    required
                  />
                </Col>
              </>
            )}
            <div className={styles.actionButtonWrapper}>
              {allowanceCondition ? (
                <FormSubmitButton className={styles.btn} disabled={!createCondition}>
                  {t('createAuction.createAuction')}
                </FormSubmitButton>
              ) : (
                <PrimaryButton className={styles.approveBtn} onClick={approveHandler} isLoading={isLoading}>
                  {isLoading ? t('createAuction.approving') : t('createAuction.approve')}
                </PrimaryButton>
              )}
            </div>
          </Row>
        </div>
      </Form>
      <ActionModal isOpen={isOpen} close={close} centered footer={null} className={styles.loadingModal}>
        <BlockLoader isLoading={true} className={styles.loader} />
        <div className={styles.loadingTitle}>{t('createAuction.loadingMessage')}</div>
      </ActionModal>
    </>
  );
};

export default CreateAuctionForm;
