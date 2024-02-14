import { ComponentType, memo, ReactNode, useEffect } from 'react';
import { FieldAttributes, useFormikContext } from 'formik';

import FormField from '../form-field/FormField';
import { IBasicInputProps, Icons } from 'types';
import { getPriceForToken } from 'utils';

interface IProps extends FieldAttributes<any> {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  inputComponent?: ComponentType<IBasicInputProps<any> & any>;
  disabled?: boolean;
  required?: boolean;
  fieldlabel?: string;
  icon?: Icons;
  defaultValue?: string | number | boolean;
}

interface MakeBidInterface {
  amountToBuy: string;
  ccToBid: string;
  priceForToken: string;
}

const CalculatedFormField = (props: IProps) => {
  const { values, touched, setFieldValue } = useFormikContext();

  useEffect(() => {
    const formValues = values as MakeBidInterface;
    const touchedValues = touched as MakeBidInterface;

    const amount = formValues.amountToBuy && parseFloat(formValues.amountToBuy);
    const bid = formValues.ccToBid && parseFloat(formValues.ccToBid);

    if (touchedValues.ccToBid && touchedValues.amountToBuy && !amount && !bid) {
      setFieldValue('priceForToken', null);
    }

    if (amount && bid && !touchedValues.priceForToken) {
      setFieldValue('priceForToken', getPriceForToken(bid, amount));
    }
  }, [values]);

  return <FormField {...props} />;
};

export default memo(CalculatedFormField);
