//client/src/components/AdminRedirect.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminRedirect({ children }) {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      nav('/admin-login');
    } else {
      setLoading(false);
    }
  }, [nav]);

  if (loading) return null; // Or show a loading spinner

  return <>{children}</>;
}

