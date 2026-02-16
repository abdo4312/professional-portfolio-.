import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Page Not Found</h2>
                <p className="text-slate-600 mb-10 max-w-md mx-auto">
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>
                <Link to="/">
                    <Button>Back to Home</Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
