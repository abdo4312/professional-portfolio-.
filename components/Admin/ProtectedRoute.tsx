import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { restoreSession, isAuthenticatedAdmin } from '../../src/lib/supabaseClient';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Try to restore session from stored tokens
                const session = await restoreSession();

                if (session) {
                    // Verify the user is the admin
                    const isAdmin = await isAuthenticatedAdmin();
                    setIsAuthenticated(isAdmin);
                } else {
                    // Fallback: check if there's a token in localStorage
                    const token = localStorage.getItem('token');
                    setIsAuthenticated(!!token);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
