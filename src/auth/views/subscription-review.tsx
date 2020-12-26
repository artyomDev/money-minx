import React from 'react';

import { AccountOverview } from 'setting/pages/account-overview';

const SubscriptionReview = () => {
  return (
    <section>
      <div className='subscription-ended bottom p-b-20 pt-5'>
        <div className='container'>
          <AccountOverview reviewSubscriptionFlag={true} />
        </div>
      </div>
    </section>
  );
};

export default SubscriptionReview;
