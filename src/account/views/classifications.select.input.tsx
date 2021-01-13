import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/esm/Dropdown';

interface ClassificationsSelectInputProps {
  args: any[];
  onChange: (e: React.ChangeEvent<any>) => void;
  value: string;
  id: string;
  tabName: string;
  classifications: any;
}

export const ClassificationsSelectInput: React.FC<ClassificationsSelectInputProps> = ({ args, onChange, value, id, tabName, classifications }) => {
  const [show, setShow] = useState(false);

  const checkDisabled = (tabName: string, element: string) => {
    for (let i = 0; i < classifications[`${tabName}`].length; i++) {
      if (classifications[`${tabName}`][i].classificationValue === element) {
        return true;
      }
    }
    return false;
  }

  return (
    <Dropdown className='drop-box dropdown-select-input' onToggle={(nextShow) => setShow(nextShow)} show={show}>
      <Dropdown.Toggle className='dropdown-toggle'>{value}</Dropdown.Toggle>
      <Dropdown.Menu className='mm-dropdown-menu'>
        <ul className='checkbox-list single'>
          {args.sort()?.map((val, index) => {
            return (
              <li key={index}>
                <label>
                  <input
                    type='checkbox'
                    aria-describedby={val}
                    value={val}
                    aria-checked={val === value}
                    checked={val === value}
                    onChange={(e) => {
                      onChange(e);
                      setShow(false);
                    }}
                    id={id}
                    disabled={checkDisabled(tabName, val)}
                  />
                  <span>{val}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Dropdown.Menu>
    </Dropdown>
  );
};
