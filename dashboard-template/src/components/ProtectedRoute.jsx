import { FC, ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/ContextAPI';
import Login from '../pages/Login';

const ProtectedRoute = ({ children }) => {
    const { organization } = useAppContext()
    const navigate = useNavigate();
    if (!organization._id) {
        <Navigate to={"/login"} />
    }

    return children;
};

export default ProtectedRoute;
