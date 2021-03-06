import Form from 'react-bootstrap/Form';
import ReactDatePicker from 'react-datepicker';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import moment from 'moment';
import { Formik } from 'formik';
import CircularSpinner from 'common/components/spinner/circular-spinner';
import MMToolTip from 'common/components/tooltip';
import useToast from 'common/hooks/useToast';
import useAccountType from 'auth/hooks/useAccountType';
import useLoanAccount from 'auth/hooks/useLoanAccount';
import useSearchParam from 'auth/hooks/useSearchParam';
import useAccountFilter from 'auth/hooks/useAccountFilter';
import useAccountSubtype from 'auth/hooks/useAccountSubtype';
import useAssociateMortgage from 'auth/hooks/useAssociateMortgage';
import useRealEstateAccounts from 'auth/hooks/useRealEstateAccounts';
import useCurrentSubscription from 'auth/hooks/useCurrentSubscription';
import { MMCategories } from 'auth/auth.enum';
import { useAuthState } from 'auth/auth.context';
import { makeFormFields } from 'auth/auth.helper';
import { useModal } from 'common/components/modal';
import { enumerateStr } from 'common/common-helper';
import { StringKeyObject } from 'common/common.types';
import { appRouteConstants } from 'app/app-route.constant';
import { getMomentDate, getUTC } from 'common/moment.helper';
import { loginValidationSchema } from 'auth/auth.validation';
import { LiquidityOptions } from 'auth/enum/liquidity-options';
import { fNumber, numberWithCommas } from 'common/number.helper';
import { SelectInput } from 'common/components/input/select.input';
import { ReactComponent as InfoIcon } from 'assets/images/signup/info.svg';
import { CurrencyOptions, CurrencySymbols } from 'auth/enum/currency-options';
import { initialAccount, initialMortgage } from 'auth/data/account-settings.data';
import { EmployerMatchLimitOptions } from 'auth/enum/employer-match-limit-options';
import { deleteAccount, patchAccount, patchCompleteProfile } from 'api/request.api';
import { Account, IRealEstateAccount, Mortgage, MortgageList } from 'auth/auth.types';
import { CalculateRealEstateReturnOptions } from 'auth/enum/calculate-real-estate-return-options';

import MortgageDropdown from './mortgage-dropdown';
import DeleteAccountModal from './delete-account.modal';
import RealEstateDropdown from './real-estate-dropdown';
import AssociatedLoanDropdown from './associated-loan-dropdown';

interface Props {
  currentAccount?: Account;
  handleReload?: () => void;
  closeSidebar?: () => void;
  isFromAccount?: boolean;
}

