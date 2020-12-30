import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from 'react';

import useToast from 'common/hooks/useToast';
import { MMCategories } from 'auth/auth.enum';
import MMToolTip from 'common/components/tooltip';
import { enumerateStr } from 'common/common-helper';
import useAccountType from 'auth/hooks/useAccountType';
import { Modal, ModalType } from 'common/components/modal';
import { CurrencyOptions } from 'auth/enum/currency-options';
import useAccountSubtype from 'auth/hooks/useAccountSubtype';
import { SelectInput } from 'common/components/input/select.input';
import { getConnectionInfo, postManualAccount } from 'api/request.api';
import { ReactComponent as InfoIcon } from 'assets/images/signup/info.svg';

import { AccountTypeSelectInput } from './account-type-select.input';

interface SettingModalProps {
  manualAccountModal: ModalType;
  handleSuccess: () => void;
}

const initialValues = {
  mmCategory: 'Other Assets',
  mmAccountType: '',
  mmAccountSubType: '',
  accountName: '',
  balance: '',
  currency: 'USD',
};

const ManualAccountModal: React.FC<SettingModalProps> = ({ manualAccountModal, handleSuccess }) => {
  const { mmToast } = useToast();
  const curArr = enumerateStr(CurrencyOptions);
  const [values, setValues] = useState(initialValues);
  const { data: accountTypes } = useAccountType(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const { subType: accountSubTypes } = useAccountSubtype(values.mmAccountType, true);

  const handleChange = (e: React.ChangeEvent<any>) => {
    if (e.target.name === 'mmAccountType') {
      return setValues({ ...values, [e.target.name]: e.target.value, mmAccountSubType: '' });
    }

    if (e.target.name === 'balance') {
      let _float = parseFloat(e.target.value);

      return setValues({ ...values, [e.target.name]: _float });
    }

    return setValues({ ...values, [e.target.name]: e.target.value });
  };

  const setAccountCategory = (cat: string) => {
    return setValues({ ...values, mmCategory: cat });
  };

  const handleCancel = () => {
    manualAccountModal.close();
    setValues(initialValues);
  };

  const handleSubmit = async () => {
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
    setValues(initialValues);
  }, [manualAccountModal]);

  useEffect(() => {
    if (!values.mmCategory || !values.mmAccountType || !values.accountName || !values.balance || !values.currency) {
      return setDisabled(true);
    }
    return setDisabled(false);
  }, [values]);

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
                placeholder='Lego Collection'
                onChange={handleChange}
                name='accountName'
                value={values.accountName}
              />
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
              </Form.Group>
              <Form.Group controlId='ManualAccountForm.AccountSubtype' className='child'>
                <Form.Label className='form-subheading'>Account Subtype</Form.Label>
                <AccountTypeSelectInput
                  args={accountSubTypes}
                  onChange={handleChange}
                  value={values.mmAccountSubType}
                  name='mmAccountSubType'
                />
              </Form.Group>
            </div>
            <div className='row-set'>
              <Form.Group controlId='ManualAccountForm.CurrentBalance' className='child'>
                <Form.Label className='form-subheading'>Current Value</Form.Label>
                <Form.Control
                  name='balance'
                  type='number'
                  placeholder='100.00'
                  onChange={handleChange}
                  value={values.balance}
                  required
                />
              </Form.Group>
              <Form.Group controlId='ManualAccountForm.Currency' className='child'>
                <Form.Label className='form-subheading'>Currency</Form.Label>
                <SelectInput args={curArr} onChange={handleChange} value={values.currency} name='currency' />
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
              disabled={disabled}
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
