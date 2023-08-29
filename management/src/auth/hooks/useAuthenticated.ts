import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from 'auth/state';

interface useAuthenticatedOptions {
  requireAuthentication?: boolean;
}

export function useAuthenticated(options?: useAuthenticatedOptions): boolean {
  const {accessToken} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (options?.requireAuthentication && !accessToken) {
      navigate('/auth');
    } else if (options?.requireAuthentication === false && accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate, options?.requireAuthentication]);

  return !!accessToken;
}
