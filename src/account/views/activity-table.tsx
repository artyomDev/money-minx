import React, { useEffect, useState } from 'react';

import { formater } from 'common/common-helper';
import { useModal } from 'common/components/modal';
import { getActivityDetails } from 'api/request.api';
import { getDateFormattedString } from 'common/moment.helper';
import { ReactComponent as Info } from 'assets/icons/info.svg';
import { fNumber, numberWithCommas } from 'common/number.helper';
import { ReactComponent as Edited } from 'assets/icons/icon-edit.svg';

import ActivityDetailsModal from './activity-details.modal';
import { AccountTransactionTableProps, AccountTransactionItem } from '../account.type';

export const ActivityTable: React.FC<AccountTransactionTableProps> = ({
  transactionsData,
  openEditActivityModalFun,
  closeEditActivityModalFun,
  currencySymbol,
}) => {
  const [transactions, setTransactions] = useState<AccountTransactionItem[]>([]);
  const [activityDetails, setActivityDetails] = useState<AccountTransactionItem>();
  const [priceHeader, setPriceHeader] = useState<boolean>(false);
  const [quantityHeader, setQuantityHeader] = useState<boolean>(false);

  const activityDetailsModal = useModal();

  useEffect(() => {
    setTransactions(transactionsData);
    for (let item of transactionsData) {
      if (item.price !== null) {
        setPriceHeader(true);
      }
      if (item.quantity !== null) {
        setQuantityHeader(true);
      }
    }
  }, [transactionsData]);

  const fetchActivityDetails = async (activityId: string) => {
    const { data, error } = await getActivityDetails(activityId);
    if (!error) {
      setActivityDetails(data);
    }
  };

  const openEditActivityModal = async (activityId: number) => {
    await fetchActivityDetails(activityId.toString());
    activityDetailsModal.open();
    openEditActivityModalFun();
  };

  return (
    <section>
      {transactions?.length > 0 ? (
        <div className='mm-activity-table'>
          <div className='mm-activity-table__overview'>
            <div className='mm-activity-table__head'>
              <div className='row no-gutters'>
                <div className='col-md mm-activity-table__head--data d-md-block'>Date</div>
                <div className='col-md mm-activity-table__head--data d-md-block'>Activity Type</div>
                <div className='col-md mm-activity-table__head--data d-md-block'>Description </div>
                {priceHeader && <div className='col-md mm-activity-table__head--data d-md-block'>Price</div>}
                {quantityHeader && <div className='col-md mm-activity-table__head--data d-md-block'>Quantity</div>}
                <div className='col-md mm-activity-table__head--data d-md-block'>Amount</div>
                <div className='col-md mm-activity-table__head--data d-md-block'>Balance</div>
                <div className='col-md mm-activity-table__head--data d-md-block'>Income</div>
                <div className='col-md mm-activity-table__head--data d-md-block'>Cash Flow</div>
                <div className='col-md-1 mm-activity-table__head--data d-md-block'>
                  <Info />
                </div>
              </div>
            </div>
            <div className='mm-activity-table__body'>
              {transactions.map((item, index) => (
                <div
                  className='row no-gutters mm-activity-table__body--wrapper'
                  key={index}
                  onClick={() => openEditActivityModal(item.id)}
                >
                  <div className='col-4 col-md mm-activity-table__body--data'>
                    {' '}
                    <span className='d-block d-md-none'>Date</span>
                    {getDateFormattedString(item.date)}
                  </div>
                  <div className='col-4 col-md mm-activity-table__body--data'>
                    <span className='d-block d-md-none'>Activity Type</span>
                    {formater(item.type)}
                  </div>
                  <div className='col-4 col-md mm-activity-table__body--data d-xl-block'>
                    <span className='d-block d-md-none'>Description</span>
                    {item.description}</div>

                    {priceHeader && <div className='col-4 col-md mm-activity-table__body--data'>
                      <span className='d-block d-md-none'>Price</span>
                        {item.price ? currencySymbol : ''}{item.price !== null ? numberWithCommas(fNumber(item.price, 2)) : ''}</div>}

                    {quantityHeader && <div className='col-4 col-md mm-activity-table__body--data'>
                      <span className='d-block d-md-none'>Quantity</span>
                      {item.quantity}</div>}

                  <div className='col-4 col-md mm-activity-table__body--data'>
                    <span className='d-block d-md-none'>Amount</span>
                    {currencySymbol}{item.amount !== null ? `${numberWithCommas(fNumber(item.amount, 2))}` : ''}
                  </div>
                  <div className='col-4 col-md mm-activity-table__body--data'> 
                    <span className='d-block d-md-none'>Balance</span>{item.balance !== null ? `${currencySymbol}${numberWithCommas(fNumber(item.balance, 2))}` : ''}
                  </div>
                  <div className='col-4 col-md mm-activity-table__body--data'> 
                    <span className='d-block d-md-none'>Income</span>{item.income ? 'Yes' : 'No'}
                  </div>
                  <div className='col-4 col-md mm-activity-table__body--data'> 
                    <span className='d-block d-md-none'>Cash Flow</span>{item.cashFlow ? 'Yes' : 'No'}
                  </div>
                  <div className='col-4 col-md-1 mm-activity-table__body--data'>
                    {item.updatedAt && <Edited className='mm-activity-table__body--data-edited d-none d-xl-inline' />}
                    {/* <Revert /> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <span className='no-data'>No transactions found</span>
      )}
      {activityDetails && (
        <ActivityDetailsModal
          activityDetailsModal={activityDetailsModal}
          activityDetails={activityDetails}
          closeEditActivityModal={closeEditActivityModalFun}
          currencySymbol={currencySymbol}
        />
      )}
    </section>
  );
};

export default ActivityTable;
