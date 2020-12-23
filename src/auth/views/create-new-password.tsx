import React, { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';

import { Formik } from 'formik';
import useParam from 'common/hooks/useParam';
import useToast from 'common/hooks/useToast';
import { AuthLayout } from 'layouts/auth.layout';
import { appRouteConstants } from 'app/app-route.constant';
import { resetPasswordValidation } from 'auth/auth.validation';
import { ReactComponent as LogoImg } from 'assets/icons/logo.svg';
import { ReactComponent as HiddenIcon } from 'assets/icons/pass-hidden.svg';
import { postResetPassword, checkResetPasswordToken } from 'api/request.api';
import { ReactComponent as VisibleIcon } from 'assets/icons/pass-visible.svg';
import { ReactComponent as LoginLockIcon } from 'assets/images/login/lock-icon.svg';
import { ReactComponent as LoginShieldIcon } from 'assets/images/login/shield-icon.svg';

const CreateNewPassword = () => {
  return (
    <AuthLayout>
      <CreateNewPasswordMainSection />
    </AuthLayout>
  );
};

export const CreateNewPasswordMainSection = () => {
  const { token } = useParam();
  const history = useHistory();
  const [validator, setValidator] = useState<number>(0);
  const { mmToast } = useToast();

  const [visible, setVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = () => {
    setVisible({ ...visible, password: !visible.password });
  };

  const toggleConfirmPasswordVisibility = () => {
    setVisible({ ...visible, confirmPassword: !visible.confirmPassword });
  };

  const checkPasswordIsAlive = async () => {
    const {
      data: { expired },
      error,
    } = await checkResetPasswordToken({ token });

    if (error || expired) {
      history.push(appRouteConstants.auth.TOKEN_EXPIRED);
    }
  };

  useEffect(() => {
    if (token) {
      checkPasswordIsAlive();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const reg1 = /^.{8,}$/;
  const reg2 = /(^.*\d+.*$)/;
  const reg3 = /(^.*[@$!%*#?&].*$)/;
  const reg4 = /(^.*[A-Z].*$)/;

  const getValidationText = () => {
    if (validator < 2) {
      return {
        text: 'Weak',
        classNames: 'text-danger ',
      };
    }
    if (validator < 3) {
      return {
        text: 'Medium',
        classNames: 'text-warning',
      };
    }

    return {
      text: 'Strong',
      classNames: 'text-success',
    };
  };

  if (!token) {
    return <Redirect to={appRouteConstants.auth.FORGOT_PASSWORD} />;
  }

  const getVisibilityIcon = (field: 'password' | 'confirmPassword') => {
    if (visible[field]) {
      return <VisibleIcon />;
    }
    return <HiddenIcon />;
  };

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
                <h2>Serious about security</h2>
                <div className='guide-icon-wrap'>
                  <span className='locked-icon'>
                    <LoginLockIcon />
                  </span>
                  <p>The security of your information is our top priority</p>
                </div>
                <h2>Trusted by investors</h2>
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
              <Link to='/' className='logo-img-wrapper'>
                <LogoImg className='auth-logo' />
              </Link>
              <h2>Create new Password</h2>
              <p>One last step. Enter a new password below and you should be good to go.</p>
              <Formik
                initialValues={{ password: '', confirmPassword: '' }}
                validate={async (values) => {
                  if (!values.password) {
                    return {};
                  }

                  let a = 0;
                  let errors: Record<string, any> = {};
                  [reg1, reg2, reg3, reg4].forEach((reg) => (reg.test(values.password) ? (a += 1) : a));
                  setValidator(a);

                  try {
                    await resetPasswordValidation.validate(values, { abortEarly: false });
                  } catch (errs) {
                    const mappedError = errs.inner.reduce((obj: Record<string, any>, cur: any) => {
                      obj[cur.path] = cur.message;
                      return obj;
                    }, {});

                    errors = mappedError;
                  }
                  return errors;
                }}
                onSubmit={async (values, actions) => {
                  const { error } = await postResetPassword({ password: values.password, token });
                  if (error) {
                    history.push(appRouteConstants.auth.TOKEN_EXPIRED);
                  } else {
                    mmToast('Password reset successful, Please login with new credentials', { type: 'success' });
                    history.push(appRouteConstants.auth.LOGIN);
                  }
                }}
              >
                {(props) => {
                  return (
                    <div className='form-wrap'>
                      <form onSubmit={props.handleSubmit}>
                        <div className='input-wrapper'>
                          <label htmlFor='password' className='form-subheading'>
                            New Password
                          </label>
                          <div className='password-wrap'>
                            <input
                              type={visible.password ? 'text' : 'password'}
                              id='password'
                              className='password'
                              name='password'
                              placeholder='Set Password'
                              value={props.values.password}
                              onChange={props.handleChange}
                            />
                            <span className='visibility-icon' onClick={togglePasswordVisibility} role='button'>
                              {getVisibilityIcon('password')}
                            </span>
                          </div>

                          {props.values.password ? (
                            <div className={`pt-2 text-right ${getValidationText().classNames}`}>
                              {getValidationText().text}
                            </div>
                          ) : null}

                          {props.errors.password && props.values.password && (
                            <div className='mt-2 feedback'>{props.errors.password}</div>
                          )}
                        </div>
                        <div className='input-wrapper'>
                          <label htmlFor='confirm-password' className='form-subheading'>
                            Confirm Password
                          </label>
                          <div className='password-wrap confirm'>
                            <input
                              id='confirm-password'
                              type={visible.confirmPassword ? 'text' : 'password'}
                              className='password'
                              name='confirmPassword'
                              onChange={props.handleChange}
                              placeholder='Confirm Password'
                              value={props.values.confirmPassword}
                            />
                            <span className='visibility-icon' onClick={toggleConfirmPasswordVisibility} role='button'>
                              {getVisibilityIcon('confirmPassword')}
                            </span>

                            <div className='feedback'>
                              {props.errors.confirmPassword && props.values.confirmPassword
                                ? props.errors.confirmPassword
                                : null}
                            </div>
                          </div>
                        </div>
                        <button
                          className='mm-btn-animate mm-btn-primary m-b-5'
                          disabled={props.isSubmitting}
                          type='submit'
                        >
                          Save Password
                        </button>
                      </form>
                    </div>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPassword;
