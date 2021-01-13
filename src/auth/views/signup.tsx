import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import { Link, useHistory, useLocation } from 'react-router-dom';

import env from 'app/app.env';
import { Formik } from 'formik';
import queryString from 'query-string';
import { events } from '@mm/data/event-list';
import useToast from 'common/hooks/useToast';
import { AuthLayout } from 'layouts/auth.layout';
import validation from 'lang/en/validation.json';
import { useModal } from 'common/components/modal';
import { useAuthDispatch } from 'auth/auth.context';
import { postFacebookLogin } from 'api/request.api';
import { setLoginSuccess } from 'auth/auth.actions';
import useAnalytics from 'common/hooks/useAnalytics';
import { StringKeyObject } from 'common/common.types';
import { appRouteConstants } from 'app/app-route.constant';
import usePixel, { EPixelTrack } from 'common/hooks/usePixel';
import { registerValidationSchema } from 'auth/auth.validation';
import { signup, associateFacebookUser } from 'auth/auth.service';
import { ReactComponent as LogoImg } from 'assets/icons/logo.svg';
import { ReactComponent as HiddenIcon } from 'assets/icons/pass-hidden.svg';
import { ReactComponent as VisibleIcon } from 'assets/icons/pass-visible.svg';
import { ReactComponent as LoginLockIcon } from 'assets/images/login/lock-icon.svg';
import { ReactComponent as LoginShieldIcon } from 'assets/images/login/shield-icon.svg';
import { ReactComponent as LoginFacebookIcon } from 'assets/images/login/facebook-icon.svg';

import EmailNeededModal from './inc/email-needed.modal';
import AssociateEmailModal from './inc/associate-email.modal';

