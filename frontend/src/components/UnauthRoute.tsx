import React from 'react';

import { FC } from 'react'
import { useAppSelector } from '../store/storeHooks'
import { Navigate } from 'react-router-dom';

interface UnauthRouteProps {
    children : React.ReactNode
}

const UnauthRoute: FC<UnauthRouteProps> = ({children}) => {
    const isAuth = useAppSelector((state) => state.user.isAuth);
    return !isAuth ? children : <Navigate to="/" />;
}

export default UnauthRoute;