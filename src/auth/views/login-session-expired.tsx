import React from 'react';
import { AuthLayout } from 'layouts/auth.layout';

import { ReactComponent as LoginLockIcon } from 'assets/images/login/lock-icon.svg';
import { ReactComponent as LoginShieldIcon } from 'assets/images/login/shield-icon.svg';
import { ReactComponent as LoginVisibilityIcon } from 'assets/images/login/visibility-icon.svg';
import { ReactComponent as LoginFacebookIcon } from 'assets/images/login/facebook-icon.svg';
import { ReactComponent as LogoImg } from 'assets/icons/logo.svg';

const LoginSessionExpired = () => {
  return (
    <AuthLayout>
      <LoginSessionExpiredMainSection />
    </AuthLayout>
  );
};

export default LoginSessionExpired;

export const LoginSessionExpiredMainSection = () => {
  return (
    <div className='main-table-wrapper'>
      <div className='mm-container mm-container-final'>
        <div className='row login-wrapper'>
          <div className='guide-content'>
            <div className='logo-img-wrap'>
              <LogoImg />
            </div>
            <h1>
              <span className='block'>Three easy steps to get </span>started with Money Minx
            </h1>
            <ul>
              <li>Find your institutions</li>
              <li>Connect it securily to Money Minx</li>
              <li>Let Money Minx to the rest</li>
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

          <div className='bg-white credintials-wrapper'>
            <div className='credintials-content'>
              <div className='logo-img-wrapper'>
                <LogoImg />
              </div>
              <h2>Welcome back</h2>
              <p>Your accounts are ready for you. Hope you will reach your goals</p>
              <div className='session-expired'>
                <p>We thought you left, so we logged you out to protect your account.</p>
              </div>
              <div className='form-wrap'>
                <form>
                  <input type='text' id='email' name='email' value='' placeholder='Email' />

                  <div id='password-wrap'>
                    <input type='Password' id='password' name='password' value='' placeholder='Password' />
                    <span className='visibility-icon'>
                      <LoginVisibilityIcon />
                    </span>
                  </div>
                </form>
                <p>
                  <span className='forgot-pass'>
                    <a href='link7'>Forgot Password?</a>
                  </span>
                </p>
                <button className='bg-primary mm-btn-primary-outline'>Log in</button>
                <div className='facebook-login'>
                  <p>
                    Or, log in with:
                    <div className='fb-icon-wrap'>
                      <a href='link6'>
                        <LoginFacebookIcon />
                      </a>
                    </div>
                  </p>
                </div>
                <p>
                  Don’t have an account? <a href='moneyminx'>Sign Up</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};