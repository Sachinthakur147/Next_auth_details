import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('role');
    router.push('/login');
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
