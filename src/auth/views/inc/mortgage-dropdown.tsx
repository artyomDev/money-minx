import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/esm/Dropdown';

import { Mortgage, MortgageList } from 'auth/auth.types';

interface MortgageDropdownProps {
  onChange: (e: React.ChangeEvent<any>, mortgage: Mortgage) => void;
  value: string;
  mortgageList: MortgageList;
  name: string;
}

const MortgageDropdown = (props: MortgageDropdownProps) => {
  const [show, setShow] = useState(false);
  const { value, onChange, mortgageList, name } = props;
  const displayName = mortgageList.find((m) => +m.id === +value)?.accountName;

  return (
    <Dropdown className='drop-box dropdown-select-input' onToggle={(nextShow) => setShow(nextShow)} show={show}>
      <Dropdown.Toggle className='dropdown-toggle'>{displayName || ''}</Dropdown.Toggle>
      <Dropdown.Menu className='mm-dropdown-menu'>
        <ul className='checkbox-list single'>
          {mortgageList?.map((mortgage, index) => {
            return (
              <li key={index}>
                <label>
                  <input
                    name={name}
                    type='checkbox'
                    aria-describedby={mortgage.accountName}
                    value={mortgage.accountName}
                    aria-checked={mortgage.accountName === value}
                    checked={mortgage.accountName === value}
                    onChange={(e) => {
                      onChange(e, mortgage);
                      setShow(false);
                    }}
                  />
                  <span>{mortgage.accountName}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MortgageDropdown;
