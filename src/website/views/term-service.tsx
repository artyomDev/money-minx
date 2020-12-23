import React from 'react';
import { Helmet } from 'react-helmet';

import termData from '@mm/data/terms.json';
import WebsiteLayout from 'website/website.layout';

const { terms } = termData;

const termContentSection = () => {
  const privacyContent = terms.data.map((d, i) => {
    return (
      <div key={i}>
        <h2 className='notice-content-title'>{d.title}</h2>
        <div className='notice-content' dangerouslySetInnerHTML={{ __html: d.content }} />
      </div>
    );
  });
  return <>{privacyContent}</>;
};
const TermOfService = () => {
  return (
    <WebsiteLayout>
      <Helmet>
        <title>Money Minx Terms of Service | Money Minx</title>
      </Helmet>
      <div className='mm-container wrapper notice-wrapper'>
        <div className='notice-header'>
          <h1>{terms.title}</h1>
          <p>{terms.update}</p>
        </div>
        {termContentSection()}
      </div>
    </WebsiteLayout>
  );
};

export default TermOfService;
