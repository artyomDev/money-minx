import React from 'react';
import { Link } from 'react-router-dom';

import { useAuthState } from 'auth/auth.context';
import { Modal, ModalType } from 'common/components/modal';
import CircularSpinner from 'common/components/spinner/circular-spinner';
import { ReactComponent as LogoImg } from 'assets/icons/logo.svg';

interface Props {
  accountAddedModal: ModalType;
  handleSuccess: () => void;
}

const AccountAddedModal: React.FC<Props> = ({ accountAddedModal, handleSuccess }) => {
  const { accounts } = useAuthState();
  const [account] = accounts;
  if (!account) {
    return <CircularSpinner />;
  }

  return (
    <Modal {...accountAddedModal.props} title='Account Added!' size='lg' onSuccess={handleSuccess} canBeClosed>
      <div className='modal-wrapper signup-modal'>
        <div className='signup-done-modal-logo'>
          {account.providerLogo ? <img src={account.providerLogo} alt={`${account.accountName}`} /> : <LogoImg className='icon auth-logo' />}
        </div>
        <p>
          Money Minx works best when you add all of your accounts so you see your full financial picture. Do you want to
          add more accounts now?
        </p>
        <div className='modal-btn-wrapper'>
          <button className='mm-btn-animate mm-btn-primary' onClick={handleSuccess}>
            Add more accounts
          </button>
          <div className='create-new-btn text-center'>
            <Link to='#' onClick={accountAddedModal.close}>
              Go to Dashboard instead
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AccountAddedModal;
