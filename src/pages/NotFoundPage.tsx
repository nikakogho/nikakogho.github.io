import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>Oops! It seems the page you're looking for doesn't exist or has been moved.</p>
            <p>
                You can return to the <Link to="/">Home</Link> or try navigating using the header.
            </p>
        </div>
    );
};

export default NotFoundPage;