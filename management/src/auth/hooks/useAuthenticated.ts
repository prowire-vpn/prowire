import {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from 'auth/init';

interface useAuthenticatedOptions {
  requireAuthentication?: boolean;
}

export function useAuthenticated(options?: useAuthenticatedOptions): boolean {
  const {accessToken} = useContext(AuthContext);
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
