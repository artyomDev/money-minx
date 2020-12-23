import React from 'react';
import { Helmet } from 'react-helmet';

import privacyData from '@mm/data/privacy.json';
import WebsiteLayout from 'website/website.layout';

const { privacy } = privacyData;

const privacyContentSection = () => {
  const privacyContent = privacy.data.map((d, i) => {
    return (
      <div key={i}>
        <h2 className='notice-content-title'>{d.title}</h2>
        <div className='notice-content' dangerouslySetInnerHTML={{ __html: d.content }} />
      </div>
    );
  });
  return <>{privacyContent}</>;
};

const Privacy = () => {
  return (
    <WebsiteLayout>
      <Helmet>
        <title>Money Minx Privacy Policy | Money Minx</title>
      </Helmet>
      <div className='mm-container wrapper notice-wrapper'>
        <div className='notice-header'>
          <h1>{privacy.title}</h1>
          <p className='notice-date'>{privacy.update}</p>
          <div dangerouslySetInnerHTML={{ __html: privacy.info }}/>
        </div>
        {privacyContentSection()}
      </div>
    </WebsiteLayout>
  );
};

export default Privacy;
