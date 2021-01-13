import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from 'react';

import MMToolTip from 'common/components/tooltip';
import useAccountType from 'auth/hooks/useAccountType';
import useToast from 'common/hooks/useToast';
import useAccountSubtype from 'auth/hooks/useAccountSubtype';
import useCurrentSubscription from 'auth/hooks/useCurrentSubscription';
import { MMCategories } from 'auth/auth.enum';
import { enumerateStr } from 'common/common-helper';
import { Modal, ModalType } from 'common/components/modal';
import { CurrencyOptions } from 'auth/enum/currency-options';
import { SelectInput } from 'common/components/input/select.input';
import { getConnectionInfo, postManualAccount } from 'api/request.api';
import { ReactComponent as InfoIcon } from 'assets/images/signup/info.svg';

import { AccountTypeSelectInput } from './account-type-select.input';

interface SettingModalProps {
  manualAccountModal: ModalType;
  handleSuccess: () => void;
}

export interface ValuesType {
  mmCategory: string;
  mmAccountType: string
  mmAccountSubType: string,
  accountName: string,
  balance: any,
  currency: string,
}

const initialValues: ValuesType = {
  mmCategory: 'Other Assets',
  mmAccountType: '',
  mmAccountSubType: '',
  accountName: '',
  balance: null,
  currency: 'USD',
};

