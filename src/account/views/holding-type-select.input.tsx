import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/esm/Dropdown';

import { formatHoldingTypeAmount } from 'account/views/holdings-details.modal';
import { HoldingsTypeUpperOptions } from 'account/enum/holdings-type-upper-options';
import { enumerateStr } from 'common/common-helper';

interface HoldingTypeSelectInputProps {
  args: any[];
  onChange: (e: React.ChangeEvent<any>) => void;
  value: string;
  name: string;
}

export const HoldingTypeSelectInput: React.FC<HoldingTypeSelectInputProps> = ({ name, args, onChange, value }) => {
  const [show, setShow] = useState(false);

  for (let i = 0; i < args.length; i++) {
    if (enumerateStr(HoldingsTypeUpperOptions).includes(args[i])) {
      args[i] = args[i].toLowerCase();
    }
  }

  return (
    <Dropdown className='drop-box dropdown-select-input' onToggle={(nextShow) => setShow(nextShow)} show={show}>
      <Dropdown.Toggle className='dropdown-toggle'>{formatHoldingTypeAmount(value)}</Dropdown.Toggle>
      <Dropdown.Menu className='mm-dropdown-menu'>
        <ul className='checkbox-list single'>
          {args.sort()?.map((val, index) => {
            return (
              <li key={index}>
                <label>
                  <input
                    name={name}
                    type='checkbox'
                    aria-describedby={val}
                    value={val}
                    aria-checked={val === value}
                    checked={val === value}
                    onChange={(e) => {
                      onChange(e);
                      setShow(false);
                    }}
                  />
                  <span>{formatHoldingTypeAmount(val)}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Dropdown.Menu>
    </Dropdown>
  );
};
