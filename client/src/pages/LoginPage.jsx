//client/src/pages/LoginPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function LoginPage() {
  const nav = useNavigate();

  useEffect(() => {
    console.log('%c[Admin Login]', 'color: green; font-weight: bold;');
    console.log('Admin Login URL: https://map-prj.vercel.app/admin-login');
  }, []);

  const handleAdmin = () => {
    sessionStorage.setItem('isAdmin', true); // Temporary auth mock
    nav('/admin');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-6 font-bold">MapPrj Admin Login</h1>
      <button
        onClick={handleAdmin}
        className="px-6 py-2 mb-4 bg-blue-600 text-white rounded shadow"
      >
        Login as Admin
      </button>
      <button 
        onClick={() => nav('/map')}
        className="px-6 py-2 bg-gray-300 rounded shadow"
      >
        Continue as Guest
      </button>
    </div>
  );
}

