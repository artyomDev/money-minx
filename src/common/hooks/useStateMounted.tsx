import { useState } from 'react';

import useMounted from './useMounted';

const useStateMounted = <T,>(initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const isMounted = useMounted();
  const [state, setState] = useState(initialValue);

  const newSetState = (value: any) => {
    if (isMounted.current) {
      return setState(value);
    }
  };
  return [state, newSetState];
};

export default useStateMounted;
