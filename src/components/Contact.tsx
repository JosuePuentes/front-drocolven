import React from 'react';

const Contact: React.FC = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Contact Information</h2>
            <p>
                <strong>Email:</strong> example@example.com
            </p>
            <p>
                <strong>Phone:</strong> +1 (123) 456-7890
            </p>
            <p>
                <strong>Address:</strong> 123 Main Street, City, Country
            </p>
        </div>
    );
};

export default Contact;