import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Formik } from 'formik';
import {useAuthState} from 'auth/auth.context';
import { postForgotPassword } from 'api/request.api';
import { AuthLayout } from 'layouts/auth.layout';
import { forgotPasswordValidation } from 'auth/auth.validation';
import { ReactComponent as LogoImg } from 'assets/icons/logo.svg';
import { ReactComponent as LoginLockIcon } from 'assets/images/login/lock-icon.svg';
import { ReactComponent as LoginShieldIcon } from 'assets/images/login/shield-icon.svg';

import Message from './inc/message';

const ForgotPassword = () => {
  return (
    <AuthLayout>
      <ForgotPasswordMainSection />
    </AuthLayout>
  );
};

export default ForgotPassword;

export const ForgotPasswordMainSection = () => {
  const {email} = useAuthState();
  const [status, setStatus] = useState<string>('initial');
  const [message, setMessage] = useState<string>('');
  const [isMessage, setIsMessage] = useState<boolean>(false);

  const handleDismiss = () => {
    setIsMessage(false);
  };

  const isErrorMessage = status === 'error' && isMessage;
  const isSuccessMessage = status === 'success' && isMessage;

  return (
    <div className='main-table-wrapper'>
      <div className=''>
        <div className='row login-wrapper'>
          <div className='guide-content'>
            <Link to='/'>
              <LogoImg className='icon auth-logo' />
            </Link>

            <div className='auth-left-content'>
              <h1>Three easy steps to get started with Money Minx</h1>
              <ul>
                <li>Find your accounts</li>
                <li>Connect it securely to Money Minx</li>
                <li>Let Money Minx do the rest</li>
              </ul>
              <div className='guide-bottom'>
                <h4>Serious about security</h4>
                <div className='guide-icon-wrap'>
                  <span className='locked-icon'>
                    <LoginLockIcon />
                  </span>
                  <p>The security of your information is our top priority</p>
                </div>
                <h4>Trusted by investors</h4>
                <div className='guide-icon-wrap'>
                  <span className='shield-icon'>
                    <LoginShieldIcon />
                  </span>
                  <p>Investors from all over the world are using Money Minx</p>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white credentials-wrapper'>
            <div className='credentials-content'>
              <div className='logo-img-wrapper'>
                <LogoImg className='auth-logo' />
              </div>
              <h2>Forgot Password?</h2>
              <p>Can’t log in? No worries, enter your email below and we will send you a password reset link.</p>

              <Formik
                initialValues={{ email }}
                validationSchema={forgotPasswordValidation}
                validateOnChange={false}
                onSubmit={async (values, actions) => {
                  const { error, data } = await postForgotPassword(values.email);
                  if (error) {
                    setStatus('error');
                    setIsMessage(true);
                    setMessage(error.message || '');
                  } else {
                    setStatus('success');
                    setIsMessage(true);
                    setMessage(data.message || '');
                  }
                  actions.setSubmitting(false);
                }}
              >
                {(props) => (
                  <div className='form-wrap'>
                    <form onSubmit={props.handleSubmit}>
                      <div className='align-items-start input-wrapper'>
                        <div className='email-wrap'>
                          <input
                            type='text'
                            className='email'
                            name='email'
                            value={props.values.email}
                            placeholder='Your Email'
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                          />
                        </div>
                        {props.errors.email && <div className='ml-2 mt-1 mt-md-3 feedback'>{props.errors.email}</div>}
                      </div>
                      <button
                        className='mm-btn-animate mm-btn-primary m-b-5'
                        type='submit'
                        disabled={props.isSubmitting}
                      >
                        Reset Password
                      </button>
                    </form>
                  </div>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      {isErrorMessage ? (
        <div>
          <Message type={status} message={message} onDismiss={handleDismiss} />
        </div>
      ) : null}

      {isSuccessMessage ? (
        <div>
          <Message type={status} message={message} onDismiss={handleDismiss} />
        </div>
      ) : null}
    </div>
  );
};
