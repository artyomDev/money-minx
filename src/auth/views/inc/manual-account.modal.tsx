import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { storage } from 'app/app.storage';
import useToast from 'common/hooks/useToast';
import { appRouteConstants } from 'app/app-route.constant';
import { Modal, ModalType } from 'common/components/modal';
import { CurrencyOptions } from 'auth/enum/currency-options';
import { enumerateStr } from 'common/common-helper';
import { getConnectionInfo, getManualAccountType, postManualAccount } from 'api/request.api';
import { SelectInput } from 'common/components/input/select.input';
import { AccountTypeSelectInput } from './account-type-select.input';

interface SettingModalProps {
  manualAccountModal: ModalType;
}

const initialValues = {
  yodleeAccountType: '',
  accountName: '',
  nickname: '',
  balance: '',
  accountNumber: '',
  currency: '',
};

const ManualAccountModal: React.FC<SettingModalProps> = ({ manualAccountModal }) => {
  const history = useHistory();
  const { mmToast } = useToast();
  const curArr = enumerateStr(CurrencyOptions);
  const [values, setValues] = useState(initialValues);
  const [AccountTypes, setAccountTypes] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  const handleChange = (e: React.ChangeEvent<any>) => {
    if (e.target.name === 'balance') {
      let _float = parseFloat(e.target.value);

      return setValues({ ...values, [e.target.name]: _float });
    }

    return setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    manualAccountModal.close();
    setValues(initialValues);
  };

  const handleSubmit = async () => {
    setLoading(true);
    values.nickname = values.accountName;
    const { data: res, error: err } = await postManualAccount(values);
    if (!err) {
      await getConnectionInfo();
      setValues(initialValues);
      setLoading(false);
      mmToast('Add Success', { type: 'success' });
      manualAccountModal.close();
      storage.set('isNew', 'true');
      return history.push(appRouteConstants.account.ACCOUNT.replace(':accountId', res.id));
    }

    console.log(err);
    setLoading(false);
    mmToast(' Add Failed', { type: 'error' });
  };

  const fetchAccountTypes = async () => {
    const { data, error } = await getManualAccountType();
    if (!error) {
      setAccountTypes(data);
    }
  };

  useEffect(() => {
    fetchAccountTypes();
  }, []);

  useEffect(() => {
    setValues(initialValues);
  }, [manualAccountModal]);

  useEffect(() => {
    if (!values.yodleeAccountType || !values.accountName || !values.balance || !values.currency) {
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
            <Form.Group controlId='ManualAccountForm.AccountName' className='child'>
              <Form.Label className='form-subheading'>Account Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Sapphire Credit Card'
                onChange={handleChange}
                name='accountName'
                value={values.accountName}
              />
            </Form.Group>
            <div className='row-set'>
              <Form.Group controlId='ManualAccountForm.AccountType' className='child'>
                <Form.Label className='form-subheading'>Account Type</Form.Label>
                <AccountTypeSelectInput
                  args={AccountTypes}
                  onChange={handleChange}
                  value={values.yodleeAccountType}
                  name='yodleeAccountType'
                />
              </Form.Group>
              <Form.Group controlId='ManualAccountForm.AccountNumber' className='child'>
                <Form.Label className='form-subheading'>Account Number</Form.Label>
                <Form.Control
                  name='accountNumber'
                  type='number'
                  placeholder='45432'
                  onChange={handleChange}
                  value={values.accountNumber}
                  required
                />
              </Form.Group>
            </div>
            <div className='row-set'>
              <Form.Group controlId='ManualAccountForm.CurrentBalance' className='child'>
                <Form.Label className='form-subheading'>Current Balance</Form.Label>
                <Form.Control
                  name='balance'
                  type='number'
                  placeholder='43233.32'
                  onChange={handleChange}
                  value={values.balance}
                  required
                />
              </Form.Group>
              <Form.Group controlId='ManualAccountForm.Currency' className='child'>
                <Form.Label className='form-subheading'>Currency</Form.Label>
                <SelectInput
                  args={curArr}
                  onChange={handleChange}
                  value={values.currency}
                  name='currency'
                />
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
