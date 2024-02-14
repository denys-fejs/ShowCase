import i18n from 'i18n';
import { ResponseError } from 'types';
import { NotificationTypes } from 'constants/index';
import { Notification } from 'components';
import { getServerErrorMessage } from 'utils';

type PromiseError = PromiseRejectionEvent & ResponseError;

class ErrorHandlerService {
  private isInitialized = false;

  constructor() {
    this.handleError = this.handleError.bind(this);
  }

  getErrorMessage(error: PromiseError): string {
    return (
      getServerErrorMessage(error) ||
      getServerErrorMessage(error.reason) ||
      error.reason?.message ||
      error.message ||
      i18n.t('errors.default')
    );
  }

  getErrorTitle(error: PromiseError): string {
    return error?.response?.data?.error || error?.reason?.response?.data?.error || i18n.t('errors.title');
  }

  handleError(error: PromiseRejectionEvent) {
    const title = this.getErrorTitle(error as PromiseError);
    const message = this.getErrorMessage(error as PromiseError);
    Notification({
      key: `error-${message}`,
      notificationType: NotificationTypes.Error,
      message: title,
      description: message,
    });
  }

  initialize() {
    if (!this.isInitialized) {
      window.addEventListener('unhandledrejection', this.handleError);
      this.isInitialized = true;
    }
  }

  stop() {
    if (this.isInitialized) {
      window.removeEventListener('unhandledrejection', this.handleError);
      this.isInitialized = false;
    }
  }
}

export default new ErrorHandlerService();
