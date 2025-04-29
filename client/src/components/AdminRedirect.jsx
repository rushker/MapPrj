//client/src/components/AdminRedirect.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminRedirect({ children }) {
  const nav = useNavigate();

  useEffect(() => {
    // This is a placeholder. Replace it with your real auth logic.
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      nav('/');
    }
  }, [nav]);

  return <>{children}</>;
}
