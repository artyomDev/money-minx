import React, { useEffect, useState } from 'react';

import { TokenType, YodleeHookType } from './yodlee.type';

const useYodlee: YodleeHookType = ({
  containerId = 'fastlinkContainer',
  fastLinkOptions: { fastLinkURL, token, config },
  onSuccess,
  onError,
  onClose,
  onEvent,
}) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState(null);
  const [active, setActive] = useState(false);
  const [scriptTagCreated, setScriptTagCreated] = useState(false);

  const fastlink = window.fastlink;

  useEffect(() => {
    if (fastlink) {
      setActive(true);
    }
  }, [fastlink]);

  useEffect(() => {
    let script: HTMLScriptElement;
    const body: Node = document.body;
    if (!scriptTagCreated && fastLinkURL) {
      script = document.createElement('script');

      script.id = 'yodlee-fastlink-script';
      script.src = 'https://cdn.yodlee.com/fastlink/v4/initialize.js';
      script.async = true;
      script.defer = true;
      script.onload = () => setReady(true);
      script.onerror = () => setError('Yodlee FastLink library could not be loaded!');

      const s = document.getElementById('yodlee-fastlink-script');
      if (!s) {
        body.appendChild(script);
        setScriptTagCreated(true);
      }
    }

    return () => {
      window.fastlink?.close();
      if (scriptTagCreated && script) {
        body.removeChild(script);
      }
    };
  }, [fastLinkURL, scriptTagCreated, config]);

  const init = (currentToken?: TokenType) => {
    const getTokenString = (t?: TokenType) => {
      if (!t) {
        return {};
      }

      switch (t.tokenType) {
        case 'AccessToken': {
          return { accessToken: `Bearer ${t.tokenValue}` };
        }
        case 'JwtToken': {
          return { jwtToken: `Bearer ${t.tokenValue}` };
        }
      }
    };

    if (!active) {
      return <p>Loading......</p>;
    }

    window.fastlink?.open(
      {
        fastLinkURL,
        params: config,
        ...getTokenString(currentToken || token),
        onSuccess: (customerData: any) => {
          setData(customerData);
          // tslint:disable-next-line: no-unused-expression
          onSuccess && onSuccess(customerData);
        },
        onError: (fastLinkError: any) => {
          setError(fastLinkError);
          // tslint:disable-next-line: no-unused-expression
          onError && onError(fastLinkError);
        },
        onClose,
        onEvent,
      },
      containerId
    );
  };

  return {
    init,
    data,
    error,
    ready,
    active,
  };
};

export default useYodlee;
