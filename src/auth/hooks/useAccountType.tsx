import { useEffect, useState } from 'react';

import { getAccountType } from 'api/request.api';
import { ERequestStatus } from 'common/common.types';

interface IAccountRes {
  data: string[];
  error: unknown;
}

const useAccountType = (isManual = false) => {
  const [res, setRes] = useState<IAccountRes>({
    data: [''],
    error: null,
  });
  const [state, setState] = useState(ERequestStatus.INITIAL);

  useEffect(() => {
    (async () => {
      setState(ERequestStatus.PROCESSING);
      const { error, data } = await getAccountType({ manual: isManual });
      setRes({ error, data });
      if (error) {
        return setState(ERequestStatus.WITH_ERROR);
      }

      return setState(ERequestStatus.WITH_DATA);
    })();
  }, [isManual]);

  return {
    loading: state === ERequestStatus.PROCESSING,
    error: res?.error,
    data: res?.data,
  };
};

export default useAccountType;
