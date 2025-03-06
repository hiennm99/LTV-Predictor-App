import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoutes: React.FC<PrivateRouteProps> = ({ children }) => {
    const navigate = useNavigate();
    const account = useSelector((state: RootState) => state.User.user);

    useEffect(() => {
        if (!account?.isAuthenticated || !account?.token) {
            navigate('/login', { replace: true });
        }
    }, [account, navigate]);

    if (!account?.isAuthenticated || !account?.token) {
        return null; // Tránh render nội dung nếu chưa authen
    }

    return <>{children}</>;
};

export default PrivateRoutes;
