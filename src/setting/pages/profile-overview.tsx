import React, { useState } from 'react';
import { FormControl } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import moment from 'moment';
import { Formik } from 'formik';
import useToast from 'common/hooks/useToast';
import { ProfileType } from 'auth/auth.types';
import useProfile from 'auth/hooks/useProfile';
import { patchProfile } from 'api/request.api';
import countries from '@mm/data/countries.json';
import { fetchProfile } from 'auth/auth.service';
import { enumerateStr } from 'common/common-helper';
import SaveSettings from 'setting/inc/save-settings';
import ProfilePicture from 'setting/inc/profile-picture';
import { useAuthState, useAuthDispatch } from 'auth/auth.context';
import { ReactComponent as Shield } from 'assets/icons/shield.svg';
import CircularSpinner from 'common/components/spinner/circular-spinner';
import { ReactComponent as InfoIcon } from 'assets/images/signup/info.svg';
import { HouseHoldIncomeOptions, MaritalStatusOptions, RiskToleranceOptions } from 'setting/setting.enum';
import MMToolTip from 'common/components/tooltip';

export const ProfileOverview = () => {
  const {
    loading,
    response: { error },
  } = useProfile();

  const { mmToast } = useToast();
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const [statusText, setStatusText] = useState('Save Changes');
  const [progress, setProgress] = useState(0);
  const [change, setChange] = useState(false);

  let curProgress = 0;
  const singlePropertyCounts = 13;
  const marriedPropertyCounts = 15;

  if (error) {
    mmToast('Error occurred fetching your profile', { type: 'error' });
  }

  if (loading || !user) {
    return <CircularSpinner />;
  }

  const maritalStatus = [null, ...enumerateStr(MaritalStatusOptions)];
  const householdIncomeList = [null, ...enumerateStr(HouseHoldIncomeOptions)];
  const riskToleranceList = [null, ...enumerateStr(RiskToleranceOptions)];

  const getProfileProgress = (userInfo: ProfileType) => {
    let count = 0;
    const profileDetail = userInfo.profileDetails;
    const isSingle = profileDetail.maritalStatus === MaritalStatusOptions.SINGLE;
    const propertyCount = isSingle ? singlePropertyCounts : marriedPropertyCounts;

    if (userInfo.firstName) count++;
    if (userInfo.lastName) count++;
    if (userInfo.username) count++;
    if (userInfo.bio) count++;
    if (userInfo.website) count++;
    if (userInfo.investingSince) count++;
    if (profileDetail.countryOfResidence) count++;
    if (profileDetail.householdIncome) count++;
    if (profileDetail.riskTolerance) count++;
    if (profileDetail.dob) count++;
    if (profileDetail.alreadyRetired || profileDetail.targetedRetirementAge > 0) count++;
    if (profileDetail.maritalStatus) count++;
    if (profileDetail.dependants > 0) count++;

    if (!isSingle) {
      if (profileDetail.spouseDob) count++;
      if (profileDetail.spouseAlreadyRetired || profileDetail.spouseTargetedRetirementAge > 0) count++;
    }

    curProgress = Math.round((count / propertyCount) * 100);
  };

  const checkProfileCompletionProgress = (values: any) => {
    let count = 0;
    const isSingle = values.maritalStatus === MaritalStatusOptions.SINGLE;
    const propertyCount = isSingle ? singlePropertyCounts : marriedPropertyCounts;
    if (!change) setChange(true);

    if (values.firstName) count++;
    if (values.lastName) count++;
    if (values.username) count++;
    if (values.bio) count++;
    if (values.website) count++;
    if (values.investingSince) count++;
    if (values.countryOfResidence) count++;
    if (values.householdIncome) count++;
    if (values.riskTolerance) count++;
    if (values.dob) count++;
    if (values.alreadyRetired || values.targetedRetirementAge > 0) count++;
    if (values.maritalStatus) count++;
    if (values.dependants > 0) count++;

    if (!isSingle) {
      if (values.spouseDob) count++;
      if (values.spouseAlreadyRetired || values.spouseTargetedRetirementAge > 0) count++;
    }

    setProgress(Math.round((count / propertyCount) * 100));
  };

  let fullName = `${user.firstName || ''} ${user.lastName || ''}`;
  if (!user.firstName && !user.lastName) {
    fullName = user.username || 'Investor';
  }

  const { profileDetails } = user;
  getProfileProgress(user);

  return (
    <section className='mm-profile-overview'>
      <div className='card mm-setting-card'>
        <div className='card-body d-flex justify-content-between align-items-center'>
          <div className='mm-profile-overview__title'>
            {fullName}
            <span className='text-primary px-2'>#{user.id}</span>
            <MMToolTip
              placement='top'
              message='Your name is not shared anywhere publicly this just helps us communicate with you better when needed'
            >
              <InfoIcon className='mt-n1' />
            </MMToolTip>
          </div>
          <div className='d-flex align-items-center'>
            <div className='text--grayText mr-4 sm-hide'>Profile complete</div>
            <div className='mm-radial__progress-bar'>
              <CircularProgressbar
                value={change ? progress : curProgress}
                text={`${change ? progress : curProgress}%`}
                strokeWidth={4}
                styles={buildStyles({
                  textSize: '1.5rem',
                  pathTransitionDuration: 0.5,
                  pathColor: '#10C273',
                  textColor: '#10C273',
                  trailColor: '#969EAC4D',
                })}
              />
            </div>
          </div>
        </div>
      </div>

      <ProfilePicture pictureURL={user.picture} />

      <Formik
        initialValues={{
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          username: user.username || null,
          bio: user.bio || null,
          website: user.website || null,
          investingSince: user.investingSince || null,
          profileEnabled: profileDetails?.profileEnabled || false,
          shareAssetAllocation: profileDetails?.shareAssetAllocation || false,
          shareAssetValues: profileDetails?.shareAssetValues || false,
          countryOfResidence: profileDetails?.countryOfResidence || null,
          householdIncome: profileDetails?.householdIncome || null,
          riskTolerance: profileDetails?.riskTolerance || null,
          dob: profileDetails?.dob || null,
          spouseDob: profileDetails?.spouseDob || null,
          targetedRetirementAge: profileDetails?.targetedRetirementAge || 0,
          alreadyRetired: profileDetails?.alreadyRetired || false,
          maritalStatus: profileDetails?.maritalStatus || null,
          spouseTargetedRetirementAge: profileDetails?.spouseTargetedRetirementAge || 0,
          spouseAlreadyRetired: profileDetails?.spouseAlreadyRetired || false,
          dependants: profileDetails?.dependants || 0,
          minxMeasureUp: profileDetails?.minxMeasureUp || false,
          minxWinks: profileDetails?.minxWinks || false,
        }}
        onSubmit={async (values, actions) => {
          setStatusText('Saving...');

          if (typeof values.dependants === 'string') {
            values.dependants = parseInt(values.dependants, 10);
          }

          Object.keys(values).forEach((key: string) => {
            if ((values as any)[key] === '') {
              (values as any)[key] = null;
            }
          });

          const { error: patchError } = await patchProfile(values);

          if (patchError) {
            setStatusText('Save Changes');
            return mmToast('Could not save profile', { type: 'error' });
          }

          const result = await fetchProfile({ dispatch });
          if (result.error) {
            mmToast('Could not update profile', { type: 'error' });
          }
          setStatusText('Saved');
          setTimeout(() => {
            setStatusText('Save Changes');
          }, 1000);
        }}
        validate={checkProfileCompletionProgress}
      >
        {(props) => {
          const { handleChange, handleBlur, values, setFieldValue, handleSubmit } = props;

          const toggleFormCheck = (name: string) => {
            setFieldValue(name, !(values as any)[name]);
          };

          const handleRadioCheck = (e: React.ChangeEvent<any>) => {
            const name = e.target.name;
            const value = e.target.value === 'true';
            setFieldValue(name, value);
          };

          return (
            <form>
              <div className='card mm-setting-card'>
                <div className='card-body'>
                  <div className='mm-profile-overview__profile-page'>
                    <span className='mm-profile-overview__title'>Profile Page</span>
                    <span className='mm-profile-overview__profile-page--tag text--primary m-l-15'>Coming Soon!</span>
                    <div className='card-sub-title'>
                      Profile pages and conversations are coming mid-2021. Get a head start by getting your profile
                      ready for when we launch.
                    </div>
                    <div className='card-section d-md-flex align-items-center justify-content-between'>
                      <p>Profile page is where you can join the community in discussions about your investments</p>
                      <span className='mm-switch-block'>
                        <input
                          value='true'
                          type='radio'
                          name='profileEnabled'
                          className='mm-switch-input'
                          checked={values.profileEnabled}
                          aria-checked={values.profileEnabled}
                          onChange={() => {}}
                        />
                        <label
                          className='mm-switch mt-md-0 mt-3'
                          onClick={() => toggleFormCheck('profileEnabled')}
                          role='button'
                        />
                      </span>
                    </div>
                    {values.profileEnabled && (
                      <div className='card-section d-md-flex align-items-center justify-content-between mm-asset-allocation'>
                        <p>
                          Do you want to share your asset allocation on your profile page?
                          <MMToolTip
                            placement='top'
                            message='Coming Soon. You can share your allocation chart on your profile page to engage in conversations with Money Minx users'
                          >
                            <InfoIcon className='mt-n1 ml-2' />
                          </MMToolTip>
                        </p>
                        <div className='mm-radio-block mr-n2 ml-n2 ml-md-0'>
                          <label className='mm-radio mr-3'>
                            <input
                              type='radio'
                              name='shareAssetAllocation'
                              value='true'
                              checked={values.shareAssetAllocation}
                              aria-checked={values.shareAssetAllocation}
                              onChange={handleRadioCheck}
                            />
                            <span className='mm-checkmark' />
                            Yes
                          </label>
                          <label className='mm-radio ml-3'>
                            <input
                              type='radio'
                              name='shareAssetAllocation'
                              value='false'
                              checked={!values.shareAssetAllocation}
                              aria-checked={!values.shareAssetAllocation}
                              onChange={handleRadioCheck}
                            />
                            <span className='mm-checkmark' />
                            No
                          </label>
                        </div>
                      </div>
                    )}
                    {values.profileEnabled && (
                      <div className='card-section--last d-md-flex align-items-center justify-content-between'>
                        <p>
                          Do you want to share asset values on your profile page?
                          <MMToolTip
                            placement='top'
                            message='Coming Soon. If your chart is shared, you can choose to also show amounts in addition to percentages only'
                          >
                            <InfoIcon className='mt-n1 ml-2' />
                          </MMToolTip>
                        </p>
                        <div className='mm-radio-block mr-md-n2 ml-n2 ml-md-0'>
                          <label className='mm-radio mr-3'>
                            <input
                              type='radio'
                              name='shareAssetValues'
                              value='true'
                              checked={values.shareAssetValues}
                              aria-checked={values.shareAssetValues}
                              onChange={handleRadioCheck}
                            />
                            <span className='mm-checkmark' />
                            Yes
                          </label>
                          <label className='mm-radio ml-3'>
                            <input
                              type='radio'
                              name='shareAssetValues'
                              value='false'
                              checked={!values.shareAssetValues}
                              aria-checked={!values.shareAssetValues}
                              onChange={handleRadioCheck}
                            />
                            <span className='mm-checkmark' />
                            No
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className='card mm-setting-card'>
                <div className='card-body'>
                  <div className='mm-profile-overview__title mm-profile-overview__profile-page'>
                    About You
                    <span className='mm-profile-overview__profile-page--tag text--primary m-l-15'>Coming Soon!</span>
                    <div className='card-sub-title'>
                      Profile pages and conversations are coming mid-2021. Get a head start by getting your profile
                      ready for when we launch.
                    </div>
                    <div>
                      <div className='mm-profile-overview__form'>
                        <div className='form-group row align-items-center'>
                          <label htmlFor='firstName' className='col-md-3 col-form-label'>
                            First Name
                            <MMToolTip
                              placement='top'
                              message='Your name is not shared anywhere publicly this just helps us communicate with you better when needed'
                            >
                              <InfoIcon className='mt-n1 ml-2' />
                            </MMToolTip>
                          </label>
                          <div className='col-md-9'>
                            <input
                              id='firstName'
                              type='text'
                              name='firstName'
                              placeholder='John'
                              value={values.firstName || ''}
                              onChange={handleChange}
                              className='form-control form-control-lg'
                            />
                          </div>
                        </div>
                        <div className='form-group row align-items-center'>
                          <label htmlFor='lastName' className='col-md-3 col-form-label'>
                            Last Name
                            <MMToolTip
                              placement='top'
                              message='Your name is not shared anywhere publicly this just helps us communicate with you better when needed'
                            >
                              <InfoIcon className='mt-n1 ml-2' />
                            </MMToolTip>
                          </label>
                          <div className='col-md-9'>
                            <input
                              id='lastName'
                              type='text'
                              name='lastName'
                              placeholder='Doe'
                              value={values.lastName || ''}
                              onChange={handleChange}
                              className='form-control form-control-lg'
                            />
                          </div>
                        </div>
                        <div className='form-group row align-items-center'>
                          <label htmlFor='username' className='col-md-3 col-form-label'>
                            Username
                            <MMToolTip
                              placement='top'
                              message='Your username will be your profile URL when profiles and conversations launch, you will be able to change this and turn it off at any time'
                            >
                              <InfoIcon className='mt-n1 ml-2' />
                            </MMToolTip>
                          </label>
                          <div className='col-md-9'>
                            <div className='mm-prepend-text text--grayText'>@</div>
                            <input
                              id='username'
                              type='text'
                              name='username'
                              placeholder='john'
                              value={values.username || ''}
                              onChange={handleChange}
                              className='form-control form-control-lg mm-username-input-form'
                            />
                          </div>
                        </div>
                        <div className='form-group row align-items-center'>
                          <label htmlFor='bio' className='col-md-3 col-form-label'>
                            Bio
                          </label>
                          <div className='col-md-9'>
                            <textarea
                              id='bio'
                              name='bio'
                              value={values.bio || ''}
                              onChange={handleChange}
                              placeholder='Your bio'
                              className='form-control mm-form-textarea'
                            />
                          </div>
                        </div>
                        <div className='form-group row align-items-center'>
                          <label htmlFor='website' className='col-md-3 col-form-label'>
                            Website
                          </label>
                          <div className='col-md-9'>
                            <input
                              id='website'
                              type='text'
                              name='website'
                              value={values.website || ''}
                              onChange={handleChange}
                              placeholder='www.moneyminx.com'
                              className='form-control form-control-lg mm-form-website'
                            />
                          </div>
                        </div>
                        <div className='form-group row align-items-center'>
                          <label htmlFor='year' className='col-md-3 col-form-label'>
                            Investing since
                          </label>
                          <div className='col-md-9'>
                            <FormControl
                              id='year'
                              type='number'
                              name='investingSince'
                              value={values.investingSince || ''}
                              onChange={handleChange}
                              placeholder='2015'
                              className='form-control form-control-lg'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='card mm-setting-card'>
                <div className='card-body'>
                  <div className='mm-profile-overview__title mm-profile-overview__profile-page'>
                    Specialized Intelligence
                    <MMToolTip
                      placement='top'
                      message='Money Minx is working on a machine learning algorithm that will help investors compare their results to others. If you fill your profile, you will be able to get better insights and comparisons'
                    >
                      <InfoIcon className='mt-n1 ml-2' />
                    </MMToolTip>
                    <Shield className='float-right mt-1' />
                    <div className='card-sub-title'>
                      Enter your data below and opt-in for specialized insights including Minks Winks and Minks
                      Measure-up. Minks Winks includes tips and intelligence based on machine learning. Minks Measure-up
                      allows you to see how your allocation chart stacks up to your investor peers. We will never share
                      or sell your data.
                    </div>
                    <div>
                      <div className='mm-profile-overview__form'>
                        <div className='form-group row align-items-center'>
                          <label className='col-md-3 col-form-label'>Country of residence</label>
                          <div className='col-md-5'>
                            <select
                              className='form-control form-control-lg mr-sm-2'
                              name='countryOfResidence'
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.countryOfResidence || ''}
                            >
                              {countries.data.map((country) => {
                                return (
                                  <option
                                    value={country.code || ''}
                                    key={country.id}
                                    aria-selected={values.countryOfResidence === country.code}
                                  >
                                    {country.name}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <div className='form-group row align-items-center'>
                          <label className='col-md-3 col-form-label'>Household income</label>
                          <div className='col-md-5'>
                            <select
                              className='form-control form-control-lg mr-sm-2'
                              name='householdIncome'
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.householdIncome || ''}
                            >
                              {householdIncomeList.map((householdIncome, index) => {
                                return (
                                  <option
                                    value={householdIncome}
                                    aria-selected={householdIncome === values.householdIncome}
                                    key={index}
                                  >
                                    {householdIncome}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <div className='form-group row align-items-center'>
                          <label className='col-md-3 col-form-label'>Risk tolerance</label>
                          <div className='col-md-5'>
                            <select
                              className='form-control form-control-lg mr-sm-2'
                              value={values.riskTolerance || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name='riskTolerance'
                            >
                              {riskToleranceList.map((tolerateOption, index) => {
                                return (
                                  <option
                                    value={tolerateOption}
                                    aria-selected={tolerateOption === values.riskTolerance}
                                    key={index}
                                  >
                                    {tolerateOption}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <div className='form-group row align-items-center'>
                          <label className='col-md-3 col-form-label' htmlFor='dob'>Date of birth</label>
                          <div className='col-md-5'>
                            <ReactDatePicker
                              id='dob'
                              className='form-control form-control-lg mr-sm-2'
                              name='dob'
                              selected={values.dob ? new Date(values.dob) : undefined}
                              onChange={(val: Date) => {
                                setFieldValue('dob', moment(val).toISOString());
                              }}
                            />
                          </div>
                        </div>
                        <div className='form-group row align-items-center'>
                          <label className='col-md-3 col-form-label' htmlFor='targetedRetirementAge'>Retirement age</label>
                          <div className='col-md-5'>
                            <FormControl
                              type='number'
                              min='0'
                              name='targetedRetirementAge'
                              id='targetedRetirementAge'
                              value={values.targetedRetirementAge || ''}
                              onChange={handleChange}
                              className='form-control form-control-lg mr-sm-2'
                              disabled={values.alreadyRetired}
                            />
                          </div>
                          <div className='col text-md-center  mt-3 mt-md-0'>
                            <div className='form-wrap'>
                              <span className='checkbox-item'>
                                <label className='check-box' htmlFor='alreadyRetired'>
                                  Already retired
                                  <input
                                    id='alreadyRetired'
                                    type='checkbox'
                                    name='alreadyRetired'
                                    value='true'
                                    checked={values.alreadyRetired}
                                    onChange={() => toggleFormCheck('alreadyRetired')}
                                    aria-checked={values.alreadyRetired}
                                  />
                                  <span className='geekmark' />
                                </label>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='form-group row align-items-center'>
                          <label className='col-md-3 col-form-label' htmlFor='maritalStatus'>Marital status</label>
                          <div className='col-md-5'>
                            <select
                              className='form-control form-control-lg mr-sm-2'
                              name='maritalStatus'
                              id='maritalStatus'
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.maritalStatus || ''}
                            >
                              {maritalStatus.map((mStatus, index) => {
                                return (
                                  <option value={mStatus} aria-selected={values.maritalStatus === mStatus} key={index}>
                                    {mStatus}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        {values.maritalStatus !== MaritalStatusOptions.SINGLE && (
                          <>
                            <div className='form-group row align-items-center'>
                              <label className='col-md-3 col-form-label' htmlFor='spouseDob'>Spouse’s date of birth</label>
                              <div className='col-md-5'>
                                <ReactDatePicker
                                  className='form-control form-control-lg mr-sm-2'
                                  name='spouseDob'
                                  id='spouseDob'
                                  selected={values.spouseDob ? new Date(values.spouseDob) : undefined}
                                  onChange={(val: Date) => {
                                    setFieldValue('spouseDob', moment(val).toISOString());
                                  }}
                                />
                              </div>
                            </div>
                            <div className='form-group row align-items-center'>
                              <label className='col-md-3 col-form-label' htmlFor='spouseTargetedRetirementAge'>Spouse’s retirement age</label>
                              <div className='col-md-5'>
                                <FormControl
                                  type='number'
                                  min='0'
                                  name='spouseTargetedRetirementAge'
                                  id='spouseTargetedRetirementAge'
                                  value={values.spouseTargetedRetirementAge || ''}
                                  onChange={handleChange}
                                  className='mr-sm-2 form-control form-control-lg'
                                  disabled={values.spouseAlreadyRetired}
                                />
                              </div>
                              <div className='col text-md-center mt-3 mt-md-0'>
                                <div className='form-wrap'>
                                  <span className='checkbox-item'>
                                    <label className='check-box' htmlFor='spouseAlreadyRetired'>
                                      Already retired
                                      <input
                                        type='checkbox'
                                        name='spouseAlreadyRetired'
                                        id='spouseAlreadyRetired'
                                        value='true'
                                        checked={values.spouseAlreadyRetired}
                                        onChange={() => toggleFormCheck('spouseAlreadyRetired')}
                                        aria-checked={values.spouseAlreadyRetired}
                                      />
                                      <span className='geekmark' />
                                    </label>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        <div className='form-group row align-items-center'>
                          <label className='col-md-3 col-form-label' htmlFor='dependants'>Dependants</label>
                          <div className='col-md-5'>
                            <select
                              className='form-control form-control-lg mr-sm-2'
                              name='dependants'
                              id='dependants'
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.dependants || 0}
                            >
                              {[0, 1, 2, 3, 4, 5, 6].map((dependant, index) => {
                                return (
                                  <option value={dependant} aria-selected={values.dependants === dependant} key={index}>
                                    {dependant || ''}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className='mm-profile-overview__title mm-profile-overview__profile-page mt-4'>
                        <div className='float-sm-left fs-16'>Turn on Minx Measure-up</div>
                        <div className='d-flex justify-content-between align-items-center mt-sm-0 mt-2'>
                          <span className='mm-profile-overview__profile-page--tag text--primary ml-0 ml-sm-3'>
                            Coming Soon!
                          </span>
                          <span className='mm-switch-block'>
                            <input
                              value='true'
                              name='minxMeasureUp'
                              type='checkbox'
                              aria-checked={values.minxMeasureUp}
                              className='mm-switch-input'
                              checked={values.minxMeasureUp}
                              onChange={() => {}}
                            />
                            <label
                              className='mm-switch mt-md-0 mt-sm-3'
                              onClick={() => toggleFormCheck('minxMeasureUp')}
                              role='button'
                            />
                          </span>
                        </div>
                        <div className='card-description'>
                          You will be able to see how your portfolio compares to others with a similar profile. Your
                          data will be included in the aggregated data but not individually.
                        </div>
                      </div>
                      <div className='mm-profile-overview__title mm-profile-overview__profile-page'>
                        <div className='float-sm-left fs-16'>Turn on Minx Winks</div>
                        <div className='d-flex justify-content-between align-items-center mt-sm-0 mt-2'>
                          <span className='mm-profile-overview__profile-page--tag text--primary ml-0 ml-sm-3'>
                            Coming Soon!
                          </span>
                          <span className='mm-switch-block'>
                            <input
                              value='true'
                              name='minxWinks'
                              type='checkbox'
                              aria-checked={values.minxWinks}
                              className='mm-switch-input'
                              checked={values.minxWinks}
                              onChange={() => {}}
                            />
                            <label
                              className='mm-switch mt-md-0 mt-sm-3'
                              onClick={() => toggleFormCheck('minxWinks')}
                              role='button'
                            />
                          </span>
                        </div>
                        <div className='card-description'>
                          You will receive intelligent tips and insights custom crafted based on your accounts and
                          profile details.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SaveSettings handleSave={handleSubmit} statusText={statusText} />
            </form>
          );
        }
        }
      </Formik>
    </section>
  );
};

export default ProfileOverview;
