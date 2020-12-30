import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/esm/Dropdown';

import { IRealEstateAccount } from 'auth/auth.types';

interface IRealEstateDropdown {
  onChange: (e: React.ChangeEvent<any>) => void;
  value: string;
  name: string;
  realEstateAccounts: IRealEstateAccount[];
}

/**
 * Remove this dropdown and make one generic dropdown for all the fields having
 * 1. id
 * 2. accountName
 * 3. balance
 */
const RealEstateDropdown = (props: IRealEstateDropdown) => {
  const [show, setShow] = useState(false);
  const { value, onChange, realEstateAccounts, name } = props;
  const displayName = realEstateAccounts.find((item) => +item.id === +value)?.accountName || '';

  return (
    <Dropdown className='drop-box dropdown-select-input' onToggle={(nextShow) => setShow(nextShow)} show={show}>
      <Dropdown.Toggle className='dropdown-toggle'>{displayName}</Dropdown.Toggle>
      <Dropdown.Menu className='mm-dropdown-menu'>
        <ul className='checkbox-list single'>
          {realEstateAccounts.map((acc, index) => {
            return (
              <li key={index}>
                <label>
                  <input
                    name={name}
                    type='checkbox'
                    aria-describedby={acc.accountName}
                    value={+acc.id}
                    aria-checked={+acc.id === +value}
                    checked={+acc.id === +value}
                    onChange={(e) => {
                      onChange(e);
                      setShow(false);
                    }}
                  />
                  <span>{acc.accountName}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default RealEstateDropdown;
