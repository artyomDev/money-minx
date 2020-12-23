import React from 'react';
import { Helmet } from 'react-helmet';

import noticeData from '@mm/data/notice.json';
import WebsiteLayout from 'website/website.layout';

const { notice } = noticeData;

const noticeContentSection = () => {
  const noticeContent = notice.data.map((d, i) => {
    return (
      <div key={i}>
        <h2 className='notice-content-title'>{d.title}</h2>
        <div className='notice-content' dangerouslySetInnerHTML={{ __html: d.content }} />
      </div>
    );
  });
  return <>{noticeContent}</>;
};

const Notice = () => {
  return (
    <WebsiteLayout>
      <Helmet>
        <title>Notices | Money Minx</title>
      </Helmet>
      <div className='mm-container notice-wrapper'>
        <div className='notice-header'>
          <h1>{notice.title}</h1>
          <p>{notice.update.replace(':date', 'July 29 2020')}</p>
        </div>
        {noticeContentSection()}
      </div>
    </WebsiteLayout>
  );
};

export default Notice;
