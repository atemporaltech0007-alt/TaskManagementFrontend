import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login();
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.errorMessage || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Task Management</h2>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 15 }}>
          <input type="text" placeholder="Username" disabled style={{ width: '100%', padding: 10 }} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <input type="password" placeholder="Password" disabled style={{ width: '100%', padding: 10 }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
