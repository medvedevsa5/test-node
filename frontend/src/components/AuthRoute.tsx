import { FC } from 'react'
import { useAppSelector } from '../store/storeHooks'
import { Navigate } from 'react-router-dom';

interface AuthRouteProps {
    children : React.ReactNode
}

const AuthRoute: FC<AuthRouteProps> = ({children}) => {
    const isAuth = useAppSelector((state) => state.user.isAuth);
    return isAuth ? children : <Navigate to="/" />;
}

export default AuthRoute;