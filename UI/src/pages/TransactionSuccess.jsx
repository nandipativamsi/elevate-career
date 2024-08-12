import React from 'react';
import { useHistory } from 'react-router-dom';

const TransactionSuccess = () => {
    const navigate = useHistory();

    const handleContinue = () => {
        navigate.push('/viewEvents'); // Redirect to homepage or another route
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Transaction Successful!</h1>
            <p>Thank you for your payment.</p>
            <div style={{ marginTop: '20px', fontSize: '18px' }}>
                {/* <p><strong>Transaction ID:</strong> {transactionDetails.transactionId}</p>
                <p><strong>Amount Paid:</strong> ${transactionDetails.amount}</p>
                <p><strong>Date:</strong> {new Date(transactionDetails.date).toLocaleDateString()}</p> */}
            </div>
            <button 
                onClick={handleContinue} 
                style={{ marginTop: '30px', padding: '10px 20px', fontSize: '16px' }}>
                Continue
            </button>
        </div>
    );
};

export default TransactionSuccess;
