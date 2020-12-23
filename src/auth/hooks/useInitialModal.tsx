/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

import { ModalType } from 'common/components/modal';

const useInitialModal = (open: boolean, modal: ModalType) => {
  useEffect(() => {
    if (open) {
      modal.open();
    }
  }, [open]);
};

export default useInitialModal;
