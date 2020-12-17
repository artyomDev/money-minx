import React, { useEffect, useRef, useState } from 'react';

import useToast from 'common/hooks/useToast';
import { logger } from 'common/logger.helper';
import { useAuthDispatch } from 'auth/auth.context';
import { getRefreshedAccount } from 'auth/auth.service';
import { Modal, ModalTypeEnum } from 'common/components/modal';
import CircularSpinner from 'common/components/spinner/circular-spinner';

import useYodlee from './useYodlee';
import { FastLinkOptionsType } from './yodlee.type';

interface Props {
  fastLinkModal: any;
  handleSuccess: () => void;
  fastLinkOptions: FastLinkOptionsType;
}

const FastLinkModal: React.FC<Props> = ({ fastLinkModal, handleSuccess, fastLinkOptions }) => {
  const initRef = useRef<any>();
  const { mmToast } = useToast();
  const dispatch = useAuthDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const onSuccess = async (args: any) => {
    logger.log('fastlink onsuccess arguments', args);

    setLoading(true);
    mmToast('Successfully Logged in with Yodlee', { type: 'success' });
    const { error } = await getRefreshedAccount({ dispatch });
    setLoading(false);

    if (error) {
      mmToast('Error Occurred on Fetching user Details', { type: 'error' });
    }

    return handleSuccess();
  };

  const onError = (err: any) => {
    logger.log('fastlink onerror log', err);
    const errorList = err
      ? Object.keys(err).map((ek, i) => (
          <li key={i}>
            {[ek]}:{err[ek]}
          </li>
        ))
      : null;

    return mmToast(<ul>{errorList}</ul>, { type: 'error', autoClose: false });
  };

  const onClose = async (args: any) => {
    logger.log('fastlink onclose arguments', args);
    return fastLinkModal.close();
  };

  const { init, active } = useYodlee({
    fastLinkOptions,
    onSuccess,
    onError,
    onClose,
  });

  const token = (fastLinkOptions.token as any) || '';
  const fastLinkURL = fastLinkOptions.fastLinkURL;

  useEffect(() => {
    if (fastLinkURL !== '' && active) {
      initRef?.current?.click();
    }
  }, [fastLinkURL, active, fastLinkOptions]);

  const handleInit = () => {
    init({ tokenValue: token, tokenType: 'AccessToken' });
  };

  return (
    <Modal
      {...fastLinkModal.props}
      title=''
      size={'sm'}
      canBeClosed
      loading={loading || !active}
      type={ModalTypeEnum.NO_HEADER}
    >
      <div className='fastlink-modal-container'>
        <div id='fastlinkContainer' />
        {loading || !active ? <CircularSpinner /> : null}
        <button ref={initRef} onClick={handleInit} className='hidden' />
      </div>
    </Modal>
  );
};

export default FastLinkModal;
