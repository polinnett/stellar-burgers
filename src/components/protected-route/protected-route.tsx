import { Navigate, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

type Props = {
  element: ReactElement;
  onlyUnAuth?: boolean;
};

export default function ProtectedRoute({ element, onlyUnAuth }: Props) {
  const location = useLocation();

  // TODO: заменить на реальную проверку авторизации из Redux
  const isAuth = false;

  if (onlyUnAuth && isAuth) {
    return <Navigate to='/' replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
}
