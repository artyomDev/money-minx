import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export type PlaceholderType = 'chart' | 'investment' | 'other' | 'liabilities' | 'networth' | 'manual' | 'acctDetail';

export interface PlaceholderProps {
    type: PlaceholderType;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ type }) => {
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const messagesObject = {
          chart: 'Add your first account to start displaying your net worth chart.',
          investment: 'You don\'t have any investment assets yet. Get started by adding an account.',
          other: 'You don\'t have any other assets yet. Get started by adding an account.',
          liabilities: 'You don\'t have any liabilities assets yet. Get started by adding an account.',
          networth: 'Add your first account to start calculating your net worth.',
          manual: 'You don\'t have any manual accounts yet. Get started by adding an account.',
          acctDetail: 'We don\' have details on this account yet. Check back soon.',
        }
        let message = '';
        switch (type) {
            case 'chart':
                message = messagesObject.chart;
                break;
            case 'investment':
                message = messagesObject.investment;
                break;
            case 'other':
                message = messagesObject.other;
                break;
            case 'liabilities':
                message = messagesObject.liabilities;
                break;
            case 'networth':
                message = messagesObject.networth;
                break;
          case 'manual':
            message = messagesObject.manual;
            break;
          case 'acctDetail':
            message = messagesObject.acctDetail;
            break;
        }
        setMessage(message)
    }, [type]);

    return (
        <div className='networth-placeholder'>
            <p>{message}</p>
          {type !== 'acctDetail' ?
            <Link to='/connect-account' className='mm-btn-animate mm-btn-primary'>
              Add an account
            </Link> : null}
        </div>
    )
}