const AccountSettingForm: React.FC<Props> = ({ currentAccount, handleReload, closeSidebar, isFromAccount }) => {
  const history = useHistory();
  const location = useLocation();
  const { mmToast } = useToast();
  const { accounts } = useAuthState();
  const [accountType, setAccountType] = useState('');
  const [accountSubtype, setAccountSubtype] = useState('');
  const [accountCategory, setAccountCategory] = useState<string>('');
  const { currentSubscription } = useCurrentSubscription();

  const isManual = currentAccount?.isManual;

  const { loading: fetchingAccountType, data: accountTypes, error } = useAccountType(isManual);
  const { subType: accountSubTypes, error: subTypeError } = useAccountSubtype(accountType, isManual);

  const { fetchingLoanAccount, loanAccounts, loanAccountError } = useLoanAccount();
  const { fetchingMortgage, mortgageAccounts, mortgageError } = useAssociateMortgage();
  const { fetchingRealEstateAccounts, realEstateAccounts, realEstateError } = useRealEstateAccounts();
  const { accountFilters, error: filterError } = useAccountFilter(accountType, accountSubtype);

  const deleteAccountModal = useModal();

  const from = useSearchParam('from');
  const isFromFastlink = from === 'fastLink';

  /**
   * Set account type and account subtype
   * On current account changes
   */
  useEffect(() => {
    if (currentAccount) {
      setAccountType(currentAccount.category?.mmAccountType);
      setAccountSubtype(currentAccount.category?.mmAccountSubType);
    }
  }, [currentAccount]);

  /**
   * Set First sub type of the account subtypes array
   * Each time account subtypes changes
   */
  // useEffect(() => {
  //   if (accountSubTypes?.length) {
  //     return setAccountSubtype(accountSubTypes[0]);
  //   }
  // }, [accountSubTypes]);

  /**
   * Set account subtype for the first time
   */
  // useEffect(() => {
  //   if (currentAccount?.category?.mmAccountSubType) {
  //     return setAccountSubtype(currentAccount.category.mmAccountSubType);
  //   }
  // }, [currentAccount]);

  const hasError = error || subTypeError || filterError || mortgageError || loanAccountError || realEstateError;

  const isLoading = fetchingAccountType || fetchingMortgage || fetchingLoanAccount || fetchingRealEstateAccounts;

  if (hasError) {
    mmToast('Error occurred', { type: 'error' });
  }

  if (isLoading) {
    return <CircularSpinner />;
  }

  const formFields = accountFilters ? makeFormFields(accountFilters) : [];

  const hasField = (field: string) => formFields.includes(field);

  const hc = (field: string) => (hasField(field) ? '' : 'hidden');

  const currentFormFields = currentAccount?.accountDetails;

  const hasAccountSubType = accountSubTypes.some(Boolean);

  const dMortgageAccounts: MortgageList = mortgageAccounts?.length
    ? [initialMortgage, ...mortgageAccounts]
    : [initialMortgage];

  const dRealEstateAccounts: IRealEstateAccount[] = realEstateAccounts?.length
    ? [initialAccount, ...realEstateAccounts]
    : [initialAccount];

  const isLastAccount = (): boolean => {
    if (accounts && currentAccount) {
      const { length, [length - 1]: last } = accounts;

      if (last.id === currentAccount.id) {
        return true;
      }
    }

    return false;
  };

  const deleteAccountById = async () => {
    if (currentAccount?.id) {
      const { error: delError } = await deleteAccount(currentAccount.id.toString());
      if (!delError) {
        mmToast('Delete Success', { type: 'success' });

        return history.push('/net-worth');
      }

      return mmToast('Delete Failed', { type: 'error' });
    }
  };

  const getInitialDate = (key: string): Date | undefined => {
    return currentFormFields && currentFormFields[key] ? getMomentDate(currentFormFields[key]) : undefined;
  };

  return (
    <Formik
      initialValues={
        ({
          currency: currentFormFields?.currency || CurrencyOptions.USD,
          mmCategory: accountCategory || currentAccount?.category?.mmCategory || '',
          accountName: currentAccount?.accountName || '',
          accountNumber: currentAccount?.accountNumber || '',
          city: currentFormFields?.city || '',
          state: currentFormFields?.state || '',
          mmAccountType: accountType || '',
          zipCode: currentFormFields?.zipCode || '',
          country: currentFormFields?.country || '',
          mmAccountSubType: accountSubtype || '',
          liquidity: currentFormFields?.liquidity || '',
          ownEstimate: currentFormFields?.ownEstimate || '',
          principalBalance: currentFormFields?.principalBalance || '',
          useZestimate: currentFormFields?.useZestimate || true,
          interestRate: currentFormFields?.interestRate || '',
          maturityDate: getInitialDate('maturityDate'),
          investedDate: getInitialDate('investedDate'),
          employerMatch: currentFormFields?.employerMatch || '',
          streetAddress: currentFormFields?.streetAddress || '',
          amountInvested: currentFormFields?.amountInvested || '',
          associatedLoan: currentFormFields?.associatedLoan || '',
          associatedRealEstate: currentFormFields?.associatedRealEstate || '',
          originationDate: getInitialDate('originationDate'),
          originalBalance: currentFormFields?.originalBalance || '',
          paymentsPerYear: currentFormFields?.paymentsPerYear || '',
          calculatedEquity: currentFormFields?.calculatedEquity || '',
          currentValuation: currentFormFields?.currentValuation || '',
          termForInvestment: currentFormFields?.termForInvestment || '',
          businessStartDate: getInitialDate('businessStartDate'),
          employerMatchLimit: currentFormFields?.employerMatchLimit || '',
          associatedMortgage: currentFormFields?.associatedMortgage || '',
          estimatedMonthlyIncome: currentFormFields?.estimatedMonthlyIncome || '',
          estimatedMonthlyExpenses: currentFormFields?.estimatedMonthlyExpenses || '',
          calculateReturnsOn: currentFormFields?.calculateReturnsOn || 'equity',
          postMoneyValuation: currentFormFields?.postMoneyValuation || '',
          currentMarketValue: currentFormFields?.currentMarketValue || '',
          targetInterestRate: currentFormFields?.targetInterestRate || '',
          separateLoanBalance: currentFormFields?.separateLoanBalance || true,
          employerMatchLimitIn: currentFormFields?.employerMatchLimitIn || 'percentage',
          includeEmployerMatch: currentFormFields?.includeEmployerMatch || true,
          separateShortBalance: currentFormFields?.separateShortBalance || true,
          estimatedAnnualReturns: currentFormFields?.estimatedAnnualReturns || '',
          estimatedAnnualRevenues: currentFormFields?.estimatedAnnualRevenues || '',
          employerMatchContribution: currentFormFields?.employerMatchContribution || true,
          estimatedAnnualPrincipalReduction: currentFormFields?.estimatedAnnualPrincipalReduction || '',
        } as any) as Record<string, any>
      }
      enableReinitialize
      validationSchema={loginValidationSchema}
      onSubmit={async (values, actions) => {
        const mapping: StringKeyObject = {
          yes: true,
          no: false,
        };

        const accountId = currentAccount?.id;

        if (!accountId) {
          return;
        }

        let data = {
          calculatedEntity:
            values.ownEstimate && values.principalBalance ? +values.ownEstimate - +values.principalBalance : '',
        };
        const dateKeys = ['maturityDate', 'investedDate', 'originationDate', 'businessStartDate'];
        dateKeys.forEach((dateKey) => {
          const dateValue = values[dateKey];

          if (dateValue) {
            data = { ...data, [dateKey]: getUTC(dateValue) };
          }
        });

        Object.keys(values).forEach((key: any) => {
          const value = values[key];

          if (value === 'yes' || value === 'no') {
            data = { ...data, [key]: mapping[value] };
            return;
          }

          if (value === '') {
            data = { ...data, [key]: undefined };
            return;
          }

          data = { ...data, [key]: value };
        });

        const res = await patchAccount(`${accountId}`, data);
        if (res?.error) {
          return mmToast('Error Occurred', { type: 'error' });
        }

        mmToast('Successfully updated', { type: 'success' });

        if (isFromAccount) {
          return closeSidebar?.();
        } else {
          if (isLastAccount()) {
            const { error: err } = await patchCompleteProfile();
            if (err) {
              return mmToast('Error on complete patch profile', { type: 'error' });
            }

            location.pathname = appRouteConstants.auth.NET_WORTH;
            location.search = 'from=accountSettings';

            location.state = {
              isFromFastlink,
            };

            return history.push(location);
          }

          return handleReload?.();
        }
      }}
    >
      {(props) => {
        const { setFieldValue, values, handleChange, setValues } = props;

        const setCategory = (cat: string) => {
          return setAccountCategory(cat);
        };

        const handleAccountChange = (e: React.ChangeEvent<any>) => {
          setAccountType(e.target.value);
          setAccountSubtype('');
          setValues({ ...values, [e.target.name]: e.target.value });
        };

        const handleSubAccountChange = (e: React.ChangeEvent<any>) => {
          setAccountSubtype(e.target.value);
          setValues({ ...values, [e.target.name]: e.target.value });
        };

        const handleSelectChange = (e: React.ChangeEvent<any>) => {
          const name: string = e.target.name;
          let value = e.target.value;
          const numberFields: string[] = ['associatedRealEstate', 'associatedMortgage', 'associatedLoan'];
          value = numberFields.includes(name) ? +value : value;

          return setValues({ ...values, [name]: value });
        };

        const handleMortgageChange = (e: React.ChangeEvent<any>, mortgage: Mortgage) => {
          e.preventDefault();
          setValues({
            ...values,
            associatedMortgage: +mortgage.id,
            principalBalance: mortgage.balance,
          });
        };

        const handleAssociatedLoanChange = (e: React.ChangeEvent<any>, id: any) => {
          e.preventDefault();
          setValues({
            ...values,
            associatedLoan: +id,
          });
        };

        return (
          <>
            <form onSubmit={props.handleSubmit} className='account-setting-form'>
              <span className='form-subheading'>Account Name</span>
              <input
                type='text'
                className='w-100 mb-4'
                onChange={props.handleChange}
                value={values.accountName}
                name='accountName'
              />
              {values.accountNumber ? (
                <div className='d-flex align-items-center justify-content-between'>
                  <p>Last 4 Account Number</p>
                  <p>{values.accountNumber.slice(4)}</p>
                </div>
              ) : null}
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
                <ul className='category-list mb-4'>
                  {enumerateStr(MMCategories).map((cat: string, idx: number) => {
                    return (
                      <li
                        className={values.mmCategory === cat ? 'active' : ''}
                        onClick={() => setCategory(cat)}
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
              <div className='account-type'>
                <ul className='account-type-list'>
                  <li>
                    <span className='form-subheading'>Account Type</span>
                    <SelectInput
                      args={accountTypes}
                      onChange={handleAccountChange}
                      value={values.mmAccountType}
                      name='mmAccountType'
                    />
                  </li>
                  <li className={hasAccountSubType ? '' : 'hidden'}>
                    <div className='account-list-content'>
                      <span className='form-subheading'>Account Subtype</span>
                      <SelectInput
                        args={accountSubTypes}
                        onChange={handleSubAccountChange}
                        value={values.mmAccountSubType}
                        name='mmAccountSubType'
                      />
                    </div>
                  </li>
                  {/*Currency Dropdown*/}
                  <li className='currency-select'>
                    <span className='form-subheading'>Currency</span>
                    {currentSubscription &&
                      (currentSubscription.name === 'Green' || currentSubscription.name === 'Plus') ? (
                        <span className='mm-form-field-read'>{values.currency}</span>
                      ) : (
                        <SelectInput
                          args={enumerateStr(CurrencyOptions)}
                          onChange={handleSelectChange}
                          value={values.currency}
                          name='currency'
                        />
                      )}
                    {currentSubscription && (currentSubscription.name === 'Green' || currentSubscription.name === 'Plus') && (
                      <label className='mm-form-field-error text--pink'>
                        Your plan only supports USD. To enable multi currency support upgrade your plan.
                      </label>
                    )}
                  </li>
                  <li className={hc('liquidity')}>
                    <span className='form-subheading'>Liquidity</span>
                    <SelectInput
                      args={enumerateStr(LiquidityOptions)}
                      onChange={handleSelectChange}
                      value={values.liquidity}
                      name='liquidity'
                      sort={false}
                    />
                  </li>
                </ul>
              </div>
              {/* loan section */}
              <div className='account-type'>
                <ul className='account-type-list'>
                  <li className={hc('interestRate')}>
                    <span className='form-subheading'>Interest Rate</span>
                    <Form.Control
                      type='number'
                      onChange={handleChange}
                      name='interestRate'
                      value={values.interestRate}
                      step='any'
                    />
                  </li>
                  <li className={hc('originationDate')}>
                    <span className='form-subheading'>Origination Date</span>
                    <ReactDatePicker
                      name='originationDate'
                      selected={values.originationDate}
                      onChange={(val: Date) => {
                        setFieldValue('originationDate', moment(val));
                      }}
                    />
                  </li>
                  <li className={hc('originalBalance')}>
                    <span className='form-subheading'>Original Balance</span>
                    <Form.Control
                      type='number'
                      onChange={handleChange}
                      name='originalBalance'
                      value={values.originalBalance}
                      step='any'
                    />
                  </li>
                  <li className={hc('maturityDate')}>
                    <span className='form-subheading'>Maturity Date</span>
                    <ReactDatePicker
                      name='maturityDate'
                      selected={values.maturityDate}
                      onChange={(val: Date) => {
                        setFieldValue('maturityDate', moment(val));
                      }}
                    />
                  </li>
                  <li className={hc('termForInvestment')}>
                    {/* This is optional will be calculated if there are originated date and maturity date */}
                    <span className='form-subheading'>Term Length (in Months)</span>
                    <Form.Control
                      onChange={handleChange}
                      type='number'
                      name='termForInvestment'
                      value={values.termForInvestment}
                      step='any'
                    />
                  </li>
                  <li className={hc('principalBalance')}>
                    <span className='form-subheading'>Loan Balance</span>
                    <Form.Control
                      onChange={handleChange}
                      type='number'
                      name='principalBalance'
                      value={values.principalBalance}
                      step='any'
                    />
                  </li>
                  <li className={hc('paymentsPerYear')}>
                    <span className='form-subheading'>Payment per year</span>
                    <Form.Control
                      type='number'
                      onChange={handleChange}
                      name='paymentsPerYear'
                      value={values.paymentsPerYear}
                      step='any'
                    />
                  </li>
                  <li className={hc('associatedRealEstate')}>
                    <span className='form-subheading'>Associated Real Estate</span>
                    <RealEstateDropdown
                      name='associatedRealEstate'
                      value={values.associatedRealEstate}
                      onChange={handleSelectChange}
                      realEstateAccounts={dRealEstateAccounts}
                    />
                  </li>
                </ul>
              </div>
              {/* loan section ends */}

              {/* startup and investment section */}
              <div className='account-type'>
                <ul className='account-type-list'>
                  <li className={hc('investedDate')}>
                    <span className='form-subheading'>When did you invest?</span>
                    <ReactDatePicker
                      name='investedDate'
                      selected={values.investedDate}
                      onChange={(val: Date) => {
                        setFieldValue('investedDate', moment(val));
                      }}
                    />
                  </li>
                  <li className={hc('amountInvested')}>
                    <span className='form-subheading'>How much did you invest?</span>
                    <Form.Control
                      onChange={handleChange}
                      type='number'
                      name='amountInvested'
                      value={values.amountInvested}
                      step='any'
                    />
                  </li>
                  <li className={hc('currentMarketValue')}>
                    <span className='form-subheading'>Current market value?</span>
                    <Form.Control
                      onChange={handleChange}
                      type='number'
                      name='currentMarketValue'
                      value={values.currentMarketValue}
                      step='any'
                    />
                  </li>
                  <li className={hc('targetInterestRate')}>
                    <span className='form-subheading'>What is the target IRR?</span>
                    <Form.Control
                      onChange={handleChange}
                      type='number'
                      name='targetInterestRate'
                      value={values.targetInterestRate}
                      step='any'
                    />
                  </li>
                  <li className={hc('postMoneyValuation')}>
                    <span className='form-subheading'>Post Money Valuation</span>
                    <Form.Control
                      onChange={handleChange}
                      type='number'
                      name='postMoneyValuation'
                      value={values.postMoneyValuation}
                      step='any'
                    />
                  </li>
                  <li className={hc('currentValuation')}>
                    <span className='form-subheading'>Current Valuation</span>
                    <Form.Control
                      type='number'
                      onChange={handleChange}
                      name='currentValuation'
                      value={values.currentValuation}
                      step='any'
                    />
                  </li>
                </ul>
              </div>

              {/* startup and investment section ends  */}

              {/* business start */}
              <div className='account-type'>
                <ul className='account-type-list'>
                  <li className={hc('businessStartDate')}>
                    <span className='form-subheading'>Date Established</span>
                    <ReactDatePicker
                      name='businessStartDate'
                      selected={values.businessStartDate}
                      onChange={(val: Date) => {
                        setFieldValue('businessStartDate', moment(val));
                      }}
                    />
                  </li>
                  <li className={hc('estimatedAnnualRevenues')}>
                    <span className='form-subheading account-type-list__select-title'>Estimated Annual Revenues</span>
                    <Form.Control
                      type='number'
                      onChange={handleChange}
                      name='estimatedAnnualRevenues'
                      value={values.estimatedAnnualRevenues}
                      step='any'
                    />
                  </li>
                  <li className={`${hc('associatedLoan')}`}>
                    <span className='form-subheading'>Associated Loan</span>
                    <AssociatedLoanDropdown
                      loanAccounts={loanAccounts}
                      name='associatedLoan'
                      onChange={handleAssociatedLoanChange}
                      value={values.associatedLoan}
                    />
                  </li>
                </ul>
              </div>
              {/* business ends  */}

              {/* address */}

              <div className='account-type'>
                <ul className='account-type-list'>
                  <li className={`w-100 form-divider ${hc('streetAddress')}`}>
                    <span className='form-subheading'>Street Address</span>
                    <input
                      type='text'
                      name='streetAddress'
                      onChange={handleChange}
                      value={values.streetAddress}
                    />
                  </li>
                  <li className={`${hc('city')}`}>
                    <span className='form-subheading'>City</span>
                    <input type='text' name='city' onChange={handleChange} value={values.city} />
                  </li>
                  <li className={`${hc('state')}`}>
                    <span className='form-subheading'>State</span>
                    <input
                      type='text'
                      name='state'
                      onChange={handleChange}
                      value={values.state}
                    />
                  </li>
                  <li className={`${hc('zipCode')}`}>
                    <span className='form-subheading'>Zip Code</span>
                    <input
                      type='text'
                      name='zipCode'
                      onChange={handleChange}
                      value={values.zipCode}
                    />
                  </li>
                  <li className={`${hc('country')}`}>
                    <span className='form-subheading'>Country</span>
                    <input
                      type='text'
                      name='country'
                      onChange={handleChange}
                      value={values.country}
                    />
                  </li>
                </ul>
              </div>

              {/* address end */}

              <div className='middle-input-wrap'>
                <div className={`input-wrap performance flex-box ${hc('employerMatchContribution')}`}>
                  <div className='left-input'>
                    <p>
                      <span className='form-subheading'>Does your employer match contributions?</span>
                    </p>
                  </div>
                  <div className='right-input radio'>
                    <input
                      type='radio'
                      value='yes'
                      onChange={handleChange}
                      name='employerMatchContribution'
                      checked={values.employerMatchContribution === 'yes' || values.employerMatchContribution === true}
                      aria-checked={!!values.employerMatchContribution}
                    />
                    <label>Yes</label>
                    <input
                      onChange={handleChange}
                      value='no'
                      type='radio'
                      name='employerMatchContribution'
                      checked={values.employerMatchContribution === 'no' || values.employerMatchContribution === false}
                      aria-checked={!!values.employerMatchContribution}
                    />
                    <label>No</label>
                  </div>
                </div>

                {/* If employerMatchContribution is no hide this field */}
                {values.employerMatchContribution === true || values.employerMatchContribution === 'yes' ? (
                  <div className={`input-wrap flex-box ${hc('employerMatch')}`}>
                    <div className='left-input'>
                      <p>
                        <span className='form-subheading'>Employer match</span>
                      </p>
                    </div>
                    <div className='right-input'>
                      <div className='form-field-group'>
                        <Form.Control
                          type='number'
                          name='employerMatch'
                          onChange={handleChange}
                          step='any'
                        />
                        <span className='input-add-on'>%</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {values.employerMatchContribution === true || values.employerMatchContribution === 'yes' ? (
                  <div className={`input-wrap flex-box ${hc('employerMatchLimitIn')} ${hc('employerMatchLimit')}`}>
                    <div className='left-input employer-match'>
                      <p>
                        <span className='form-subheading'>Employer match limit</span>
                        <span className='employer-match-limits'>
                          <input
                            type='radio'
                            onChange={handleChange}
                            value={EmployerMatchLimitOptions.AMOUNT}
                            name='employerMatchLimitIn'
                            checked={values.employerMatchLimitIn === EmployerMatchLimitOptions.AMOUNT}
                            aria-checked={values.employerMatchLimitIn === EmployerMatchLimitOptions.AMOUNT}
                          />
                          <label>{CurrencySymbols[values.currency] || '$'}</label>
                          <input
                            type='radio'
                            onChange={handleChange}
                            value={EmployerMatchLimitOptions.PERCENTAGE}
                            name='employerMatchLimitIn'
                            checked={values.employerMatchLimitIn === EmployerMatchLimitOptions.PERCENTAGE}
                            aria-checked={values.employerMatchLimitIn === EmployerMatchLimitOptions.PERCENTAGE}
                          />
                          <label>%</label>
                        </span>
                      </p>
                    </div>
                    <div className='right-input'>
                      <div className='form-field-group'>
                        <Form.Control
                          type='number'
                          name='employerMatchLimit'
                          onChange={handleChange}
                          value={values.employerMatchLimit}
                          step='any'
                        />
                        <span className='input-add-on'>
                          {values.employerMatchLimitIn === EmployerMatchLimitOptions.AMOUNT
                            ? CurrencySymbols[values.currency] || '$'
                            : '%'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {values.employerMatchContribution === true || values.employerMatchContribution === 'yes' ? (
                  <div className={`input-wrap performance flex-box ${hc('includeEmployerMatch')}`}>
                    <div className='left-input'>
                      <p>
                        <span className='form-subheading'>
                          Include employer match in performance?
                          <MMToolTip message='Some investors think employer match should be counted as income so they do not include it as performance returns, some believe should be counted as a return. The choice is yours'>
                            <InfoIcon className='sm-hide' />
                          </MMToolTip>
                        </span>
                      </p>
                    </div>
                    <div className='right-input radio'>
                      <div className='yes-no-radios'>
                        <input
                          type='radio'
                          value='yes'
                          onChange={handleChange}
                          name='includeEmployerMatch'
                          checked={values.includeEmployerMatch === 'yes' || values.includeEmployerMatch === true}
                          aria-checked={values.includeEmployerMatch === 'yes' || values.includeEmployerMatch === true}
                        />
                        <label>Yes</label>
                        <input
                          type='radio'
                          value='no'
                          onChange={handleChange}
                          name='includeEmployerMatch'
                          checked={values.includeEmployerMatch === 'no' || values.includeEmployerMatch === false}
                          aria-checked={values.includeEmployerMatch === 'no' || values.includeEmployerMatch === false}
                        />
                        <label>No</label>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className={`form-divider ${hc('separateLoanBalance')}`}>
                <ul className='account-type-list'>
                  <li className='w-100'>
                    <p>
                      <span className='form-subheading'>How do you want to handle your 401k loan?</span>
                      <span className='badge badge-pill badge-primary mm-coming-soon'>Coming Soon!</span>
                    </p>
                    <Form.Control
                      as='select'
                      onChange={handleChange}
                      name='separateLoanBalance'
                      className='w-50 account-type-list__dropdown'
                      value={values.separateLoanBalance}
                    >
                      <option
                        value='yes'
                        aria-selected={values.separateLoanBalance === 'yes' || values.separateLoanBalance === true}
                      >
                        Separated Account
                      </option>
                      <option
                        value='no'
                        aria-selected={values.separateLoanBalance === 'no' || values.separateLoanBalance === false}
                      >
                        Same Account
                      </option>
                    </Form.Control>
                  </li>
                </ul>
              </div>

              {/* associate mortgage and loan  */}
              <div className='account-type'>
                <ul className='account-type-list'>
                  <li className={hc('estimatedMonthlyIncome')}>
                    <span className='form-subheading'>Estimated Monthly Income</span>
                    <Form.Control
                      onChange={handleChange}
                      type='number'
                      name='estimatedMonthlyIncome'
                      value={values.estimatedMonthlyIncome}
                      step='any'
                    />
                  </li>
                  <li className={hc('estimatedMonthlyExpenses')}>
                    <span className='form-subheading'>Estimated Monthly Expenses</span>
                    <Form.Control
                      onChange={handleChange}
                      type='number'
                      name='estimatedMonthlyExpenses'
                      value={values.estimatedMonthlyExpenses}
                      step='any'
                    />
                  </li>
                  <li className={`${hc('associatedMortgage')}`}>
                    <span className='form-subheading'>Associated Mortgage</span>
                    <MortgageDropdown
                      mortgageList={dMortgageAccounts}
                      name='associatedMortgage'
                      onChange={handleMortgageChange}
                      value={values.associatedMortgage}
                    />
                  </li>

                  {/* Current value */}
                  <li className={`${hc('useZestimate')}`}>
                    <span className='form-subheading'>Current Value</span>
                    <div className='align-items-start'>
                      <div className='flex-column'>
                        <Form.Control
                          onChange={handleChange}
                          type='number'
                          name='ownEstimate'
                          value={values.ownEstimate}
                          step='any'
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              {/* associate mortgage and loan  ends */}

              {/* calculate equity */}
              <div className={`${hc('calculatedEquity')}`}>
                <div className='d-flex align-items-center justify-content-between'>
                  <p>Calculated Equity</p>
                  <p>{numberWithCommas(fNumber(+values.ownEstimate - +values.principalBalance, 2))}</p>
                </div>
              </div>

              {/* Estimated annual returns */}
              <div className={`estimated-annual-return ${hc('estimatedAnnualReturns')}`}>
                <span className='form-subheading'>Estimated annual returns</span>
                <span className='sub-label'>This will be used to show projections on your charts.</span>
                <div className='form-field-group single-field'>
                  <Form.Control
                    onChange={handleChange}
                    type='number'
                    name='estimatedAnnualReturns'
                    value={values.estimatedAnnualReturns}
                    step='any'
                  />
                  <span className='input-add-on'>%</span>
                </div>
              </div>

              {/* Estimated principal paydown */}
              <div className={`estimated-annual-return ${hc('estimatedAnnualPrincipalReduction')}`}>
                <span className='form-subheading'>Estimated balance reduction</span>
                <span className='sub-label'>This will be used to show projections on your charts.</span>

                <div className='form-field-group single-field'>
                  <Form.Control
                    onChange={handleChange}
                    type='number'
                    name='estimatedAnnualReturns'
                    value={values.estimatedAnnualReturns}
                    step='any'
                  />
                  <span className='input-add-on'>%</span>
                </div>
              </div>

              {/* Real Estate returns preference */}
              <div className={`form-row mt-5 ${hc('calculateReturnsOn')}`}>
                <span className='form-subheading'>How do you prefer to calculate real estate returns?</span>
                <MMToolTip
                  placement='top'
                  message='Some investors track a return in real estate only when the value of the property goes up, others track a return when their equity goes goes. We recommend to track the equity when it is an investment property and the home value when it is your primary residence.'
                >
                  <InfoIcon />
                </MMToolTip>
                <div className='form-check w-100 my-2'>
                  <input
                    value={CalculateRealEstateReturnOptions.EQUITY}
                    type='radio'
                    name='calculateReturnsOn'
                    aria-checked={values.calculateReturnsOn === CalculateRealEstateReturnOptions.EQUITY}
                    className='form-check-input ml-0'
                    onChange={handleChange}
                    checked={values.calculateReturnsOn === CalculateRealEstateReturnOptions.EQUITY}
                  />
                  <label className='form-check-label ml-4' htmlFor='calculateReturnsOn'>
                    Calculate based on money in and returns on that money
                  </label>
                </div>
                <div className='form-check w-100 my-2'>
                  <input
                    value={CalculateRealEstateReturnOptions.PROPERTY_VALUE}
                    type='radio'
                    name='calculateReturnsOn'
                    aria-checked={values.calculateReturnsOn === CalculateRealEstateReturnOptions.PROPERTY_VALUE}
                    className='form-check-input ml-0'
                    onChange={handleChange}
                    checked={values.calculateReturnsOn === CalculateRealEstateReturnOptions.PROPERTY_VALUE}
                  />
                  <label className='form-check-label ml-4' htmlFor='calculateReturnsOn'>
                    Calculate based on appreciation of the market value
                  </label>
                </div>
              </div>

              <div className='estimate-annual-block mt-3'>
                <div className='estimated-top-content'>
                  {/* <div
                    className={`link-attention-block  d-flex justify-content-between ${isFromAccount ? '' : 'hidden'}`}
                  >
                    <button className='btn btn-primary w-50 mm-button' type='button'>
                      Link Account
                        </button>
                    <div>
                      <NotLinked />
                      <span className='text--red'>Attention</span>
                    </div>
                  </div> */}

                  {/* <div className={isFromAccount ? '' : 'hidden'}>
                    <span className='form-subheading'>Closed Account</span>
                    <div className='estimate-annual-block__checkbox'>
                      <label className='custom-checkbox'>
                        <input type='checkbox' name='closeAccount' aria-checked={false} value='closeAccount' />
                        <span className='checkmark' />
                      </label>
                      <span className='ml-4'>Mark this account as closed</span>
                    </div>
                  </div> */}

                  <div className='row mt-5'>
                    <div className={`col-12 col-md-4 mb-3 ${isFromAccount ? '' : 'hidden'}`}>
                      <button
                        className='mm-btn-animate btn-danger'
                        type='button'
                        onClick={() => deleteAccountModal.open()}
                      >
                        Delete Account
                      </button>
                    </div>

                    <div className='col-12 col-md-8 mb-3'>
                      <div className='d-flex justify-content-start'>
                        <button
                          className='mm-btn-signup btn-outline-primary mm-btn-animate estimate-annual-block__btn-cancel'
                          type='button'
                          onClick={() => {
                            closeSidebar?.();
                          }}
                        >
                          {isFromAccount ? 'Cancel' : 'Back'}
                        </button>
                        <button className='mm-btn-animate mm-btn-primary estimate-annual-block__btn-save' type='submit'>
                          {isFromAccount ? 'Save' : isLastAccount() ? 'Finish' : 'Next'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className='delete-account-modal'>
              <DeleteAccountModal deleteAccountModal={deleteAccountModal} deleteAccountById={deleteAccountById} />
            </div>
          </>
        );
      }}
    </Formik>
  );
};

export default AccountSettingForm;
