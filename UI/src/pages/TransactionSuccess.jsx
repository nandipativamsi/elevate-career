import React from 'react';
import { useHistory } from 'react-router-dom';

const TransactionSuccess = () => {
    const navigate = useHistory();

    const handleContinue = () => {
        navigate.push('/viewEvents'); // Redirect to homepage or another route
    };

    return (
        <div className="my-5 align-text-center">
            <h1>Transaction Successful!</h1>
            <p>Thank you for your payment.</p>
            <div className="mt-2 fs-5">
                {/* <p><strong>Transaction ID:</strong> {transactionDetails.transactionId}</p>
                <p><strong>Amount Paid:</strong> ${transactionDetails.amount}</p>
                <p><strong>Date:</strong> {new Date(transactionDetails.date).toLocaleDateString()}</p> */}
            </div>
            <button
                className='my-btn'
                onClick={handleContinue}>
                Continue
            </button>
        </div>
    );
};

export default TransactionSuccess;
