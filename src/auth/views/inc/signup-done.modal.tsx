import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Modal } from 'common/components/modal';
import { useAuthDispatch, useAuthState } from 'auth/auth.context';
import { ReactComponent as SignupModalLogo } from 'assets/images/signup/signup-modal-logo.svg';

import { setLoginSuccess } from '../../auth.actions';

interface Props {
  signupModal: any;
  handleSuccess: () => void;
}

const SignUpDoneModal: React.FC<Props> = ({ signupModal, handleSuccess }) => {
  const dispatch = useAuthDispatch();
  const { expires, token } = useAuthState();

  useEffect(() => {
    dispatch(
      setLoginSuccess({
        expires: expires!,
        token: token!,
        onboarded: true,
      })
    );
  }, [dispatch, expires, token]);

  return (
    <Modal {...signupModal.props} title='Welcome to Money Minx' size='lg' onSuccess={handleSuccess} canBeClosed>
      <div className='modal-wrapper signup-modal'>
        <div className='signup-done-modal-logo'>
          <SignupModalLogo />
        </div>
        <p>
          Thanks for joining, we are thrilled to have you! Money Minx works best when you add all of your external
          accounts or track your accounts manually. Do you want to add more accounts now?
        </p>
        <div className='modal-btn-wrapper'>
          <button className='mm-btn-animate mm-btn-primary' onClick={handleSuccess}>
            Add more accounts
          </button>
          <div className='create-new-btn text-center'>
            <Link to='#' onClick={signupModal.close}>
              Go to Dashboard instead
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignUpDoneModal;
