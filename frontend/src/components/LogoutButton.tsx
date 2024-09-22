import React, { FC } from 'react'
import { useAppDispatch } from '../store/storeHooks';
import { logoutUser } from '../store/features/userActions';
import clsx from 'clsx';

interface LogoutButtonProps {
    className?: string;
}

const LogoutButton : FC<LogoutButtonProps> = ({className}) => {
  const dispatch = useAppDispatch();

  return (
    <button className={clsx(className, 'logout-button')} onClick={() => dispatch(logoutUser())} >Выйти</button>
  )
}

export default LogoutButton;