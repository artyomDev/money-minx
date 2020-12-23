import { Form } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import React, { useEffect, useState } from 'react';

import moment from 'moment';
import { Formik } from 'formik';

import useToast from 'common/hooks/useToast';
import { Modal } from 'common/components/modal';
import { ActivityDetailsModalProps } from 'account/account.type';
import { numberWithCommas, fNumber } from 'common/number.helper';
import { SelectInput } from 'common/components/input/select.input';
import { getDateFormattedString, getMomentDate } from 'common/moment.helper';
import { getActivityTypes, patchTransaction, postTransaction } from 'api/request.api';

const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  accountId,
  currencySymbol,
  activityDetails,
  activityDetailsModal,
  closeNewActivityModal,
  closeEditActivityModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [activityTypes, setActivityTypes] = useState<string[]>([]);
  const { mmToast } = useToast();

  const fetchActivityTypes = async () => {
    const { data, error } = await getActivityTypes();
    if (!error) {
      const types = [];
      for (let i = 0; i < data.length; i++) {
        types.push(data[i].type);
      }
      setActivityTypes(types);
    }
  };

  useEffect(() => {
    fetchActivityTypes();
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        date: activityDetails && activityDetails.date ? getMomentDate(activityDetails.date) : getMomentDate(),
        type: activityDetails?.type || '',
        description: activityDetails?.description || '',
        amount: activityDetails?.amount || 0,
        balance: activityDetails?.balance || 0,
        income: activityDetails?.income || false,
        cashFlow: activityDetails?.cashFlow || false,
        isIgnored: activityDetails?.isIgnored || false,
        accountId: accountId,
      }}
      onSubmit={async (values: any, actions: any) => {
        const activityId = activityDetails?.id;

        let data = {};

        Object.keys(values).forEach((key: any) => {
          const value = (values as any)[key];

          if (value === '') {
            data = { ...data, [key]: undefined };
            return;
          }

          data = { ...data, [key]: value };
        });

        setLoading(true);
        if (activityId) {
          const res = await patchTransaction(`${activityId}`, data);
          if (res?.error) {
            setLoading(false);
            return mmToast('Error Occurred', { type: 'error' });
          }
          setLoading(false);
          closeEditActivityModal?.();
          activityDetailsModal.close();
          return mmToast('Successfully updated', { type: 'success' });
        }

        // new position
        const res = await postTransaction(data);
        if (res?.error) {
          setLoading(false);
          return mmToast('Error Occurred', { type: 'error' });
        }
        setLoading(false);
        closeNewActivityModal?.();
        activityDetailsModal.close();
        return mmToast('Successfully Added', { type: 'success' });
      }}
    >
      {(props) => {
        const { values, handleChange, setValues, setFieldValue } = props;

        const handleSelectChange = (e: React.ChangeEvent<any>) => {
          setValues({ ...values, [e.target.name]: e.target.value });
        };

        const handleYesNoChange = (e: React.ChangeEvent<any>) => {
          const value = e.target.value === 'Yes';
          setValues({ ...values, [e.target.name]: value });
        };

        const toggleFormCheck = (name: string) => {
          setFieldValue(name, !(values as any)[name]);
        };

        return (
          <form onSubmit={props.handleSubmit}>
            <Modal
              {...activityDetailsModal.props}
              title={activityDetails ? 'Edit Activity' : 'New Activity'}
              size='md'
              canBeClosed
              onClose={() => activityDetailsModal.close()}
            >
              <div className='modal-wrapper mm-activity-details-modal'>
                <div className='mm-activity-details-modal__title mt-3'>
                  {activityDetails && !activityDetails.isManual ? (
                    <>
                      <div className='row mt-2 m-b-4 align-items-center'>
                        <div className='col-sm'>Date</div>
                        <div className='col-sm'>{getDateFormattedString(values.date)}</div>
                      </div>
                      <div className='row mt-2 align-items-center'>
                        <div className='col-sm'>Type</div>
                        <div className='col-sm'>
                          <SelectInput
                            args={activityTypes}
                            onChange={handleSelectChange}
                            value={values.type}
                            name='type'
                            format={true}
                          />
                        </div>
                      </div>
                      <div className='row mt-2 align-items-center'>
                        <div className='col-sm'>Description</div>
                        <div className='col-sm'>
                          <Form.Control onChange={handleChange} name='description' value={values.description} />
                        </div>
                      </div>
                      <div className='row m-y-4 align-items-center'>
                        <div className='col-sm'>Amount</div>
                        <div className='col-sm'>
                          {currencySymbol}
                          {numberWithCommas(fNumber(values.amount, 2))}
                        </div>
                      </div>
                      <div className='row m-t-7 m-b-5 align-items-center'>
                        <div className='col-sm'>Balance</div>
                        <div className='col-sm'>
                          {currencySymbol}
                          {numberWithCommas(fNumber(values.balance, 2))}
                        </div>
                      </div>
                      <div className='row mt-2 align-items-center'>
                        <div className='col-sm'>Income</div>
                        <div className='col-sm'>
                          <SelectInput
                            args={['Yes', 'No']}
                            onChange={handleYesNoChange}
                            value={values.income ? 'Yes' : 'No'}
                            name='income'
                          />
                        </div>
                      </div>
                      <div className='row mt-2 align-items-center'>
                        <div className='col-sm'>Cash Flow</div>
                        <div className='col-sm'>
                          <SelectInput
                            args={['Yes', 'No']}
                            onChange={handleYesNoChange}
                            value={values.cashFlow ? 'Yes' : 'No'}
                            name='cashFlow'
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                      <>
                        <div className='row mt-2 align-items-center'>
                          <div className='col-sm'>Date</div>
                          <div className='col-sm'>
                            <ReactDatePicker
                              name='date'
                              selected={values.date ? new Date(values.date) : null}
                              onChange={(val: Date) => {
                                setFieldValue('date', moment(val).toISOString());
                              }}
                            />
                          </div>
                        </div>
                        <div className='row mt-2 align-items-center'>
                          <div className='col-sm'>Type</div>
                          <div className='col-sm'>
                            <SelectInput
                              args={activityTypes}
                              onChange={handleSelectChange}
                              value={values.type}
                              name='type'
                              format={true}
                            />
                          </div>
                        </div>
                        <div className='row mt-2 align-items-center'>
                          <div className='col-sm'>Description</div>
                          <div className='col-sm'>
                            <Form.Control onChange={handleChange} name='description' value={values.description} />
                          </div>
                        </div>
                        <div className='row mt-2 align-items-center'>
                          <div className='col-sm'>Amount</div>
                          <div className='col-sm'>
                            <Form.Control onChange={handleChange} type='number' name='amount' value={values.amount} />
                          </div>
                        </div>
                        <div className='row mt-2 align-items-center'>
                          <div className='col-sm'>Balance</div>
                          <div className='col-sm'>
                            <Form.Control onChange={handleChange} type='number' name='balance' value={values.balance} />
                          </div>
                        </div>
                        <div className='row mt-2 align-items-center'>
                          <div className='col-sm'>Income</div>
                          <div className='col-sm'>
                            <SelectInput
                              args={['Yes', 'No']}
                              onChange={handleYesNoChange}
                              value={values.income ? 'Yes' : 'No'}
                              name='income'
                            />
                          </div>
                        </div>
                        <div className='row mt-2 align-items-center'>
                          <div className='col-sm'>Cash Flow</div>
                          <div className='col-sm'>
                            <SelectInput
                              args={['Yes', 'No']}
                              onChange={handleYesNoChange}
                              value={values.cashFlow ? 'Yes' : 'No'}
                              name='cashFlow'
                            />
                          </div>
                        </div>
                      </>
                    )}
                  <div className='action-wrapper mt-3 form-wrap'>
                    <span className='checkbox-item'>
                      <label className='check-box'>
                        Ignore this transaction
                        <input
                          type='checkbox'
                          name='isIgnored'
                          value='false'
                          checked={values.isIgnored}
                          onChange={() => toggleFormCheck('isIgnored')}
                          aria-checked={values.isIgnored}
                        />
                        <span className='geekmark' />
                      </label>
                    </span>
                    <button
                      className='mm-btn-animate mm-btn-primary d-flex align-items-center justify-content-center'
                      type='submit'
                    >
                      {loading ? (
                        <>
                          <span className='spinner-grow spinner-grow-sm' role='status' aria-hidden='true' />
                          <span className='ml-1'>Saving...</span>
                        </>
                      ) : (
                          <>
                            Save<span className='hide-sm ml-1'>Changes</span>
                          </>
                        )}
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          </form>
        );
      }}
    </Formik>
  );
};

export default ActivityDetailsModal;
