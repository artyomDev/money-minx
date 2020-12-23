import moment from 'moment';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import useToast from 'common/hooks/useToast';
import { useAuthState } from 'auth/auth.context';
import { useModal } from 'common/components/modal';
import useSettings from 'setting/hooks/useSettings';
import SaveSettings from 'setting/inc/save-settings';
import { CurrencyOptions } from 'auth/enum/currency-options';
import { capitalize, enumerateStr } from 'common/common-helper';
import { SelectInput } from 'common/components/input/select.input';
import ChangePasswordModal from 'setting/inc/change-password.modal';
import useCurrentSubscription from 'auth/hooks/useCurrentSubscription';
import CircularSpinner from 'common/components/spinner/circular-spinner';
import SubscriptionCancelModal from 'setting/inc/subscription-cancel.modal';
import { CurrentSubscription, SettingPageEnum } from 'setting/setting.type';
import { patchCancelSubscription, patchEmailSubscription } from 'api/request.api';

import Message from '../../auth/views/inc/message';

interface SettingOverviewProps {
  changeTab: (pageName: SettingPageEnum) => void;
}

export const SettingOverview: React.FC<SettingOverviewProps> = ({ changeTab }) => {
  const { user } = useAuthState();
  const { mmToast } = useToast();
  const changePasswordModal = useModal();
  const subscriptionCancelModal = useModal();
  const { loading, data, error } = useSettings();
  const [statusText, setStatusText] = useState('Save Changes');
  const [mailChimpSubscription, setMailChimpSubscription] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('USD');
  const { fetchingCurrentSubscription, currentSubscription } = useCurrentSubscription();
  const [cancelSubscriptionResponse, setCancelSubscriptionResponse] = useState<CurrentSubscription>();
  const [cancelSubscriptionError, setCancelSubscriptionError] = useState<boolean>(false);
  const cancelAtDate = cancelSubscriptionResponse?.cancelAt ? cancelSubscriptionResponse?.cancelAt / 86400 : 0;
  const curArr = enumerateStr(CurrencyOptions);

  useEffect(() => {
    if (data) {
      setMailChimpSubscription(data.mailChimpSubscription);
      setCurrency(data.currency);
    }
  }, [data]);

  if (error) {
    mmToast('Error on fetching settings');
  }

  if (loading || fetchingCurrentSubscription) {
    return <CircularSpinner />;
  }

  const handleCancelSubscription = async () => {
    return subscriptionCancelModal.open();
  };

  const handleCancelSubscriptionConfirmation = async () => {
    const { error: patchError, data: response } = await patchCancelSubscription();
    if (!patchError) {
      setCancelSubscriptionResponse(response);
    } else {
      setCancelSubscriptionError(true);
    }
    return subscriptionCancelModal.close();
  };

  const handleDismiss = () => { };

  const handleSave = async () => {
    setStatusText('Saving...');
    const { error: pathError } = await patchEmailSubscription({ mailChimpSubscription, currency });
    if (pathError) {
      return mmToast('Error on Adding Subscription', { type: 'error' });
    }
    setStatusText('Saved');
    setTimeout(() => {
      setStatusText('Save Changes');
    }, 1000);
  };

  return (
    <section>
      <div className='card mm-setting-card'>
        <div className='card-body'>
          <form>
            <div className='mm-setting-card--title'>Preferences</div>
            <div className='mm-setting-form form-group mt-3 mb-5 row align-items-center'>
              <label className='col-sm-3 col-md-3 mb-0'>Base currency</label>
              <div className='col-sm-3 col-md-3'>
                <div className='form-wrap currency-select'>
                  {currentSubscription &&
                    (currentSubscription.name === 'Green' || currentSubscription.name === 'Plus') ? (
                      <span>{currency}</span>
                    ) : (
                      <SelectInput
                        args={curArr}
                        onChange={(e) => setCurrency(e.target.value)}
                        value={currency}
                        name='currency'
                      />
                    )}
                </div>
              </div>
              {currentSubscription && (currentSubscription.name === 'Green' || currentSubscription.name === 'Plus') && (
                <label className='col-sm-6 col-md-6 text-danger'>
                  Your plan only supports USD. To enable multi currency support upgrade your plan.
                </label>
              )}
            </div>
            <div className='mm-setting-form form-group mt-3 row'>
              <label className='col-sm-3 col-md-3'>Notifications</label>
              <div className='col-sm-9 col-md-9'>
                <div className='form-wrap'>
                  <span className='checkbox-item'>
                    <label className='check-box'>
                      Get our diversified investor newsletter
                      <input
                        type='checkbox'
                        className='newsletter-checkbox'
                        name='mailChimpSubscription'
                        value='true'
                        aria-checked={mailChimpSubscription}
                        checked={mailChimpSubscription}
                        onChange={() => setMailChimpSubscription(!mailChimpSubscription)}
                      />
                      <span className='geekmark' />
                    </label>
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className='card mm-setting-card'>
        <div className='card-body'>
          <form>
            <div className='mm-setting-card--title'>Security</div>
            <div className='mm-setting-form row'>
              <label className='col-5 col-md-3 col-form-label'>Email Address</label>
              <span className='col-7 col-md-4 mm-setting-form-info col-form-label ml-0 mb-4'>{user?.email}</span>
            </div>
            <div className='mm-setting-form form-group row'>
              <label className='col-5 col-md-3 col-form-label'>Password</label>
              <span className='col-7 col-md-3 mm-setting-form-info col-form-label ml-0 mb-4'>
                <svg width='118' height='6' viewBox='0 0 118 6' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M6 3C6 4.65685 4.65685 6 3 6C1.34315 6 0 4.65685 0 3C0 1.34315 1.34315 0 3 0C4.65685 0 6 1.34315 6 3Z'
                    fill='#969EAC'
                  />
                  <path
                    d='M20 3C20 4.65685 18.6569 6 17 6C15.3431 6 14 4.65685 14 3C14 1.34315 15.3431 0 17 0C18.6569 0 20 1.34315 20 3Z'
                    fill='#969EAC'
                  />
                  <path
                    d='M34 3C34 4.65685 32.6569 6 31 6C29.3431 6 28 4.65685 28 3C28 1.34315 29.3431 0 31 0C32.6569 0 34 1.34315 34 3Z'
                    fill='#969EAC'
                  />
                  <path
                    d='M48 3C48 4.65685 46.6569 6 45 6C43.3431 6 42 4.65685 42 3C42 1.34315 43.3431 0 45 0C46.6569 0 48 1.34315 48 3Z'
                    fill='#969EAC'
                  />
                  <path
                    d='M62 3C62 4.65685 60.6569 6 59 6C57.3431 6 56 4.65685 56 3C56 1.34315 57.3431 0 59 0C60.6569 0 62 1.34315 62 3Z'
                    fill='#969EAC'
                  />
                  <path
                    d='M76 3C76 4.65685 74.6569 6 73 6C71.3431 6 70 4.65685 70 3C70 1.34315 71.3431 0 73 0C74.6569 0 76 1.34315 76 3Z'
                    fill='#969EAC'
                  />
                  <path
                    d='M90 3C90 4.65685 88.6569 6 87 6C85.3431 6 84 4.65685 84 3C84 1.34315 85.3431 0 87 0C88.6569 0 90 1.34315 90 3Z'
                    fill='#969EAC'
                  />
                  <path
                    d='M104 3C104 4.65685 102.657 6 101 6C99.3431 6 98 4.65685 98 3C98 1.34315 99.3431 0 101 0C102.657 0 104 1.34315 104 3Z'
                    fill='#969EAC'
                  />
                  <path
                    d='M118 3C118 4.65685 116.657 6 115 6C113.343 6 112 4.65685 112 3C112 1.34315 113.343 0 115 0C116.657 0 118 1.34315 118 3Z'
                    fill='#969EAC'
                  />
                </svg>
              </span>

              <div className='col-12 col-md-6'>
                <button
                  type='button'
                  className='mm-btn-settings mm-btn-animate float-right'
                  onClick={() => changePasswordModal.open()}
                >
                  Change Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className='card mm-setting-card'>
        <div className='card-body'>
          <form>
            <div className='mm-setting-card--title'>Subscription</div>
            <div className='mm-setting-form form-group row mt-3'>
              <label className='col-5 col-md-3 col-form-label'>Current Plan</label>
              <span className='col-7 col-md-4 mm-setting-form-info col-form-label ml-0 mb-4'>
                {capitalize(currentSubscription?.name || 'FREE')}
              </span>
              <div className='col-12 col-md-5'>
                <button
                  type='button'
                  className='mm-btn-settings mm-btn-animate float-right'
                  onClick={() => changeTab(SettingPageEnum.PLAN)}
                >
                  Change Plan
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='card mm-setting-card'>
        <div className='card-body'>
          <Link className='mm-setting-card--subscription red-links' to='#' onClick={handleCancelSubscription}>
            Cancel Subscription
          </Link>
        </div>
      </div>
      <ChangePasswordModal changePasswordModal={changePasswordModal} />
      <SubscriptionCancelModal
        subscriptionCancelModal={subscriptionCancelModal}
        subscriptionEnd={currentSubscription?.subscriptionEnd}
        handleCancelSubscriptionConfirmation={handleCancelSubscriptionConfirmation}
      />

      {cancelSubscriptionError || cancelSubscriptionResponse ? (
        <div className='subscription-cancel-confirmation'>
          <Message
            type={cancelSubscriptionError ? 'error' : 'success'}
            message={
              cancelSubscriptionError
                ? 'Your subscription could not be cancelled. Please contact us for support.'
                : `Your subscription is now cancelled. You can continue using Money Minx until ${moment('01-01-1970')
                  .add(cancelAtDate, 'days')
                  .format('MM/DD/YY')}.`
            }
            onDismiss={handleDismiss}
          />
        </div>
      ) : null}
      <SaveSettings handleSave={handleSave} statusText={statusText} />
    </section>
  );
};

export default SettingOverview;
