import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export type PlaceholderType = 'chart' | 'investment' | 'other' | 'liabilities' | 'networth';

export interface PlaceholderProps {
    type: PlaceholderType;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ type }) => {
    const [message, setMessage] = useState<string>('');

    const messagesObject = {
        chart: 'Add your first account to start displaying your net worth chart.',
        investment: 'You don\'t have any investment assets yet. Get started by adding an account.',
        other: 'You don\'t have any other assets yet. Get started by adding an account.',
        liabilities: 'You don\'t have any liabilities assets yet. Get started by adding an account.',
        networth: 'Add your first account to start calculating your net worth.'
    }

    useEffect(() => {
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
        };
        setMessage(message)
    }, [type, messagesObject]);

    return (
        <div className='networth-placeholder'>
            <p>{message}</p>
            <Link to='/connect-account' className='mm-btn-animate mm-btn-primary'>
                Add an account
            </Link>
        </div>
    )
}