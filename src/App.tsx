import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { login } from './api';
import Layout from './Layout';
import Tasks from './Tasks';
import TaskForm from './TaskForm';
import States from './States';
import StateForm from './StateForm';

function LoginPage() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validUser = import.meta.env.VITE_LOGIN_USER;
    const validPassword = import.meta.env.VITE_LOGIN_PASSWORD;
    
    if (user !== validUser || password !== validPassword) {
      setError('Invalid credentials');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const token = await login();
      localStorage.setItem('token', token);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.errorMessage || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#2c3e50', padding: '20px' }}>
      <div className="card" style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30, fontSize: 24, color: '#2c3e50' }}>Task Management System</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Enter username"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="form-control"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', fontSize: 16, padding: 12 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/tasks" replace />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/new" element={<TaskForm />} />
          <Route path="tasks/edit/:id" element={<TaskForm />} />
          <Route path="states" element={<States />} />
          <Route path="states/new" element={<StateForm />} />
          <Route path="states/edit/:id" element={<StateForm />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
