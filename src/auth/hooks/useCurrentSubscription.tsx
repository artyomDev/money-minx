import { useEffect, useState } from 'react';

import { isEmpty } from 'common/common-helper';
import { ERequestStatus } from 'common/common.types';
import { ICurrentSubscription } from 'auth/auth.types';
import { setCurSubscription } from 'auth/auth.actions';
import { getCurrentSubscription } from 'api/request.api';
import { useAuthDispatch, useAuthState } from 'auth/auth.context';

const useCurrentSubscription = () => {
  const dispatch = useAuthDispatch();
  const { currentSubscription: curSubscription } = useAuthState();
  const [state, setState] = useState<ERequestStatus>(ERequestStatus.INITIAL);
  const [currentSubscription, setCurrentSubscription] = useState<ICurrentSubscription>();

  const hasCurrentSubscription = !isEmpty(curSubscription);

  useEffect(() => {
    (async () => {
      if (hasCurrentSubscription) {
        return;
      }

      const { data, error } = await getCurrentSubscription();
      if (error || !data) {
        return setState(ERequestStatus.WITH_ERROR);
      }
      setState(ERequestStatus.WITH_DATA);
      dispatch(setCurSubscription(data));

      return setCurrentSubscription(data);
    })();
  }, [dispatch, hasCurrentSubscription]);

  return {
    currentSubscription: curSubscription || currentSubscription,
    fetchingCurrentSubscription: state === ERequestStatus.PROCESSING,
    currentSubError: state === ERequestStatus.WITH_ERROR ? 'Error on fetching current subscription' : null,
  };
};

export default useCurrentSubscription;