const ManualAccountModal: React.FC<SettingModalProps> = ({ manualAccountModal, handleSuccess }) => {
  const { mmToast } = useToast();
  const curArr = enumerateStr(CurrencyOptions);
  const [values, setValues] = useState(initialValues);
  const { data: accountTypes } = useAccountType(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { subType: accountSubTypes } = useAccountSubtype(values.mmAccountType, true);
  const { currentSubscription } = useCurrentSubscription();
  const [accountNameError, setAccountNameError] = useState<boolean>(false);
  const [accountTypeError, setAccountTypeError] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<any>) => {
    if (e.target.name === 'mmAccountType') {
      return setValues({ ...values, [e.target.name]: e.target.value, mmAccountSubType: '' });
    }

    if (e.target.name === 'balance') {
      const _float = parseFloat(e.target.value);

      return setValues({ ...values, [e.target.name]: _float });
    }

    return setValues({ ...values, [e.target.name]: e.target.value });
  };


  useEffect(() => {
    if (submitted) {
      if (!values.accountName) {
        setAccountNameError(true);
      } else {
        setAccountNameError(false);
      }
      if (!values.mmAccountType) {
        setAccountTypeError(true);
      } else {
        setAccountTypeError(false);
      }
      if (!values.balance && values.balance !== 0) {
        setBalanceError(true);
      } else {
        setBalanceError(false);
      }
    } else {
      setAccountNameError(false);
      setAccountTypeError(false);
      setBalanceError(false);
    }
  }, [values, submitted]);

  const setAccountCategory = (cat: string) => {
    return setValues({ ...values, mmCategory: cat });
  };

  const handleCancel = () => {
    manualAccountModal.close();
    setValues(initialValues);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    let valid = true;
    if (!values.accountName) {
      setAccountNameError(true);
      valid = false;
    }
    if (!values.mmAccountType) {
      setAccountTypeError(true);
      valid = false;
    }
    if (!values.balance && values.balance !== 0) {
      setBalanceError(true);
      valid = false;
    }
    if (!valid) {
      return;
    }
    setLoading(true);
    const { error: err } = await postManualAccount(values);
    if (!err) {
      await getConnectionInfo();
      setValues(initialValues);
      setLoading(false);
      mmToast('Add Success', { type: 'success' });
      manualAccountModal.close();

      return handleSuccess();
    }

    setLoading(false);
    mmToast(' Add Failed', { type: 'error' });
  };

  useEffect(() => {
    if (manualAccountModal.props.open) {
      setSubmitted(false);
    }
    setValues(initialValues);
  }, [manualAccountModal]);

  return (
    <Modal
      {...manualAccountModal.props}
      title='Add Manual Accounts'
      size='lg'
      canBeClosed
      onClose={() => manualAccountModal.close()}
    >
      <div className='modal-wrapper mm-manual-account-modal'>
        <span className='description'>
          With manual accounts you can track any asset or liability that is not currently supported by our integration
          partners.
        </span>
        <div className='mm-manual-account-modal__title mt-3'>
          <Form className='mm-form'>
            <div className='account-category'>
              <span className='form-subheading'>
                Account Category
                <MMToolTip
                  placement='top'
                  message='Investment Assets are accounts you track as investments and may consider adding or reducing to your position, Other Assets are worth money but you do not trade them such as your checking account or primary residence, Liabilities are things you owe like loans, mortgages and credit cards.'
                >
                  <InfoIcon />
                </MMToolTip>
              </span>
              <ul className='category-list'>
                {enumerateStr(MMCategories).map((cat: string, idx: number) => {
                  return (
                    <li
                      className={values.mmCategory === cat ? 'active' : ''}
                      onClick={() => setAccountCategory(cat)}
                      role='button'
                      key={idx}
                    >
                      <span>{cat}</span>
                    </li>
                  );
                })}
                <div className='border-bg-slider' />
              </ul>
            </div>
            <Form.Group controlId='ManualAccountForm.AccountName' className='child'>
              <Form.Label className='form-subheading'>Account Name</Form.Label>
              <Form.Control
                type='text'
                onChange={handleChange}
                name='accountName'
                value={values.accountName}
                autoComplete='off'
              />
              {accountNameError &&
                <div className='mt-2 feedback'>
                  Account Name is a required field
              </div>}
            </Form.Group>
            <div className='row-set'>
              <Form.Group controlId='ManualAccountForm.AccountType' className='child'>
                <Form.Label className='form-subheading'>Account Type</Form.Label>
                <AccountTypeSelectInput
                  args={accountTypes}
                  onChange={handleChange}
                  value={values.mmAccountType}
                  name='mmAccountType'
                />
                {accountTypeError &&
                  <div className='mt-2 feedback'>
                    Account Type is a required field
                  </div>}
              </Form.Group>
              {accountSubTypes.length > 1 &&
                <Form.Group controlId='ManualAccountForm.AccountSubtype' className='child'>
                  <Form.Label className='form-subheading'>Account Subtype</Form.Label>
                  <AccountTypeSelectInput
                    args={accountSubTypes}
                    onChange={handleChange}
                    value={values.mmAccountSubType}
                    name='mmAccountSubType'
                  />
                </Form.Group>
              }
            </div>
            <div className='row-set'>
              <Form.Group controlId='ManualAccountForm.CurrentBalance' className='child'>
                <Form.Label className='form-subheading'>Current Value</Form.Label>
                <Form.Control
                  name='balance'
                  type='number'
                  onChange={handleChange}
                  value={values.balance}
                  required
                />
                {balanceError &&
                  <div className='mt-2 feedback'>
                    Current Value is a required field
                  </div>}
              </Form.Group>
              <Form.Group controlId='ManualAccountForm.Currency' className='child'>
                <Form.Label className='form-subheading'>Currency</Form.Label>
                {currentSubscription &&
                  (currentSubscription.name === 'Green' || currentSubscription.name === 'Plus') ? (
                    <span className='mm-form-field-read'>{values.currency}</span>
                  ) : (
                    <SelectInput
                      args={curArr}
                      onChange={handleChange}
                      value={values.currency}
                      name='currency'
                    />
                  )}
                {currentSubscription && (currentSubscription.name === 'Green' || currentSubscription.name === 'Plus') && (
                  <label className='mm-form-field-error text--pink'>
                    Your plan only supports USD. To enable multi currency support upgrade your plan.
                  </label>
                )}
              </Form.Group>
            </div>
          </Form>
          <div className='action-wrapper mt-3'>
            <button className='btn-outline-primary mm-btn-animate' onClick={handleCancel}>
              Cancel
            </button>
            <button
              className='mm-btn-animate mm-btn-primary d-flex align-items-center justify-content-center'
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <span className='spinner-grow spinner-grow-sm' role='status' aria-hidden='true' />
                  <span className='ml-1'>Adding...</span>
                </>
              ) : (
                  <>
                    Add<span className='hide-sm ml-1'>Account</span>
                  </>
                )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ManualAccountModal;
