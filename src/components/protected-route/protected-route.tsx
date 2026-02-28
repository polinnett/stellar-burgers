import { Navigate, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  selectAuthChecked,
  selectUser
} from '../../services/slices/auth-slice';

type Props = {
  element: ReactElement;
  onlyUnAuth?: boolean;
};

export default function ProtectedRoute({ element, onlyUnAuth }: Props) {
  const location = useLocation();

  const isAuthChecked = useSelector(selectAuthChecked);
  const user = useSelector(selectUser);
  const isAuth = Boolean(user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuth) {
    return <Navigate to='/' replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
}
