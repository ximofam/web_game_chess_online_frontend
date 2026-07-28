import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * A headless component that sits inside the <BrowserRouter> and listens for 
 * custom API error events dispatched by axios interceptors.
 * It uses `useNavigate` to transition to error pages seamlessly.
 */
export default function GlobalApiErrorHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNotFound = () => {
      navigate('/404', { replace: true });
    };

    const handleForbidden = () => {
      navigate('/403', { replace: true });
    };

    window.addEventListener('api:404', handleNotFound);
    window.addEventListener('api:403', handleForbidden);

    return () => {
      window.removeEventListener('api:404', handleNotFound);
      window.removeEventListener('api:403', handleForbidden);
    };
  }, [navigate]);

  // Headless component
  return null;
}
