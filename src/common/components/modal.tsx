import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface Size {
  xl: string;
  lg: string;
  mdx: string;
  md: string;
  sm: string;
  xs: string;
  xxl: string;
  fastlink: string;
}

export enum ModalTypeEnum {
  NO_HEADER = 'NO_HEADER',
}

interface Props {
  title: string;
  open: boolean;
  backdrop?: boolean;
  canBeClosed?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  size?: keyof Size;
  type?: ModalTypeEnum;
  bgColor?: string;
  loading?: boolean;
  yoddle?: boolean;
}

export interface ModalType {
  open: () => void;
  close: () => void;
  props: {
    open: boolean;
    onClose: () => void;
  };
}

const Modal: React.FC<Props> = ({
  open,
  type,
  title,
  loading,
  onClose,
  bgColor,
  children,
  size = 'md',
  backdrop = true,
  canBeClosed = false,
  yoddle = false,
}) => {
  const classNames = `${backdrop ? 'modal mm-modal-backdrop' : 'modal'} modal-${open ? 'show' : 'hide'}`;
  const modalClasses = `modal-dialog modal-dialog-centered modal-${size}`;
  const clickOutsideModalHandler = (event: any) => {

    if (!yoddle && event?.target?.className === 'modal mm-modal-backdrop modal-show') {
      onClose();
    }
  };

  return (
    <div className={classNames} tabIndex={-1} role='dialog' aria-hidden='true' onClick={clickOutsideModalHandler}>
      <div className={modalClasses} role='document'>
        <div className={`modal-content ${loading ? 'loading' : ''}`.trim()} style={{ backgroundColor: bgColor }}>
          {type === ModalTypeEnum.NO_HEADER ? null : (
            <div className='modal-header'>
              <span className='modal-title' style={{ color: bgColor ? 'white' : 'inherit' }}>
                {title}
              </span>
              {canBeClosed && (
                <div onClick={() => onClose()} className='close' role='button'>
                  <AiOutlineClose className='modal-close' style={{ color: bgColor ? 'white' : 'inherit' }} />
                </div>
              )}
            </div>
          )}
          <div className='modal-body'>{children}</div>
        </div>
      </div>
    </div>
  );
};

function useModal(state: boolean = false): ModalType {
  const [open, setOpen] = useState(state);
  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    props: {
      open,
      onClose: () => setOpen(false),
    },
  };
}

export { Modal, useModal };
