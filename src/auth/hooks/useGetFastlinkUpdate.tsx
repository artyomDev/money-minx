import { useEffect, useState } from 'react';

import { getFastlinkUpdate } from 'api/request.api';

const useGetFastlinkUpdate = (accountId: number, update = false, refresh = false) => {
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (accountId) {
      const fetchFastlinkUpdate = async () => {
        setLoading(true);
        const { data, error: err } = await getFastlinkUpdate(accountId, update, refresh);
        if (err) {
          setError(err);
        } else {
          setData(data);
        }
        setLoading(false);
      }

      fetchFastlinkUpdate();
    }
  }, [accountId]);

  return { loading, data, error };
};

export default useGetFastlinkUpdate;
