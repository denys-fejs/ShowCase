import { Component, ReactNode } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import ErrorHandlerService from './ErrorHandlerService';

interface IProps extends RouteComponentProps {
  errorRoute: string;
  children: ReactNode;
}

class ErrorHandler extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
    ErrorHandlerService.initialize();
  }

  componentWillUnmount() {
    ErrorHandlerService.stop();
  }

  componentDidCatch() {
    this.props.history.push(this.props.errorRoute);
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ErrorHandler);
