import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoutes: React.FC<PrivateRouteProps> = ({ children }) => {
    const account = useSelector((state: RootState) => state.User.user[0]);
    if (!account?.isAuthenticated || !account?.token) {
        
        return (
            <div>
                <p>You are not authenticated. Please log in to access this page.</p>
            </div>
        );
    }

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
};

export default PrivateRoutes;
