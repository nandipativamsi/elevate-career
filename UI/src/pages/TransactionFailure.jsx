import React from 'react';
import { useHistory } from 'react-router-dom';

const TransactionFailure = () => {
    const navigate = useHistory();

    const handleContinue = () => {
        navigate.push('/viewEvents'); // Redirect to homepage or another route
    };

    return (
        <div className="my-5 align-text-center">
            <h1>Transaction Failed!</h1>

            <div className="mt-2 fs-5">
                {/* <p><strong>Transaction ID:</strong> {transactionDetails.transactionId}</p>
                <p><strong>Amount Paid:</strong> ${transactionDetails.amount}</p>
                <p><strong>Date:</strong> {new Date(transactionDetails.date).toLocaleDateString()}</p> */}
            </div>
            <button 
                onClick={handleContinue} 
                className='my-btn'>
                Continue
            </button>
        </div>
    );
};

export default TransactionFailure;