const Signup = () => {
  return (
    <AuthLayout>
      <SignupMainSection />
    </AuthLayout>
  );
};
export default Signup;
export const SignupMainSection = () => {
  const [fbToken, setFBToken] = useState<string>('');
  const [associateMessage, setAssociateMessage] = useState<string>('');

  const { fbq } = usePixel();
  const history = useHistory();
  const { mmToast } = useToast();
  const location = useLocation();
  const { event } = useAnalytics();
  const associateModal = useModal();
  const dispatch = useAuthDispatch();
  const emailNeededModal = useModal();
  const [visible, setVisible] = useState<boolean>(false);

  const priceId = queryString.parse(location.search).priceId as string;
  const planName = queryString.parse(location.search).planName as string;
  const planPrice = queryString.parse(location.search).planPrice as string;

  const [validator, setValidator] = useState<number>(0);

  const reg1 = /^.{8,}$/;
  const reg2 = /(^.*\d+.*$)/;
  const reg3 = /(^.*[~`!@#$%^&*()_+\-={[}\]|\\:;"'<,>.?/].*$)/;
  const reg4 = /(^.*[A-Z].*$)/;

  const visibilityIcon = visible ? <VisibleIcon /> : <HiddenIcon />;

  const triggerPixelTrackEvent = () => {
    if (priceId && planName && planPrice) {
      return fbq(EPixelTrack.START_TRAIL, { currency: 'USD', value: +planPrice, predicted_ltv: +planPrice * 6 });
    }

    return fbq(EPixelTrack.START_TRAIL, { currency: 'USD', value: 60, predicted_ltv: 60 * 6 });
  };

  const triggerGAEvent = () => {
    if (priceId && planName && planPrice) {
      return event({
        category: 'Subscription',
        action: 'Started Trial',
        label: `Trial for ${planName} plan`,
        value: +planPrice,
      });
    }

    return event(events.startTrial);
  };

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

  const responseFacebook = async (response: any) => {
    if (response.accessToken) {
      setFBToken(response.accessToken);

      const { error, data } = await postFacebookLogin({
        accessToken: response.accessToken,
        mailChimpSubscription: true,
        subscriptionPriceId: env.STRIPE_DEFAULT_PLAN,
      });

      if (!error) {
        mmToast('Successfully logged in', { type: 'success' });
        triggerGAEvent();
        triggerPixelTrackEvent();
        dispatch(setLoginSuccess(data));

        return history.push(appRouteConstants.auth.NET_WORTH);
      }
      if (error.statusCode === 400 && error.message) {
        return emailNeededModal.open();
      }

      if (error.statusCode === 409 && error.message) {
        setAssociateMessage(error.message);

        return associateModal.open();
      }
    }
  };

  const handleFacebookAssociation = async () => {
    const { error } = await associateFacebookUser({ dispatch, token: fbToken });
    if (error) {
      mmToast('Association Failed', { type: 'error' });
    } else {
      mmToast('Association Success', { type: 'success' });
    }
    associateModal.close();
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
                <li>Find your accounts.</li>
                <li>Connect securely to Money Minx.</li>
                <li>Let Money Minx do the rest.</li>
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
              <h2>Sign up for Money Minx</h2>
              <p>Create an account to get started with your Money Minx trial.</p>
              <div className='form-wrap'>
                <Formik
                  initialValues={{
                    email: '',
                    password: '',
                    termsAccepted: false,
                    mailChimpSubscription: false,
                    subscriptionPriceId: priceId || env.STRIPE_DEFAULT_PLAN,
                  }}
                  validate={async (values) => {
                    if (!values.password) {
                      return {};
                    }

                    let a = 0;
                    let errors: StringKeyObject = {};
                    [reg1, reg2, reg3, reg4].forEach((reg) => (reg.test(values.password) ? (a += 1) : a));
                    setValidator(a);

                    try {
                      await registerValidationSchema.validate(values, { abortEarly: false });
                    } catch (errs) {
                      const mappedError = errs.inner.reduce((obj: StringKeyObject, cur: any) => {
                        obj[cur.path] = cur.message;
                        return obj;
                      }, {});

                      errors = mappedError;
                    }
                    return errors;
                  }}
                  onSubmit={async (values, actions) => {
                    const hasEmail = values.email;
                    const hasPassword = values.password;

                    if (!hasEmail) {
                      actions.setFieldError('email', validation.EMAIL_IS_EMPTY);
                    }

                    if (!hasPassword) {
                      actions.setFieldError('password', validation.PWD_IS_EMPTY);
                    }

                    if (!values.termsAccepted) {
                      actions.setFieldError('termsAccepted', validation.FORGOT_TERMS);
                    }

                    const emptyFields = Object.keys(values).filter((key) => {
                      const value = (values as StringKeyObject)[key];
                      if (key === 'mailChimpSubscription') {
                        return false;
                      }
                      return value === '' || value === false || value === undefined;
                    });

                    if (emptyFields.length > 0) {
                      return emptyFields;
                    }

                    const { error } = await signup({ dispatch, payload: values });
                    actions.setSubmitting(false);

                    if (!error) {
                      mmToast('Signup Success', { type: 'success' });
                      triggerGAEvent();
                      triggerPixelTrackEvent();

                      return history.push(appRouteConstants.networth.NET_WORTH);
                    }

                    if (error.statusCode === 409) {
                      return actions.setFieldError('password', '409');
                    }

                    actions.setFieldError('password', error.message || 'Sign up failed');
                  }}
                >
                  {(props) => {
                    return (
                      <form onSubmit={props.handleSubmit}>
                        <div className='input-wrapper'>
                          <div className='email-wrap'>
                            <label htmlFor='email-field' className='form-subheading'>
                              Email address
                            </label>
                            <input
                              id='email-field'
                              type='email'
                              className='email'
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              value={props.values.email}
                              name='email'
                              placeholder='Email'
                            />
                          </div>
                          {props.errors.email && <div className='mt-2 feedback'>{props.errors.email}</div>}
                        </div>
                        <div className='align-items-center'>
                          <label htmlFor='password-field' className='form-subheading'>
                            Set Password
                          </label>
                          <div className='password-wrap'>
                            <input
                              id='password-field'
                              type={visible ? 'text' : 'password'}
                              className='password'
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              value={props.values.password}
                              name='password'
                              placeholder='Password'
                            />
                            <span className='visibility-icon' onClick={() => setVisible(!visible)} role='button'>
                              {visibilityIcon}
                            </span>
                          </div>
                          {props.values.password ? (
                            <div className={`ml-2 mt-2 mt-md-0 ${getValidationText().classNames}`}>
                              {getValidationText().text}
                            </div>
                          ) : null}
                        </div>
                        {props.errors.password && (
                          <div className='feedback mt-2'>
                            {props.errors.password === '409' ? (
                              <span>
                                This email is already registered. Want to{' '}
                                <Link to={appRouteConstants.auth.LOGIN}>login</Link> or
                                <Link to={appRouteConstants.auth.FORGOT_PASSWORD}> recover your password?</Link>
                              </span>
                            ) : (
                                props.errors.password
                              )}
                          </div>
                        )}

                        <div className='credentials-checkbox'>
                          <span className='checkbox-item'>
                            <label className='check-box'>
                              I accept the{' '}
                              <a href='/terms' target='_blank' className='purple-links'>
                                Terms of Service
                              </a>
                              <input
                                type='checkbox'
                                className='terms'
                                name='termsAccepted'
                                aria-checked={props.values.termsAccepted}
                                checked={props.values.termsAccepted}
                                value={`${props.values.termsAccepted}`}
                                onChange={props.handleChange}
                              />
                              <span className='geekmark' />
                            </label>
                          </span>

                          <span className='checkbox-item'>
                            <label className='check-box'>
                              Sign up for the newsletter
                              <input
                                type='checkbox'
                                className='newsletter-checkbox'
                                name='mailChimpSubscription'
                                placeholder=''
                                aria-checked={props.values.mailChimpSubscription}
                                checked={props.values.mailChimpSubscription}
                                value={`${props.values.mailChimpSubscription}`}
                                onChange={props.handleChange}
                              />
                              <span className='geekmark' />
                            </label>
                          </span>
                        </div>

                        {props.errors.termsAccepted && (
                          <div className='feedback mb-4'>{props.errors.termsAccepted}</div>
                        )}

                        <button className='mm-btn-animate mm-btn-primary' type='submit'>
                          Sign Up
                        </button>
                      </form>
                    );
                  }}
                </Formik>

                <div className='facebook-login'>
                  <div className='social-login-options'>
                    <span> Or, sign up with: </span>
                    <div className='fb-icon-wrap'>
                      <FacebookLogin
                        authType='rerequest'
                        textButton=''
                        fields='email'
                        isMobile={false}
                        autoLoad={false}
                        reAuthenticate={true}
                        callback={responseFacebook}
                        scope='public_profile,email'
                        icon={<LoginFacebookIcon className='social-login-fb' />}
                        appId={env.FACEBOOK_APP_ID || ''}
                        buttonStyle={{
                          background: 'transparent',
                          padding: 0,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className='auth-end-element'>
                    Already have an account?{' '}
                    <Link to={appRouteConstants.auth.LOGIN} className='purple-links'>
                      Log In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AssociateEmailModal
        message={associateMessage}
        associateModal={associateModal.props}
        handleSuccess={handleFacebookAssociation}
      />

      <EmailNeededModal emailNeededModal={emailNeededModal} />
    </div>
  );
};
