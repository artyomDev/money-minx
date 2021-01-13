import { useEffect } from 'react';

import appEnv from 'app/app.env';

const useCrisp = () => {
  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = appEnv.CRISP_WEBSITE_ID;
    (() => {
      const d = document;
      const s = d.createElement('script');
      s.src = 'https://client.crisp.chat/l.js';
      s.async = true;
      d.getElementsByTagName('head')[0].appendChild(s);
    })();
  }, []);
};

export default useCrisp;
